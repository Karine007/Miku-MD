"""Mix: Gemini voices + a light synthesized music bed, a 'dun-dun' sting and a whoosh -> assets/mix.wav (26 s)."""
import os, wave, numpy as np
R = 44100; ROOT = os.path.join(os.path.dirname(__file__), '..'); VO = os.path.join(ROOT, 'assets', 'vo')
TOTAL, OFFSET, LAUGH_AT = 26.0, 0.3, 20.0
def read(p):
    w = wave.open(p); x = np.frombuffer(w.readframes(w.getnframes()), '<i2').astype(np.float32) / 32768; r = w.getframerate()
    return np.interp(np.arange(0, len(x) * R / r) * r / R, np.arange(len(x)), x)
out = np.zeros(int(TOTAL * R), np.float32)
def put(x, at, g=1.0):
    a = int(at * R); n = min(len(x), len(out) - a); out[a:a + n] += x[:n] * g
dlg = read(os.path.join(VO, 'dialogue.wav')); put(dlg, OFFSET, 1.0)
lau = read(os.path.join(VO, 'laugh.wav'))[int(3.6 * R):int(9.6 * R)]; env = np.ones(len(lau)); env[-int(0.6 * R):] = np.linspace(1, 0, int(0.6 * R)); put(lau * env, LAUGH_AT + 0.05, 1.15)
def pluck(f, d=0.6, g=0.25):
    n = int(R * d); buf = np.random.RandomState(int(f)).uniform(-1, 1, int(R / f)); y = np.zeros(n)
    for i in range(n): y[i] = buf[i % len(buf)]; buf[i % len(buf)] = 0.497 * (buf[i % len(buf)] + buf[(i + 1) % len(buf)])
    return y * g
notes = {'C': 261.6, 'E': 329.6, 'G': 392.0, 'A': 440.0, 'F': 349.2, 'D': 293.7, 'B': 246.9}
seq = 'C E G E A G E G F A C A G B D B'.split()
t = 0.3; k = 0
while t < 17.2: put(pluck(notes[seq[k % len(seq)]] * (2 if k % 4 == 0 else 1), 0.5, 0.06), t); t += 0.42; k += 1
for at, f in [(17.55, 110), (17.95, 98)]:  # dun-dun sting
    n = int(R * 0.9); tt = np.arange(n) / R; put((np.sin(2 * np.pi * f * tt) + 0.5 * np.sin(4 * np.pi * f * tt)) * np.exp(-tt * 3.5) * 0.28, at)
n = int(R * 0.5); tt = np.arange(n) / R; wh = np.random.RandomState(3).uniform(-1, 1, n) * np.sin(np.pi * tt / 0.5) ** 2 * 0.25
wh = np.convolve(wh, np.ones(30) / 30, 'same'); put(wh, LAUGH_AT - 0.3)
out = out / (np.max(np.abs(out)) + 1e-9) * 0.92
w = wave.open(os.path.join(ROOT, 'assets', 'mix.wav'), 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(R)
w.writeframes((np.stack([out, out], 1) * 32767).astype('<i2').tobytes()); w.close(); print('mix ok', TOTAL)
