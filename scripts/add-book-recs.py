# -*- coding: utf-8 -*-
# Adds a "Books for Every Age" page to the trilingual Starter Kit (after the Reading Log,
# page 17), links it and page 20's griotmoon.com/books line to the site, and fixes the
# PDF metadata still naming Story Time with Eva.
#
# Input and output: public/bilingual-starter-kit.pdf. Refuses to run on a kit that is not
# the original 20 pages, so it cannot insert the page twice.
# Titles and themes come from src/data/books.ts, so a renamed book stays in sync on rerun.
#   python3 scripts/add-book-recs.py
import io, os, re, sys
import fitz
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KIT = os.path.join(ROOT, 'public/bilingual-starter-kit.pdf')
COVERS = os.path.join(ROOT, 'src/assets/covers')
FONTS = '/Library/Frameworks/Python.framework/Versions/3.14/lib/python3.14/site-packages/reportlab/fonts'
REG, BOLD = os.path.join(FONTS, 'Vera.ttf'), os.path.join(FONTS, 'VeraBd.ttf')
UTM = 'utm_source=starter-kit&utm_medium=pdf&utm_campaign=book-recs'

def rgb(h): return tuple(int(h[i:i + 2], 16) / 255 for i in (1, 3, 5))
PURPLE, DARK, GRAY, WHITE = rgb('#6d34d8'), rgb('#1f2937'), rgb('#6b7280'), (1, 1, 1)

# Three age bands matching the kit's Ages 3-8, four picks each.
BANDS = [
    (rgb('#2563eb'), 'Ages 3-4  |  3-4 ans  |  3-4 años',
     ['our-child', 'the-kindness-garden', 'the-chiefs-3-gifts', 'ubuntu-we-are-together']),
    (rgb('#15803d'), 'Ages 5-6  |  5-6 ans  |  5-6 años',
     ['the-clever-pots', 'the-laughing-village', 'the-broken-toy', 'the-mighty-fist']),
    (rgb('#db2777'), 'Ages 7-8  |  7-8 ans  |  7-8 años',
     ['the-servant-king', 'the-hunt-with-two-paths', 'chief-maels-final-gift', 'the-talking-tree']),
]

def load_books():
    src = open(os.path.join(ROOT, 'src/data/books.ts'), encoding='utf8').read()
    out = {}
    for m in re.finditer(r"\n  \{\n    id: '([^']+)'(.*?)\n  \},", src, re.S):
        body = m.group(2)
        title = re.search(r"title: \{ en: (['\"])(.*?)\1", body)
        if not title: continue
        title = title.group(2)
        th = re.search(r"theme: \{\s*en: '([^']*)',\s*es: '([^']*)',\s*fr: '([^']*)'", body)
        out[m.group(1)] = {'title': title, 'theme': th and {'en': th[1], 'es': th[2], 'fr': th[3]}}
    return out

def thumb(book_id, px=240):
    im = Image.open(os.path.join(COVERS, f'{book_id}.jpg')).convert('RGB')
    im.thumbnail((px, px))
    buf = io.BytesIO(); im.save(buf, 'JPEG', quality=82); return buf.getvalue()

def fit(page, rect, text, size, font, color, align=fitz.TEXT_ALIGN_CENTER, min_size=6):
    """Insert text, shrinking it until it fits the box."""
    while size >= min_size:
        rc = page.insert_textbox(rect, text, fontsize=size, fontname=font, color=color, align=align)
        if rc >= 0: return
        size -= 0.25
    raise SystemExit(f'text does not fit: {text!r}')

def main():
    d = fitz.open(KIT)
    if d.page_count != 20:
        sys.exit(f'expected the original 20-page kit, found {d.page_count} pages; aborting')
    books = load_books()
    W, H = 612, 792
    page = d.new_page(pno=17, width=W, height=H)  # becomes the 18th page, right after the Reading Log
    page.insert_font(fontname='vr', fontfile=REG)
    page.insert_font(fontname='vb', fontfile=BOLD)

    # Header band, same geometry and title size as the other activity pages.
    page.draw_rect(fitz.Rect(0, 0, W, 64), color=None, fill=PURPLE)
    fit(page, fitz.Rect(12, 24, W - 12, 50),
        'Books for Every Age  |  Des livres pour chaque âge  |  Libros para cada edad', 16, 'vb', WHITE)

    fit(page, fitz.Rect(42, 76, W - 42, 108),
        'Picked for each age from Pawa Seyni’s African Heritage Tales. Tap a cover to see the book.\n'
        'Choisis pour chaque âge parmi les contes de Pawa Seyni. Touche une couverture pour voir le livre.\n'
        'Elegidos para cada edad entre los cuentos de Pawa Seyni. Toca una portada para ver el libro.',
        8.5, 'vr', DARK, align=fitz.TEXT_ALIGN_LEFT)

    x0, gap, cols = 42, 12, 4
    cw = (W - 2 * x0 - gap * (cols - 1)) / cols
    y = 116
    for color, label, ids in BANDS:
        page.draw_rect(fitz.Rect(x0, y, W - x0, y + 22), color=None, fill=color, radius=0.5)
        fit(page, fitz.Rect(x0, y + 5.5, W - x0, y + 20), label, 10, 'vb', WHITE)
        y += 30
        for i, bid in enumerate(ids):
            b = books[bid]
            cx = x0 + i * (cw + gap)
            cover = fitz.Rect(cx + (cw - 84) / 2, y, cx + (cw + 84) / 2, y + 84)
            page.insert_image(cover, stream=thumb(bid))
            page.draw_rect(cover, color=rgb('#d1d5db'), width=0.6)
            fit(page, fitz.Rect(cx, y + 88, cx + cw, y + 101), b['title'], 8, 'vb', DARK)
            t = b['theme']
            fit(page, fitz.Rect(cx, y + 102, cx + cw, y + 140), f"{t['en']}\n{t['fr']}\n{t['es']}", 6.6, 'vr', GRAY)
            page.insert_link({'kind': fitz.LINK_URI, 'from': fitz.Rect(cx, y, cx + cw, y + 140),
                              'uri': f'https://griotmoon.com/books/{bid}/?{UTM}'})
        y += 150

    more = fitz.Rect(42, y + 2, W - 42, y + 18)
    fit(page, more, 'See every book  |  Tous les livres  |  Todos los libros:  griotmoon.com/books', 9.5, 'vb', PURPLE)
    page.insert_link({'kind': fitz.LINK_URI, 'from': more, 'uri': f'https://griotmoon.com/books/?{UTM}'})

    # Footer, matching the other pages.
    page.insert_text((42, 775), 'Griot Moon  |  griotmoon.com', fontsize=7.4, fontname='helv', color=GRAY)
    page.insert_text((545, 775), 'Bonus', fontsize=7.4, fontname='helv', color=GRAY)

    # Page 20 (now the 21st): make the existing griotmoon.com/books line clickable.
    last = d[20]
    for r in last.search_for('griotmoon.com/books'):
        last.insert_link({'kind': fitz.LINK_URI, 'from': r, 'uri': f'https://griotmoon.com/books/?{UTM}'})

    d.set_metadata({**d.metadata, 'title': 'Griot Moon - Trilingual Starter Kit',
                    'author': 'Pawa Seyni', 'creator': 'Griot Moon', 'producer': 'PyMuPDF'})
    tmp = KIT + '.tmp'
    d.save(tmp, garbage=4, deflate=True)
    d.close()
    os.replace(tmp, KIT)
    print(f'saved {KIT} ({os.path.getsize(KIT) // 1024} KB, 21 pages)')

if __name__ == '__main__':
    main()
