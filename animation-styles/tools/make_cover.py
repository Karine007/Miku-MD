"""make_cover.py frame.png out.jpg "TOP LINE" "BIG TITLE" "sub line" [accent hex]"""
import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
src, out, top, title, sub = sys.argv[1:6]
accent = sys.argv[6] if len(sys.argv) > 6 else '#ffd23f'
im = Image.open(src).convert('RGB').resize((1080, 1920))
W, H = im.size
# dark gradient at top and bottom for legibility
grad = Image.new('L', (1, H))
for y in range(H):
    a = 0
    if y < 760: a = int(200 * (1 - y / 760) ** 1.4)
    if y > H - 520: a = max(a, int(170 * ((y - (H - 520)) / 520) ** 1.6))
    grad.putpixel((0, y), a)
im = Image.composite(Image.new('RGB', (W, H), (0, 0, 0)), im, grad.resize((W, H)))
d = ImageDraw.Draw(im)
B = '/usr/share/fonts/opentype/inter/Inter-ExtraBold.otf'
def fit(text, size, maxw):
    while True:
        f = ImageFont.truetype(B, size)
        if d.textlength(text, font=f) <= maxw or size < 40: return f
        size -= 4
def line(text, y, size, fill, stroke=10):
    f = fit(text, size, W - 110)
    w = d.textlength(text, font=f)
    d.text(((W - w) / 2, y), text, font=f, fill=fill, stroke_width=stroke, stroke_fill='black')
    return y + f.size * 1.12
y = 150
y = line(top, y, 70, 'white', 8)
for t in title.split('|'):
    y = line(t, y + 10, 150, accent, 12)
line(sub, H - 250, 62, 'white', 7)
im.save(out, quality=92)
