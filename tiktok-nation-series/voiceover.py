# Generates a scene-synced English voiceover with Piper TTS and mixes it over the music.
# usage: python3 voiceover.py <voice.onnx | dir-of-line_N.wav> <cues.json> <silent.mp4> <out.mp4> [lines.json]
#   - a .onnx path synthesizes each line locally with Piper TTS
#   - a directory uses pre-generated takes named line_0.wav, line_1.wav, ... (e.g. Higgsfield voices)
# The music is regenerated (audio.py) to the final length, and the last frame is held if the voice runs long.
import json, subprocess, sys, wave, os, tempfile
import numpy as np

VOICE, CUES, VIDEO, OUT = sys.argv[1:5]
MAX_TEMPO = 1.15
HERE = os.path.dirname(os.path.abspath(__file__))
SR = 44100

# (start, end-of-scene, line) — each line must finish before its scene ends
LINES = [
    (0.25, 4.4,  "What if we built a nation... all together?"),
    (4.6,  8.4,  "A wild island, lost in the middle of the ocean."),
    (8.6,  12.4, "There's room here for millions of citizens."),
    (12.6, 16.0, "But right now... there's nothing."),
    (16.2, 20.0, "Here's the deal: one follower, equals one citizen."),
    (20.2, 23.6, "Today we're at zero. Will you be the first?"),
    (23.8, 28.6, "Every day, you vote. Buildings, laws, trade... even wars!"),
    (28.8, 37.2, "But first, our nation needs a name, and a flag. Write your idea in the comments. The most liked one wins!"),
    (37.3, 41.4, "First vote: where do we build the capital? A: on the beach, with a big port."),
    (41.6, 45.6, "Or B: right next to the volcano. Super fertile... but risky!"),
    (45.8, 50.6, "Comment A or B, follow, and come live here. See you tomorrow, for day two!"),
]

# optional 5th argument: a JSON file with [[start, scene_end, text], ...] for another episode
if len(sys.argv) > 5:
    LINES = [tuple(x) for x in json.load(open(sys.argv[5]))]

def read_wav(p):
    with wave.open(p) as w:
        sr, ch = w.getframerate(), w.getnchannels()
        a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
    if ch == 2: a = a.reshape(-1, 2).mean(1)
    return a, sr

tmp = tempfile.mkdtemp()
clips = []; prev_end = 0.0
for i, (t0, t1, text) in enumerate(LINES):
    raw = os.path.join(tmp, f'l{i}.wav'); fit = os.path.join(tmp, f'f{i}.wav')
    if os.path.isdir(VOICE):
        raw = os.path.join(VOICE, f'line_{i}.wav')
        if not os.path.exists(raw):  # accept FLAC takes too (e.g. voice_kevin/)
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(VOICE, f'line_{i}.flac'), os.path.join(tmp, f'r{i}.wav')], check=True)
            raw = os.path.join(tmp, f'r{i}.wav')
    else:
        subprocess.run([sys.executable, '-m', 'piper', '-m', VOICE, '--length-scale', '0.92', '-f', raw],
                       input=text.encode(), check=True, capture_output=True)
    a, sr = read_wav(raw)
    # trim silence
    nz = np.where(np.abs(a) > 0.01)[0]; a = a[max(0, nz[0] - 200): nz[-1] + 2000]
    start = max(t0, prev_end + 0.12)
    dur = len(a) / sr; room = (t1 - start) - 0.1
    tempo = min(MAX_TEMPO, max(1.0, dur / room))
    # resample to 44.1k, speed up if needed (pitch preserved), light energy boost
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(sr), '-ac', '1', '-i', '-',
                    '-af', f'atempo={tempo:.3f},highpass=f=90,acompressor=threshold=-18dB:ratio=3:attack=5:release=80,aresample={SR}',
                    fit], input=a.tobytes(), check=True)
    b, _ = read_wav(fit)
    clips.append((start, b)); prev_end = start + len(b) / SR
    print(f'{start:5.2f}s -> {prev_end:5.2f}s  x{tempo:.2f}  {text}')

cues = json.load(open(CUES))
total = max(cues['dur'], prev_end + 0.9)
hold = total - cues['dur']
cues['dur'] = total
cue_ext = os.path.join(tmp, 'cues.json'); json.dump(cues, open(cue_ext, 'w'))
music_wav = os.path.join(tmp, 'music.wav')
subprocess.run([sys.executable, os.path.join(HERE, 'audio.py'), cue_ext, music_wav], check=True, capture_output=True)
music, _ = read_wav(music_wav); n = len(music)
voice = np.zeros(n, np.float32)
for start, b in clips:
    s = int(start * SR); e = min(n, s + len(b)); voice[s:e] += b[:e - s]

voice /= max(1e-9, np.abs(voice).max()); voice *= 0.95
# duck music under the voice
envl = np.convolve(np.abs(voice), np.ones(int(.12 * SR)) / int(.12 * SR), 'same')
duck = 1 - 0.65 * np.clip(envl / 0.05, 0, 1)
duck = np.convolve(duck, np.ones(int(.08 * SR)) / int(.08 * SR), 'same')
mix = music * duck * 0.55 + voice
mix /= max(1.0, np.abs(mix).max() / 0.97)
out_wav = os.path.join(tmp, 'mix.wav')
with wave.open(out_wav, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(np.repeat((mix * 32767).astype(np.int16)[:, None], 2, 1).tobytes())
vf = ['-vf', f'tpad=stop_mode=clone:stop_duration={hold:.2f}'] if hold > 0 else []
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', VIDEO, '-i', out_wav, *vf, '-c:v', 'libx264', '-preset', 'slow', '-crf', '23',
                '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', OUT], check=True)
print('wrote', OUT)
