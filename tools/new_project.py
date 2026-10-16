#!/usr/bin/env python3
"""
tools/new_project.py
Run from the site root: python3 tools/new_project.py
"""

import re
import sys
from datetime import date
from pathlib import Path

SITE_ROOT = Path(__file__).resolve().parent.parent

# ── HTML template ─────────────────────────────────────────────────────────────
# Placeholders: @@NO@@, @@TITLE@@, @@SUBTITLE@@, @@YEAR@@, @@HERO_URL@@,
#               @@SPEC_ROWS@@, @@ARTICLE@@, @@PREV_LINK@@

PAGE_TEMPLATE = """\
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="@@TITLE@@ — Woodworking by Annie Rumbles">
  <title>@@TITLE@@ — Rumbelievable</title>
  <link rel="shortcut icon" type="image/x-icon"
    href="https://res.cloudinary.com/df4rizvgx/image/upload/v1777813270/rumbelievable-bronze_lkvsxj.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900&family=Martian+Mono:wght@400;600&display=swap" rel="stylesheet">
  <link href="../../assets/css/rumbelievable.css" rel="stylesheet">
</head>
<body class="page-project" data-project-no="@@NO@@">
  <div class="sheet" aria-hidden="true">
    <div class="sheet-zones sheet-zones--x"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span></div>
    <div class="sheet-zones sheet-zones--y sheet-zones--left"><span>A</span><span>B</span><span>C</span><span>D</span><span>E</span><span>F</span></div>
    <div class="sheet-zones sheet-zones--y sheet-zones--right"><span>A</span><span>B</span><span>C</span><span>D</span><span>E</span><span>F</span></div>
  </div>

  <nav class="site-nav" id="siteNav" aria-label="Main">
    <a href="../../index.html" class="nav-logo">
      <img src="https://res.cloudinary.com/df4rizvgx/image/upload/v1778030772/IMG_0093_jsfvjp.png" alt="" width="24" height="24">
      Rumbelievable
    </a>
    <button class="nav-toggle" id="navToggle" aria-label="Toggle navigation">
      <span></span><span></span><span></span>
    </button>
    <ul class="nav-links" id="navLinks">
      <li class="nav-dropdown">
        <a href="../../photography.html">Photography</a>
        <ul class="nav-dropdown-menu">
          <li><a href="../../pages/albums/landscapes.html">Landscapes</a></li>
          <li><a href="../../pages/albums/mountains.html">Mountains</a></li>
          <li><a href="../../pages/albums/night-sky.html">Night Sky</a></li>
          <li><a href="../../pages/albums/panoramas.html">Panoramas</a></li>
          <li><a href="../../pages/albums/reflections.html">Reflections</a></li>
          <li><a href="../../pages/albums/wildlife.html">Wildlife</a></li>
        </ul>
      </li>
      <li><a href="../../woodworking.html" class="active">Woodworking</a></li>
      <li><a href="../../about-me.html">About</a></li>
      <li><a href="../../contact.html" class="nav-contact">Contact</a></li>
    </ul>
  </nav>

  <div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-labelledby="lightboxCount">
    <p class="lightbox-count" id="lightboxCount" aria-live="polite"></p>
    <button class="lightbox-close" id="lightboxClose" aria-label="Close">✕</button>
    <button class="lightbox-step lightbox-prev" id="lightboxPrev" aria-label="Previous photo">‹</button>
    <img id="lightboxImg" src="" alt="">
    <button class="lightbox-step lightbox-next" id="lightboxNext" aria-label="Next photo">›</button>
  </div>

  <main class="project">
    <a href="../../woodworking.html" class="back-link">
      <span aria-hidden="true">←</span> All projects
    </a>

    <figure class="project-hero">
      <img class="project-photo-main" src="@@HERO_URL@@" alt="@@TITLE@@">
    </figure>

    <div class="project-head">
      <div class="project-title">
        <p class="eyebrow">No. @@NO@@ · Woodworking · @@YEAR@@</p>
        <h1>@@TITLE@@</h1>
        <p class="subtitle">@@SUBTITLE@@</p>
      </div>
      <aside class="title-block" aria-label="Project specs">
        <div class="title-block-head">
          <div><span class="spec-label">No.</span>@@NO@@</div>
          <div><span class="spec-label">Drawn</span>A.R.</div>
        </div>
@@SPEC_ROWS@@
        <p class="title-block-name">@@TITLE@@</p>
      </aside>
    </div>

    <article class="project-narrative">
      <h2>About this project</h2>
@@ARTICLE@@
    </article>

    <nav class="pager" aria-label="Projects">
      @@PREV_LINK@@
      <span class="pager-next pager-end">Latest project</span>
    </nav>
  </main>

  <footer class="site-footer">
    <div class="footer-links">
      <a href="https://www.linkedin.com/in/annie-rumbles/">LinkedIn</a>
      <a href="https://github.com/rumbelievable">GitHub</a>
      <a href="mailto:amrumbles@gmail.com">Email</a>
    </div>
    <p class="footer-copy">&copy; Rumbelievable 2026</p>
  </footer>

  <script>
    {
      const nav      = document.getElementById('siteNav');
      const navLinks = document.getElementById('navLinks');
      const lightbox = document.getElementById('lightbox');
      const lbImg    = document.getElementById('lightboxImg');
      const lbCount  = document.getElementById('lightboxCount');
      const lbClose  = document.getElementById('lightboxClose');
      const lbPrev   = document.getElementById('lightboxPrev');
      const lbNext   = document.getElementById('lightboxNext');
      const figs     = [...document.querySelectorAll('.masonry-item img, .project-photo-main, .project-photo-grid img')];
      const title    = document.querySelector('h1').textContent.trim();
      const hiWidth  = document.body.classList.contains('page-album') ? 'c_scale,w_1400' : 'c_scale,w_1600';
      const hiRes    = img => img.src.replace(/c_scale,w_\\d+/, hiWidth);
      const pad      = n => String(n).padStart(2, '0');
      let   current  = 0;
      let   lastFocus = null;

      window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 40), { passive: true });

      document.getElementById('navToggle').addEventListener('click', () => navLinks.classList.toggle('open'));

      document.addEventListener('click', e => {
        if (!nav.contains(e.target)) navLinks.classList.remove('open');
      });

      const isOpen = () => lightbox.classList.contains('open');

      const show = i => {
        current = (i + figs.length) % figs.length;
        lbImg.src = hiRes(figs[current]);
        lbImg.alt = figs[current].alt;
        lbCount.textContent = `Fig. ${pad(current + 1)} / ${pad(figs.length)} · ${title}`;
        new Image().src = hiRes(figs[(current + 1) % figs.length]);
      };

      const openLightbox = i => {
        lastFocus = figs[i];
        show(i);
        lightbox.classList.add('open');
        document.body.classList.add('lightbox-open');
        lbClose.focus();
      };

      const closeLightbox = () => {
        lightbox.classList.remove('open');
        document.body.classList.remove('lightbox-open');
        if (lastFocus) lastFocus.focus();
      };

      figs.forEach((img, i) => {
        img.tabIndex = 0;
        img.setAttribute('role', 'button');
        img.addEventListener('click', () => openLightbox(i));
      });

      lbPrev.hidden = lbNext.hidden = figs.length < 2;
      lbClose.addEventListener('click', closeLightbox);
      lbPrev.addEventListener('click', () => show(current - 1));
      lbNext.addEventListener('click', () => show(current + 1));
      lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

      document.addEventListener('keydown', e => {
        if (!isOpen()) {
          if (e.key === 'Escape') navLinks.classList.remove('open');
          else if ((e.key === 'Enter' || e.key === ' ') && figs.includes(e.target)) {
            e.preventDefault();
            openLightbox(figs.indexOf(e.target));
          }
          return;
        }
        if (e.key === 'Escape') closeLightbox();
        else if (e.key === 'ArrowLeft') show(current - 1);
        else if (e.key === 'ArrowRight') show(current + 1);
        else if (e.key === 'Tab') {
          // keep focus on the lightbox controls while it's open
          e.preventDefault();
          const controls = [lbClose, lbPrev, lbNext].filter(b => !b.hidden);
          const at = controls.indexOf(document.activeElement);
          controls[(at + (e.shiftKey ? -1 : 1) + controls.length) % controls.length].focus();
        }
      });
    }
  </script>
</body>
</html>
"""

# ── Input helpers ─────────────────────────────────────────────────────────────

def ask(label, default=None, required=True):
    hint = f" [{default}]" if default is not None and default != "" else ""
    while True:
        val = input(f"  {label}{hint}: ").strip()
        if not val and default is not None:
            return default
        if val or not required:
            return val
        print("    → required")


def slugify(text):
    s = text.lower()
    s = re.sub(r"[^\w\s-]", "", s)
    s = re.sub(r"[\s_]+", "-", s)
    return re.sub(r"-+", "-", s).strip("-")


def collect_narrative():
    print("  Narrative — one paragraph per line; blank line to finish:")
    paragraphs = []
    while True:
        line = input("    > ").strip()
        if not line:
            if paragraphs:
                break
            print("    → enter at least one paragraph")
        else:
            paragraphs.append(line)
    return paragraphs


# ── Data collection ───────────────────────────────────────────────────────────

def collect():
    print("\n── New Woodworking Project ──────────────────────────────\n")

    latest   = latest_project()
    next_no  = f"{int(latest[0]) + 1:03d}" if latest else "001"

    title    = ask("Title  (e.g. Farmhouse Dining Table)")
    slug     = ask("Slug", default=slugify(title))
    no       = ask("Project number", default=next_no)
    subtitle = ask("Subtitle  (one-liner for the page header)")
    year     = ask("Year", default=str(date.today().year))

    print()
    card_img  = ask("Card thumbnail URL  (shown on woodworking.html)")
    card_meta = ask("Card meta  (e.g. White oak · Danish oil · 2025)")

    print()
    hero_url  = ask("Hero image URL  (main project photo)")
    extra_raw = ask("Extra photo URLs  (comma-separated, or Enter to skip)", default="", required=False)
    extra_urls = [u.strip() for u in extra_raw.split(",") if u.strip()]

    print()
    wood       = ask("Wood", default="", required=False)
    finish     = ask("Finish", default="", required=False)
    joinery  = ask("Joinery", default="", required=False)
    hardware = ask("Hardware", default="", required=False)
    plan_name  = ask("Plan name  (or Enter to skip)", default="", required=False)
    plan_url   = ""
    if plan_name:
        plan_url = ask("Plan URL  (or Enter to skip)", default="", required=False)

    print()
    narrative = collect_narrative()

    print()
    lessons_raw = ask("Lessons learned  (comma-separated, or Enter to skip)", default="", required=False)
    lessons = [l.strip() for l in lessons_raw.split(",") if l.strip()]

    return {
        "no":         no,
        "title":      title,
        "slug":       slug,
        "subtitle":   subtitle,
        "year":       year,
        "card_img":   card_img,
        "card_meta":  card_meta,
        "hero_url":   hero_url,
        "extra_urls": extra_urls,
        "wood":       wood,
        "finish":     finish,
        "joinery":  joinery,
        "hardware": hardware,
        "plan_name":  plan_name,
        "plan_url":   plan_url,
        "narrative":  narrative,
        "lessons":    lessons,
    }


# ── HTML builders ─────────────────────────────────────────────────────────────

def spec_row_html(label, value, url=None):
    if value and url:
        val = f'<a href="{url}" target="_blank" rel="noopener">{value}</a>'
    else:
        val = value if value else "—"
    return (
        f'        <div class="spec-row">\n'
        f'          <span class="spec-label">{label}</span>\n'
        f'          <span class="spec-value">{val}</span>\n'
        f'        </div>'
    )


def figures_html(urls, title, start):
    """A photo grid; figure numbers continue from the hero, which is FIG. 01."""
    if not urls:
        return ""
    figs = "\n".join(
        f'        <figure class="fig"><img src="{u}" alt="{title}, figure {n:02d}" loading="lazy"></figure>'
        for n, u in enumerate(urls, start=start)
    )
    return f'      <div class="project-photo-grid">\n{figs}\n      </div>'


def article_html(d):
    """First section, up to three photos, then Lessons Learned and any remaining photos."""
    paras = "\n".join(f"        <p>{p}</p>" for p in d["narrative"])
    parts = [f'      <div class="narrative-section">\n{paras}\n      </div>']
    first, rest = d["extra_urls"][:3], d["extra_urls"][3:]
    parts.append(figures_html(first, d["title"], 2))
    if d["lessons"]:
        items = "\n".join(f"          <li>{item}</li>" for item in d["lessons"])
        parts.append(
            '      <div class="narrative-section">\n'
            '        <p class="narrative-label">Lessons Learned</p>\n'
            '        <ul>\n'
            f'{items}\n'
            '        </ul>\n'
            '      </div>'
        )
    parts.append(figures_html(rest, d["title"], 2 + len(first)))
    return "\n".join(p for p in parts if p)


# ── Existing projects ─────────────────────────────────────────────────────────

def latest_project(root=SITE_ROOT, exclude=None):
    """(number, slug, title) of the highest-numbered project page, or None.
    `exclude` skips one slug, so a page being regenerated isn't its own predecessor."""
    best = None
    for page in (root / "pages" / "woodworking").glob("*.html"):
        if page.stem == exclude:
            continue
        text = page.read_text(encoding="utf-8")
        no = re.search(r'data-project-no="(\d+)"', text)
        title = re.search(r"<h1>(.*?)</h1>", text, re.S)
        if no and title and (best is None or int(no.group(1)) > int(best[0])):
            best = (no.group(1), page.stem, title.group(1).strip())
    return best


def parse_card_meta(meta):
    """Card meta is "Wood // Wood · Finish · Year". Returns (woods, "Finish · Year")."""
    parts = [p.strip() for p in meta.split(" · ")]
    woods = [w.strip() for w in parts[0].split("//") if w.strip()]
    return woods, " · ".join(parts[1:])


# ── Render ────────────────────────────────────────────────────────────────────

def render_page(d, prev):
    spec_rows = "\n".join([
        spec_row_html("Wood",       d["wood"]),
        spec_row_html("Finish",     d["finish"]),
        spec_row_html("Joinery",  d["joinery"]),
        spec_row_html("Hardware", d["hardware"]),
        spec_row_html("Plan",       d["plan_name"] or None, d["plan_url"] or None),
        spec_row_html("Year",       d["year"]),
    ])

    if prev:
        prev_link = (f'<a href="./{prev[1]}.html" class="pager-prev">'
                     f'<span aria-hidden="true">←</span> {prev[0]} {prev[2]}</a>')
    else:
        prev_link = '<span class="pager-prev pager-end">First project</span>'

    html = PAGE_TEMPLATE
    html = html.replace("@@NO@@",                d["no"])
    html = html.replace("@@TITLE@@",             d["title"])
    html = html.replace("@@SUBTITLE@@",          d["subtitle"])
    html = html.replace("@@YEAR@@",              d["year"])
    html = html.replace("@@HERO_URL@@",          d["hero_url"])
    html = html.replace("@@SPEC_ROWS@@",         spec_rows)
    html = html.replace("@@ARTICLE@@",           article_html(d))
    html = html.replace("@@PREV_LINK@@",         prev_link)
    return html


def card_html(d):
    woods, finish = parse_card_meta(d["card_meta"])
    tags = "".join(f'<span class="mill-tag">{w}</span>' for w in woods)
    return (
        f'\n\n      <a href="./pages/woodworking/{d["slug"]}.html" class="project-card">\n'
        f'        <figure class="project-card-img">\n'
        f'          <img src="{d["card_img"]}" alt="{d["title"]}" loading="lazy">\n'
        f'        </figure>\n'
        f'        <p class="project-card-no">No. {d["no"]}</p>\n'
        f'        <h2 class="project-card-name">{d["title"]}</h2>\n'
        f'        <p class="project-card-meta">{tags}</p>\n'
        f'        <p class="project-card-finish">{finish}</p>\n'
        f'        <span class="project-card-cta">View project '
        f'<span aria-hidden="true">→</span></span>\n'
        f'      </a>'
    )


def ledger_row_html(d):
    woods, _ = parse_card_meta(d["card_meta"])
    return (
        f'        <li><a class="ledger-row" href="./pages/woodworking/{d["slug"]}.html">'
        f'<span class="ledger-no">{d["no"]}</span>'
        f'<span class="ledger-title">{d["title"]}</span>'
        f'<span class="ledger-wood">{" · ".join(woods)}</span>'
        f'<span class="ledger-year">{d["year"]}</span>'
        f'<span class="ledger-arrow" aria-hidden="true">→</span></a></li>'
    )


def next_link_html(d):
    return (f'<a href="./{d["slug"]}.html" class="pager-next">'
            f'{d["no"]} {d["title"]} <span aria-hidden="true">→</span></a>')


# ── Patch existing pages ──────────────────────────────────────────────────────
# Each patch takes and returns text. A missing marker raises PatchError, and
# because main() only writes once every patch has succeeded, nothing is touched.

class PatchError(Exception):
    pass


LEDGER_START  = "<!-- LEDGER:START -->"
LEDGER_END    = "<!-- LEDGER:END -->"
LEDGER_ROWS   = 5
GRID_MARKER   = '<div class="project-grid">'
LATEST_MARKER = '<span class="pager-next pager-end">Latest project</span>'
COUNT_RE      = re.compile(r'(<span data-count="projects">)\d+(</span>)')


def set_count(text, count, name):
    text, n = COUNT_RE.subn(rf"\g<1>{count}\g<2>", text)
    if not n:
        raise PatchError(f'{name}: no <span data-count="projects"> to update')
    return text


def patch_woodworking(text, d, count):
    if GRID_MARKER not in text:
        raise PatchError(f"woodworking.html: missing {GRID_MARKER}")
    # Regenerating an existing slug replaces its card rather than adding a second one.
    old = re.compile(r'\n\n      <a href="\./pages/woodworking/' + re.escape(d["slug"])
                     + r'\.html" class="project-card">.*?\n      </a>', re.S)
    text = old.sub("", text)
    text = text.replace(GRID_MARKER, GRID_MARKER + card_html(d), 1)
    return set_count(text, count, "woodworking.html")


def patch_index(text, d, count):
    start, end = text.find(LEDGER_START), text.find(LEDGER_END)
    if start < 0 or end < start:
        raise PatchError(f"index.html: missing {LEDGER_START} … {LEDGER_END}")
    body = text[start + len(LEDGER_START):end]
    href = f'href="./pages/woodworking/{d["slug"]}.html"'
    rows = [r for r in re.findall(r"^[ \t]*<li>.*?</li>$", body, re.M) if href not in r]
    rows = [ledger_row_html(d)] + rows[:LEDGER_ROWS - 1]
    body = "\n" + "\n".join(rows) + "\n        "
    text = text[:start + len(LEDGER_START)] + body + text[end:]
    return set_count(text, count, "index.html")


def patch_prev(text, d, prev_slug):
    """Point the previous newest project's "next" slot at the new page."""
    if LATEST_MARKER in text:
        return text.replace(LATEST_MARKER, next_link_html(d), 1)
    # Regenerating: it already links here, so refresh the title.
    old = re.compile(r'<a href="\./' + re.escape(d["slug"]) + r'\.html" class="pager-next">.*?</a>', re.S)
    if old.search(text):
        return old.sub(lambda m: next_link_html(d), text, count=1)
    raise PatchError(f'pages/woodworking/{prev_slug}.html: missing {LATEST_MARKER}')


def plan(d, root=SITE_ROOT):
    """Every file to write, as {path: text}. Raises PatchError before anything is written."""
    projects = root / "pages" / "woodworking"
    out_path = projects / f"{d['slug']}.html"
    count = len(list(projects.glob("*.html"))) + (0 if out_path.exists() else 1)
    prev = latest_project(root, exclude=d["slug"])

    read = lambda p: p.read_text(encoding="utf-8")
    edits = {out_path: render_page(d, prev)}
    edits[root / "woodworking.html"] = patch_woodworking(read(root / "woodworking.html"), d, count)
    edits[root / "index.html"] = patch_index(read(root / "index.html"), d, count)
    if prev:
        prev_path = projects / f"{prev[1]}.html"
        edits[prev_path] = patch_prev(read(prev_path), d, prev[1])
    return edits


def generate(d, root=SITE_ROOT):
    """Plan every edit, then write them all. Returns the paths written."""
    edits = plan(d, root)
    for path, text in edits.items():
        path.write_text(text, encoding="utf-8")
    return list(edits)


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    d = collect()

    out_path = SITE_ROOT / "pages" / "woodworking" / f"{d['slug']}.html"
    if out_path.exists():
        ans = input(f"\n  {out_path.name} already exists — overwrite? [y/N] ").strip().lower()
        if ans != "y":
            print("Aborted.")
            sys.exit(0)

    try:
        written = generate(d)
    except PatchError as e:
        print(f"\nERROR: {e}\n  Nothing was written.")
        sys.exit(1)

    print()
    for path in written:
        verb = "Created" if path == out_path else "Updated"
        print(f"  {verb}   {path.relative_to(SITE_ROOT)}")
    print(f"\n  To preview: make preview")


if __name__ == "__main__":
    main()
