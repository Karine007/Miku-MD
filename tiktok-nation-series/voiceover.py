# Generates a scene-synced English voiceover with Piper TTS and mixes it over the music.
# usage: python3 voiceover.py <voice.onnx> <music.wav> <silent.mp4> <out.mp4>
import json, subprocess, sys, wave, os, tempfile
import numpy as np

VOICE, MUSIC, VIDEO, OUT = sys.argv[1:5]
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
    (37.4, 41.4, "First vote: where do we build the capital? A: on the beach, with a big port."),
    (41.6, 45.6, "Or B: right next to the volcano. Super fertile... but risky!"),
    (45.8, 50.6, "Comment A or B, follow, and come live here. See you tomorrow, for day two!"),
]

def read_wav(p):
    with wave.open(p) as w:
        sr, ch = w.getframerate(), w.getnchannels()
        a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
    if ch == 2: a = a.reshape(-1, 2).mean(1)
    return a, sr

music, msr = read_wav(MUSIC); assert msr == SR
n = len(music)
voice = np.zeros(n, np.float32)
tmp = tempfile.mkdtemp()
for i, (t0, t1, text) in enumerate(LINES):
    raw = os.path.join(tmp, f'l{i}.wav'); fit = os.path.join(tmp, f'f{i}.wav')
    subprocess.run([sys.executable, '-m', 'piper', '-m', VOICE, '--length-scale', '0.92', '-f', raw],
                   input=text.encode(), check=True, capture_output=True)
    a, sr = read_wav(raw)
    # trim silence
    nz = np.where(np.abs(a) > 0.01)[0]; a = a[max(0, nz[0] - 200): nz[-1] + 2000]
    dur = len(a) / sr; room = (t1 - t0) - 0.15
    tempo = max(1.0, dur / room)
    # resample to 44.1k, speed up if needed (pitch preserved), light energy boost
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(sr), '-ac', '1', '-i', '-',
                    '-af', f'atempo={tempo:.3f},highpass=f=90,acompressor=threshold=-18dB:ratio=3:attack=5:release=80,aresample={SR}',
                    fit], input=a.tobytes(), check=True)
    b, _ = read_wav(fit)
    s = int(t0 * SR); e = min(n, s + len(b)); voice[s:e] += b[:e - s]
    print(f'{t0:5.1f}s  {dur:4.2f}s -> x{tempo:.2f}  {text}')

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
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', VIDEO, '-i', out_wav, '-c:v', 'libx264', '-preset', 'slow', '-crf', '23',
                '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', OUT], check=True)
print('wrote', OUT)
