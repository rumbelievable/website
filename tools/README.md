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
