# Shop Drawing Redesign: Design Spec

- **Date:** 2026-10-16
- **Status:** Awaiting review
- **Inputs:** `docs/redesign/brief.md` (with the 2026-10-16 course correction) and the mockup at
  https://claude.ai/artifact/5ug3jZi1kobbfUycibtaos. The top row of the mockup, "A, revised", is the
  reference. The rows below it show the grid version this spec replaces.

## 1. Goal

Restyle all of Rumbelievable as Direction A, "Shop Drawing". Every page is a drafting sheet:
plain cream vellum inside a fixed drawing-sheet border, graphite ink, brass and cyanotype accents,
wide uppercase Archivo and Martian Mono annotations. There is no graph paper anywhere.

**Success means:**
- Every main-site page (home, about, contact, photography index, 6 albums, woodworking index, 13 projects)
  uses the new look, and they all switch at the same moment, in one merge to `main`.
- All CSS lives in `assets/css/rumbelievable.css`. No page and no generator template has a `<style>` block.
- `make project` still produces a correct new project page by itself. It also updates the number, the
  homepage ledger, the project counts and the previous project's "next" link.
- WCAG AA contrast for text, visible focus states, keyboard-operable nav and lightbox, and a
  `prefers-reduced-motion` fallback.
- Copy and photos are unchanged. This is a redesign, not a content rewrite.

## 2. Decisions

| Topic | Decision |
|---|---|
| Background | Plain vellum, with at most a faint paper tooth. **No grid.** |
| Sheet border | Fixed to the viewport like a passe-partout. Content scrolls beneath it. |
| Nav placement | **Above the border.** The border's top edge is the nav's bottom rule. |
| Zones | **8** columns, numbered 1–8 along the bottom edge. Rows **A–F** down both sides. |
| Inset | **24px** at the sides and bottom. Below 700px: a plain hairline 8px in, with no labels. |
| Corner registration marks | **None.** |
| Corner title strip | **None.** |
| Photos | No mat. 1px graphite hairline plus a mono `FIG. nn` caption from a CSS counter. |
| Theme | Light only. No blueprint/dark variant. |
| Homepage | The Seam, with RUMBELIEVABLE as **one unbroken word** (not split across the seam), plus a Recent Work ledger of 5 rows (projects only) that the generator maintains. |
| Lightbox | Adds prev/next buttons, ← → keys and a `FIG. nn / NN` counter. No swipe. |
| Project numbers | `No. 001`–`No. 013` in build order. The generator suggests the next one. |
| About | Portrait plus a personal title block. The bio stays word for word. |
| Icons | Font Awesome removed from the whole site. |
| Nav "Home" link | Removed. The logo links home. |
| Load animation | The border draws in and the labels fade in, **on the homepage only**. |
| Approach | Static pages, hand-migrated. Shared behaviour goes into `tools/new_project.py`. No new build step. |
| Rollout | One branch, `redesign/shop-drawing`, merged to `main` once at the end. |

## 3. Visual system

### Tokens (`:root` in `rumbelievable.css`; these replace the old palette)

| Token | Value | Use | Contrast on paper |
|---|---|---|---|
| `--paper` | `#efe9dc` | page ground, mat strips, nav | — |
| `--ink` | `#22272c` | text, rules, sheet border, photo hairlines | 12.45:1 |
| `--ink-2` | `#555b61` | secondary text, captions | 5.68:1 |
| `--hairline` | `rgba(34,39,44,.28)` | table rules, dividers | decorative |
| `--brass` | `#b8924a` | logo, seam line, pull-quote rule, active-nav underline. **Never used for text.** | 2.39:1 (non-text only) |
| `--brass-text` | `#7a5b22` | small brass-coloured text (Contact link, ledger numbers) | 5.19:1 |
| `--cyan` | `#2f5d8a` | zone labels, eyebrows, title-block labels, dimension lines | 5.68:1 |
| `--lightbox` | `#1b1f23` | lightbox ground. Text on it: paper 13.7:1, `#9aa3ab` 6.47:1, `#d4ae6a` 7.94:1 | — |

Also kept as tokens: `--nav-h: 56px` (was 64px), `--sheet-inset: 24px`, `--ease`.

### Type

- One `<link>` per page:
  `https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Martian+Mono:wght@400;600&display=swap`
- `--font-display`: Archivo 800, `font-stretch: 125%`, uppercase, `letter-spacing: -0.01em`,
  `text-wrap: balance`.
- `--font-body`: Archivo at normal width, 16–17px, line-height 1.6–1.7, running text capped at 65ch.
- `--font-mono`: Martian Mono, 9–13px, uppercase, `letter-spacing: .08–.16em`. Used for labels,
  captions, the nav, zone labels and title blocks.
- Fallback stacks: `'Archivo', 'Helvetica Neue', Arial, sans-serif` and
  `'Martian Mono', ui-monospace, Menlo, monospace`.

### Sheet frame

Markup is identical on every page, placed directly after `<body>`:

```html
<div class="sheet" aria-hidden="true">
  <div class="sheet-zones sheet-zones--x"><span>1</span>…<span>8</span></div>
  <div class="sheet-zones sheet-zones--y sheet-zones--left"><span>A</span>…<span>F</span></div>
  <div class="sheet-zones sheet-zones--y sheet-zones--right"><span>A</span>…<span>F</span></div>
</div>
```

- `.sheet` is `position: fixed` with `inset: var(--nav-h) var(--sheet-inset) var(--sheet-inset)`, a
  `1.5px solid var(--ink)` border and `pointer-events: none`.
- The zone rows are flex rows or columns with `justify-content: space-around`. Short ink tick marks
  sit at the zone boundaries (pseudo-elements). Labels are cyanotype Martian Mono at 9px, centred in
  the 24px margin. Rows stretch with the viewport height, so zones are not kept square.
- **Masking:** `body::before` and `body::after`, plus `.sheet::before`, are fixed paper-coloured strips
  covering the side and bottom margins. They sit above page content and below the sheet lines, so
  content looks clipped at the border. The nav (paper background) masks the top. Page content gets
  `padding: var(--nav-h) calc(var(--sheet-inset) + 2px) calc(var(--sheet-inset) + 2px)`.
- **Below 700px:** `--sheet-inset: 8px`, the zone labels and ticks are hidden, and the border is a 1px
  hairline.
- **Stacking order:** content < mask strips < `.sheet` < nav < nav dropdown < lightbox. The lightbox
  covers everything, the frame included.
- **Motion (homepage only):** `body.page-home .sheet` animates `clip-path` from the top-left corner
  (about 1.1s). Zone labels fade in after it (0.5s, 0.9s delay). Under `prefers-reduced-motion: reduce`
  there is no animation.

### Photos

- `img` inside `figure`: `border: 1px solid var(--ink)`, no padding, no mat, no shadow, no radius.
- `figcaption`: mono 10px, `--ink-2`, reading `FIG. nn` and optionally `· LABEL`.
- On albums and project galleries the number comes from a CSS counter
  (`counter-reset: fig` on the gallery, `counter-increment: fig` on each item,
  `content: "FIG. " counter(fig, decimal-leading-zero)`), so no per-image markup is needed. Hand-written
  captions (the hero, the About portrait) are literal text.

### Structural devices

- **Dimension line:** `├──── 6 ALBUMS ────┤`, built in CSS as end ticks plus a rule plus a label, in cyanotype.
- **Section markers:** `§ 1`, `§ 2` before h2s on project pages and the home ledger, as a cyanotype mono prefix.
- **Title block:** a box with a 1.5px ink border. The header row is No. / Scale NTS / Drawn A.R. Each
  row below is a label (cyanotype mono 10px) next to a value (mono 12px), with 1px cyanotype rules
  between rows.
- **Mill-stamp tag** (woodworking cards): mono uppercase wood names in a 1px cyanotype outline.

### Breakpoints (stated explicitly, unchanged from today)

- `<900px`: album grids and the photography index go 2-column. The project title block drops below the title.
- `<700px`: the mobile nav replaces the desktop nav, and the sheet becomes an 8px hairline with no labels.
- `<680px`: the homepage Seam stacks: wordmark, photo, horizontal brass seam rule, photo. (The
  wordmark stays above the photos rather than moving onto the seam; that would need
  `display: contents`, which drops the section's accessible label.)
- `<560px`: masonry goes to 1 column.

## 4. Architecture

- **One stylesheet,** organised in this order: tokens → reset/base → type → sheet frame → nav →
  footer → components (figure, title block, dimension line, ledger, cards, buttons, form lines) →
  lightbox → page sections scoped by body class → utilities.
- **Body classes:** `page-home`, `page-about`, `page-contact`, `page-index` (the photography and woodworking
  indexes, plus `page-index--photo` and `page-index--wood`), `page-album`, `page-project`. Page-specific
  rules always sit under one of these, never on bare element selectors.
- **Shell markup** (the same on every page apart from relative paths and `aria-current`):
  `nav.site-nav`, then `div.sheet`, then `main`, then `footer.site-footer`.
- **Nav:** your logo PNG plus the wordmark in mono. Links: Photography (dropdown of the 6 albums,
  restyled and reordered to match `photography.html`; today the dropdown lists them in a different
  order), Woodworking, About, Contact (in brass text). The active page gets `aria-current="page"`
  and a 2px brass underline. The mobile toggle keeps the existing behaviour.
- **Footer:** text links LinkedIn · GitHub · Email and `© RUMBELIEVABLE 2026`, in mono.
- **Inline JS** (per CLAUDE.md): wrapped in `{ }`, passive scroll listener, nav closes on outside click
  and on ESC, a single keydown listener. Cursor styles and visual state live only in CSS classes.
- **Font Awesome:** the `<link>` is removed from all 25 pages and from the generator. Replacements:
  arrows become `←` `→`, close becomes `✕` (with an `aria-label` on the button), social links become
  text, and the decorative tile and bio icons are dropped.

## 5. Sub-project 1: Foundation

**1a · Consolidate (no visual change).**
- Move every page's inline `<style>` into `rumbelievable.css`, under that page's body class. Merge
  the 13 project-page blocks into one ruleset. Where two pages have drifted apart, keep the version on
  `full-circle-memorial-urn.html` (the newest) and note any visible differences in the commit message.
- Add the body classes. Remove `<style>` from the `tools/new_project.py` template, which should gain
  the body class instead.
- **Done when:** no `.html` file outside `/archive/` contains `<style>`, and before/after screenshots
  of every page at 1280px and 390px match.

**1b · New shell.**
- New tokens and fonts, the sheet frame, nav, footer, Font Awesome removal and the homepage-only draw-in.
- Existing page bodies are restyled through the new tokens only, with no layout rework yet.
- **Done when:** every page shows the frame, nav and footer correctly at 1280px and 390px; no page
  requests Font Awesome or the old fonts; and the keyboard and reduced-motion checks in § 8 pass for
  the nav.

## 6. Sub-project 2: Page designs

The mockup's "A, revised" screens are the reference for Home, Album, Project and About.

- **Home (`index.html`)**
  - `h1` RUMBELIEVABLE as one word, centred above the Seam.
  - Two linked halves: a hairlined photo, a `FIG.` caption, a dimension line
    (`<span data-count="albums">6</span> ALBUMS` / `<span data-count="projects">13</span> PROJECTS`),
    a title and a CTA.
  - A 2px brass seam between the halves. Hovering or focusing a half widens it to about 60% and
    dims the other half, using CSS `:has()` only.
  - Then the quote strip, then `§ 1 Recent work`: a ledger of No. · Title · Wood · Year with 5 rows,
    between `<!-- LEDGER:START -->` and `<!-- LEDGER:END -->`. Albums are not listed.
- **Photography index**
  - W2: a numbered album list (01–06) and a preview panel.
  - Hovering or focusing a row crossfades its photo in the preview, in CSS only (stacked images
    switched by `:has()`).
  - Below 900px it becomes a 2-column grid of hairlined photos with names.
- **Album pages (×6)**
  - `← All albums`, then `ALBUM nn / 06`, an `h1`, and `NN FIGURES`.
  - Masonry stays 3 → 2 → 1 columns, with counter captions.
  - **New:** prev/next album links at the foot, in photography-index order (Landscapes, Mountains,
    Night Sky, Panoramas, Reflections, Wildlife, the current order on `photography.html`).
    The ends link back to the index.
- **Woodworking index**
  - W4: the header plus a `<span data-count="projects">` count.
  - In `.project-grid`, the **first** card is styled as the large "latest" feature. Every other card
    shows a hairlined photo, `No. 0xx`, the title and a mill-stamp wood tag.
- **Project pages (×13)**
  - `← All projects`, then a hero edge to edge inside the frame (with a hand-written `FIG. 1` caption),
    then the title, subtitle and title block side by side, with the title block below the title under 900px.
  - The article uses `§`-numbered sections. The photo grid goes after the first section, and any
    remaining photos go at the end.
  - Pull quotes only where the page's copy already has one.
  - `<nav aria-label="Projects">` with `← 0xx Title` and `0xx Title →`. The newest page shows
    "Latest project" in place of the next link.
  - `<body data-project-no="013">` carries the number.
- **About**
  - Portrait figure (`FIG. 1 · THE MAKER`), eyebrow, `h1` Annie Rumbles, a personal title block
    (Born England · Raised Boulder, Colorado · Based Denver, Colorado · Day job Data engineer ·
    Dogs Tetley, Lupine), then the bio paragraphs and pull quote word for word.
  - The three icon bullets are removed.
- **Contact**
  - W6: a two-column layout. Inputs are underline-only "fill-in lines" with mono labels and visible
    focus.
  - The form's `action` (Formspree), method, field names and validation stay exactly as they are.

**Inputs needed from you during sub-project 2:**
1. The two photos for the Seam: one landscape and one shop or grain shot.
2. The build order of the 13 projects, which sets No. 001–013. I'll draft it from git history and the
   woodworking card order for you to confirm.
3. Confirmation of the About title-block facts above.

**Done when:** every page matches its description at 1280px and 390px, and the § 8 checks pass.

## 7. Sub-project 3: Behaviour and generator

### Lightbox (album and project pages, 19 in total)

The same inline script goes on each page, inside `{ }`.
- It collects the gallery images in document order. Clicking one opens the lightbox at that index.
  ‹ › buttons and the ← → keys step through and wrap at the ends.
- The counter reads `FIG. 07 / 24 · NIGHT SKY` (or the project title).
- High-res swap: `/c_scale,w_500/` → `/c_scale,w_1400/` on albums, `/c_scale,w_800/` → `/c_scale,w_1600/`
  on projects. The next image is preloaded.
- Focus moves to `#lightboxClose` on open. `lastFocus` is restored on close. While open, Tab cycles only
  through close / prev / next.
- One keydown listener: ESC closes the lightbox if it's open, and otherwise closes the mobile nav.
  The arrow keys act only while the lightbox is open.
- The overlay is a `role="dialog"` with `aria-modal="true"`, labelled by the counter.

### Generator (`tools/new_project.py`)

The generator plans every edit in memory and writes files only if all of them succeed. If a marker is
missing, it stops with a message naming the file and marker, and leaves every file untouched.
1. **Template:** new project markup (see § 6), `body.page-project` with `data-project-no`, the
   `.sheet` snippet and the lightbox script. No `<style>` and no Font Awesome.
2. **Number:** reads the highest `data-project-no` under `pages/woodworking/` and offers `max + 1` as the
   default at a new prompt. You can override it.
3. **`woodworking.html`:** prepends the card inside `.project-grid` (as now, with new card markup) and
   bumps `data-count="projects"`.
4. **`index.html`:** inserts a ledger row after `<!-- LEDGER:START -->`, keeps the first 5 rows, and
   bumps `data-count="projects"`.
5. **Previous newest project:** on the page with the highest number before this run, replaces the
   "Latest project" placeholder with a link to the new page. The new page's "prev" link points back.
6. The existing "fill in the Favourite Part placeholder" reminder stays.

## 8. Verification

- **Generator:** `tools/test_new_project.py`, stdlib `unittest` only. Each test copies the needed site
  files to a temporary folder and checks:
  - the number suggestion
  - card prepend and count bumps
  - ledger insert and trim to 5
  - the prev/next patch
  - nothing is written when a marker is missing

  Run with `python3 -m unittest tools/test_new_project.py`.
- **Pages:** `make preview`, then a browser pass for each page type at 1280px and 390px, checking:
  - the layout matches § 6 and the sheet frame behaves as in § 3
  - keyboard-only: nav, dropdown and mobile toggle (outside click and ESC), the Seam halves, ledger
    rows, the lightbox (open, step, Tab cycle, ESC, focus return)
  - `prefers-reduced-motion: reduce` turns off the draw-in
  - no requests to Font Awesome or the old font families, and no console errors
- **Static checks:** a grep confirming no `<style>` and no `fa-` classes outside `/archive/`, and that
  every `<img>` has alt text.
- **Contrast:** every text/background token pair is AA (see the table in § 3). Brass is never used
  for text.

## 9. Rollout

- Branch `redesign/shop-drawing` off `main`. Commit at the end of each sub-project, or more often.
  Merge to `main` once, when all three sub-projects are done and verified. Nothing is pushed or
  merged without your go-ahead.
- If a new project is added while the branch is open, run `make project` **on the branch**, so the
  page is generated in the new style.
- Update `CLAUDE.md` in the final commit: the new tokens and fonts, the body classes, the sheet
  frame, the lightbox behaviour, the generator's extra steps and the unit test command.

## 10. Out of scope

- `/archive/` and the blog (untouched, as always).
- Dark or blueprint mode, touch swipe in the lightbox, data-driven page generation (option 2 from
  brainstorming; it can be revisited if the site grows past about 30 projects), copy edits, and new
  photos.

## 11. Risks

- **Mask strips and the fixed frame on mobile browsers:** dynamic toolbars can expose gaps. The
  frame is hidden below 700px except as a hairline, which limits the exposure. Test on real iOS Safari.
- **CSS `:has()`** for the Seam and the album preview: supported in all current browsers. Without it,
  the halves don't widen and the preview stays on the first album. Both still work.
- **Hand migration of 13 drifted project pages:** the 1a screenshots catch regressions before the
  restyle begins.
