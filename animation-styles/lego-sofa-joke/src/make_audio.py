"""Mix: Gemini voices (assets/voice.wav) + a light synthesized pluck bed and a 'dun-dun' sting -> assets/mix.wav."""
import json, os, wave, numpy as np
R = 44100; ROOT = os.path.join(os.path.dirname(__file__), '..')
SK = json.loads(open(os.path.join(ROOT, 'assets', 'lines.js')).read().split('=', 1)[1].rstrip().rstrip(';'))
TOTAL, L = SK['total'], SK['lines']
w = wave.open(os.path.join(ROOT, 'assets', 'voice.wav')); voice = np.frombuffer(w.readframes(w.getnframes()), '<i2').astype(np.float32) / 32768
out = np.zeros(int(TOTAL * R), np.float32); out[:len(voice)] += voice[:len(out)]
def put(x, at, g=1.0):
    a = int(at * R); n = min(len(x), len(out) - a); out[a:a + n] += x[:n] * g
def pluck(f, d=0.5, g=0.25):
    n = int(R * d); buf = np.random.RandomState(int(f)).uniform(-1, 1, int(R / f)); y = np.zeros(n)
    for i in range(n): y[i] = buf[i % len(buf)]; buf[i % len(buf)] = 0.497 * (buf[i % len(buf)] + buf[(i + 1) % len(buf)])
    return y * g
notes = {'C': 261.6, 'E': 329.6, 'G': 392.0, 'A': 440.0, 'F': 349.2, 'D': 293.7, 'B': 246.9}
seq = 'C E G E A G E G F A C A G B D B'.split(); t, k = 0.3, 0
while t < L[4]['a'] - 0.1: put(pluck(notes[seq[k % len(seq)]] * (2 if k % 4 == 0 else 1)), t, 0.22); t += 0.42; k += 1
for at, f in [(L[4]['a'] + 0.15, 110), (L[4]['a'] + 0.55, 98)]:
    n = int(R * 1.0); tt = np.arange(n) / R; put((np.sin(2 * np.pi * f * tt) + 0.5 * np.sin(4 * np.pi * f * tt)) * np.exp(-tt * 3.0) * 0.28, at)
out = out / (np.max(np.abs(out)) + 1e-9) * 0.92
w = wave.open(os.path.join(ROOT, 'assets', 'mix.wav'), 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(R)
w.writeframes((np.stack([out, out], 1) * 32767).astype('<i2').tobytes()); w.close(); print('mix ok', TOTAL)
