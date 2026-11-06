# tools/

Dev tools for the site. None of them are linked from the site's pages.

- [`new_project.py`](#toolsnew_projectpy): generates a woodworking project page (`make project`)
- [`plate-editor.html`](#specimen-plates): draws specimen plates for project pages
- [Plan set tools](#plan-set-tools): `plan-sheet.html`, `new_plan.py`, `trim_views.py` for the
  woodworking plan PDFs

# tools/new_project.py

Generates a new woodworking project page and links it in everywhere it's listed.

## Usage

Run from the **site root**:

```bash
python3 tools/new_project.py
```

Python 3 only — no dependencies to install.

## What it does

1. Prompts you for project details (see fields below)
2. Creates `pages/woodworking/{slug}.html` — a full project page, with a "prev" link to the previous newest project
3. Prepends a card to `woodworking.html` so the new project appears first in the grid
4. Inserts a row at the top of the homepage ledger in `index.html` (between `<!-- LEDGER:START -->` and `<!-- LEDGER:END -->`), keeping 5 rows
5. Updates `data-count="projects"` on both pages
6. Replaces "Latest project" on the previous newest project with a link to the new page

Every edit is planned before anything is written. If a marker it relies on is missing, it stops, names the file and marker, and leaves every file untouched. Re-running with an existing slug replaces that project's page, card and ledger row instead of duplicating them.

## Fields

| Field | Notes |
|---|---|
| Title | e.g. `Farmhouse Dining Table` |
| Slug | URL-safe filename; auto-suggested from title, press Enter to accept |
| Project number | Defaults to the highest `data-project-no` + 1, e.g. `014` |
| Subtitle | One-liner shown under the title on the project page |
| Year | Defaults to current year |
| Card thumbnail URL | Cloudinary URL for the image shown on woodworking.html |
| Card meta | `Wood // Wood · Finish · Year`, e.g. `White Oak // Walnut · Danish Oil · 2026`. Woods become mill tags on the card and the wood column in the ledger |
| Hero image URL | Cloudinary URL for the main photo at the top of the project page (FIG. 01) |
| Extra photo URLs | Optional — comma-separated Cloudinary URLs. The first three go in a grid after the narrative, the rest after Lessons Learned |
| Wood | Spec card row; leave blank to show `—` |
| Finish | Spec card row; leave blank to show `—` |
| Joinery | Spec card row; leave blank to show `—` |
| Hardware | Spec card row; leave blank to show `—` |
| Plan name | Spec card row label; leave blank to show `—` |
| Plan URL | Optional link for the Plan row — only asked if you entered a plan name |
| Narrative | The project write-up; one paragraph per line, blank line to finish |
| Lessons learned | Optional — comma-separated items; generates a bulleted list |
| Specimen plate | Optional — paste the block copied from `tools/plate-editor.html`, then a blank line; Enter alone skips. See [Specimen plates](#specimen-plates) |

## Specimen plates

A specimen plate is one project photo drawn up like a natural-history plate: pins on the parts, hairline leaders out to labels naming each wood (common and Latin name), and a numbered key underneath. It goes at the end of the project's article, and the Wood row gets a "See plate →" link to it.

**Editor:** run `make preview` and open <http://localhost:8000/tools/plate-editor.html>.

1. Paste the photo's Cloudinary URL (it's rewritten to `c_scale,w_1200`), then the project number and title.
2. Click a part of the photo to drop a pin, and type the wood's common name. Known species fill in the Latin name (edit or clear it as you like); a trailing `spp.` stays upright. The label goes on the side of the photo you clicked; ◀ / ▶ moves it to the other side.
3. Drag a pin to adjust it. If two labels on the same side are too close to read, both rows say so: flip one.
4. **Phone preview** shows the small-screen layout (numbered pins and the key only).
5. **Copy plate** copies the block. Pins are numbered top to bottom; any pin without a name is left out.

To change a published plate, paste its block into "Edit an existing plate", press **Load plate**, adjust, and copy again.

**Generator:** at the plate prompt, paste the whole `<section class="plate">…</section>` block, then press Enter on an empty line. The paste ends at the first blank line, so the block must not contain one (the editor never writes one). If what you pasted doesn't start with `<section class="plate"` and end with `</section>`, it says why and asks again.

**Existing page:** paste the block as the last thing inside `<article class="project-narrative">`, and add this to the end of the Wood row's `spec-value`:

```html
<a href="#plate" class="plate-link">See plate <span aria-hidden="true">→</span></a>
```

## After running

To preview locally:

```bash
make preview
# open http://localhost:8000/woodworking.html
```

## Tests

```bash
python3 -m unittest tools/test_new_project.py
```

Each test runs against a temporary copy of the site, so the real pages are never touched.

## Image URLs

All images are hosted on Cloudinary. The lightbox swaps any `c_scale,w_N` transform for `c_scale,w_1600` when a photo is opened; URLs without one open as-is. A URL like:

```
https://res.cloudinary.com/df4rizvgx/image/upload/c_scale,w_800/f_auto/q_auto/v.../photo.jpg
```

is the standard format used across the site.

# Plan set tools

Tools for making the woodworking plan PDFs. The step-by-step guide, including exporting from
Fusion and SketchUp, is [`docs/plans/making-plans.md`](../docs/plans/making-plans.md); the design is
[`docs/superpowers/specs/2026-11-02-plan-sheet-design.md`](../docs/superpowers/specs/2026-11-02-plan-sheet-design.md).

Plans themselves live outside the repo, in `~/Desktop/plans/p-<no>-<slug>/` (`plan.json`,
`views/`, and `originals/` once trimmed), because everything on `main` is published.

| File | What it does |
|---|---|
| `plan-sheet.html` | The editor and print template. `make preview`, then <http://localhost:8000/tools/plan-sheet.html> in Chrome (it opens and saves plan folders with Chrome's folder access). `?plan=plan-sample/p-003-floating-night-stands/` shows the sample read-only. |
| `plan-sample/` | A placeholder sample plan (P-003) with SVG views. Not a real plan. |
| `new_plan.py` | `make plan`: asks for a project number and makes its plan folder with a starter `plan.json` (title block from the project page; cover, drawing, cut list and build step sheets). Never overwrites a `plan.json`; refuses a folder inside the repo. `PLANS_DIR=` overrides `~/Desktop/plans`. |
| `trim_views.py` | `make trim-views`: crops the margin off a plan's PNG exports and, with `THICKEN=1` or `2`, thickens the lines of line drawings. Untouched exports go to `originals/`; every image is rebuilt from them, so re-running is safe. `PLAN=3` skips the prompt. |
| `trim_png.swift` | The pixel work for `trim_views.py` (CoreGraphics, run with `swift -O`). macOS with the Xcode command line tools only. |

Tests:

```bash
python3 -m unittest tools/test_new_plan.py tools/test_trim_views.py   # trim tests need swift
# with make preview running:
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --virtual-time-budget=30000 --dump-dom "http://localhost:8000/tools/plan-sheet.test.html" | grep -E "<title>|class=\"fail"
```

The editor tests pass when the title reads `PASS n`.
