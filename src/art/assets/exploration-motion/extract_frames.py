"""Technical alpha extraction and alignment only; all poses are generated artwork."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import numpy as np
import json

ROOT = Path(__file__).resolve().parent
META = {}

def metrics(im):
    a = np.asarray(im.getchannel('A'))
    yy, xx = np.where(a > 64)
    b = (int(xx.min()), int(yy.min()), int(xx.max()+1), int(yy.max()+1))
    h = b[3] - b[1]
    _, hx = np.where(a[b[1]+int(h*.1):b[1]+int(h*.23)] > 64)
    return b, float(np.median(hx))

def parts(file, rows, cols):
    im = Image.open(ROOT/file).convert('RGBA')
    result = []
    for row in range(rows):
        y0, y1 = round(row*im.height/rows), round((row+1)*im.height/rows)
        band = im.crop((0, y0, im.width, y1))
        ar = np.asarray(band)
        opaque = ar[:, :, 3] > 64
        for col in range(cols):
            cx, cy = int((col+.5)*im.width/cols), int(band.height*.28)
            radius = int(im.width/cols*.18)
            ya, yb = max(0, cy-20), min(band.height, cy+20)
            xa, xb = max(0, cx-radius), min(im.width, cx+radius)
            ys, xs = np.where(opaque[ya:yb, xa:xb])
            assert len(xs), file
            dist = (xs+xa-cx)**2 + (ys+ya-cy)**2
            idx = int(np.argmin(dist))
            seed = (int(xs[idx]+xa), int(ys[idx]+ya))
            mask = Image.fromarray(np.uint8(opaque)*255).copy()
            ImageDraw.floodfill(mask, seed, 128)
            part = np.asarray(mask) == 128
            assert part.sum() > 1000, (file, seed)
            dilated = np.asarray(Image.fromarray(np.uint8(part)*255).filter(ImageFilter.MaxFilter(9)))
            arr = np.array(ar)
            arr[:, :, 3] = np.where(dilated > 0, arr[:, :, 3], 0)
            result.append(Image.fromarray(arr))
    return result

def save(hero, state, n, im):
    idle = Image.open(ROOT.parent/'exploration'/(hero+'.webp')).convert('RGBA')
    ib, ix = metrics(idle)
    b, hx = metrics(im)
    scale = (ib[3]-ib[1])/(b[3]-b[1])
    w, h = round(im.width*scale), round(im.height*scale)
    resized = im.resize((w, h), Image.Resampling.LANCZOS)
    rb, rx = metrics(resized)
    dx, dy = round(ix-rx), ib[3]-rb[3]
    assert rb[0]+dx >= 1 and rb[2]+dx <= 319, (hero, state, n, 'horizontal overflow', rb, dx)
    out = Image.new('RGBA', (320, 480))
    out.alpha_composite(resized, (dx, dy))
    name = f'{hero}-{state}-{n}.webp'
    out.save(ROOT/name, 'WEBP', quality=86, method=6, exact=True)
    ob, ox = metrics(out)
    assert ob[3] == ib[3], (name, 'foot alignment')
    META[name] = {'size': [320,480], 'bbox': ob, 'head_anchor_x': round(ox,2), 'idle_head_anchor_x': ix, 'scale': round(scale,5), 'foot_baseline': ob[3], 'idle_foot_baseline': ib[3]}
    print(name, ob, flush=True)

if __name__ == '__main__':
    for hero in ['quijote', 'ursula', 'bibliotecario', 'frida']:
        frames = parts(hero+'-walk-talk-sheet.png', 2, 3)
        correction = hero+'-compact-walk-sheet.png'
        if (ROOT/correction).exists():
            frames[2:4] = parts(correction, 1, 2)
        for i in range(4): save(hero, 'walk', i, frames[i])
        for i in range(2): save(hero, 'talk', i, frames[4+i])
    for i, im in enumerate(parts('sancho-compact-talk-sheet.png', 1, 2)): save('sancho', 'talk', i, im)
    painting = parts('frida-paint-sheet.png', 2, 2)
    painting[2] = parts('frida-paint-correction-sheet.png', 1, 1)[0]
    for i, im in enumerate(painting): save('frida', 'paint', i, im)
    (ROOT/'alignment.json').write_text(json.dumps(META, indent=2)+'\n', encoding='utf-8')
    print('TOTAL', len(list(ROOT.glob('*.webp'))), sum(f.stat().st_size for f in ROOT.glob('*.webp')), flush=True)
