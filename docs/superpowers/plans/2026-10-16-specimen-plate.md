# Specimen Plate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give woodworking project pages an optional specimen plate (photo, pins, horizontal leaders to species labels, numbered key), a click-to-place editor that writes its markup, generator support, and plates on the 9 multi-species projects.

**Architecture:** The plate is static HTML plus CSS in `rumbelievable.css`; pins carry their position as inline `--x`/`--y` custom properties and draw with no page JS. `tools/plate-editor.html` is a standalone dev page that builds the markup for pasting. `tools/new_project.py` accepts a pasted plate block.

**Tech Stack:** Static HTML/CSS, inline vanilla JS, Python 3 stdlib (`unittest`, `textwrap`), Google Fonts, Cloudinary URLs.

**Spec:** `docs/superpowers/specs/2026-10-16-specimen-plate-design.md`

## Global Constraints

- Branch `feature/specimen-plate`. Never commit to `main`; never push or merge without Annie's explicit go-ahead.
- No build step, no dependencies, no new JS on site pages. Page JS stays inline in `{ }` with `{ passive: true }` scroll listeners.
- One stylesheet: `assets/css/rumbelievable.css`. No `<style>` on site pages. Sanctioned exceptions: inline `style="--x:…; --y:…"` on `.plate-pin`, and a `<style>` block in `tools/plate-editor.html`.
- `--brass` never colours text; use `--brass-text` for text.
- "NTS" appears nowhere on the site or in the template.
- Project-page font URL, exactly: `https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900&family=Martian+Mono:wght@400;600&display=swap`
- Plate photo URLs use `c_scale,w_1200`.
- Copy: heading `Specimen Plate`; tag `Plate I · No. {no} · {title}`; caption attribute `Specimen plate · {n} species`; alt `{title}, specimen plate`; Wood-row link `See plate <span aria-hidden="true">→</span>`.
- Shell rules (from Annie's CLAUDE.md): no `&&`/`;` chaining, run servers in the background.
- `/archive/` is untouched.

## Review Focus

1. **Pins near the photo's edges** (x < 5% or > 95%, y < 3% or > 97%): the leader and label must stay visible and not overlap the photo; the editor clamps positions to 1–99%. *Pinned in Task 4's browser check (edge-pin case).*
2. **Long names in a narrow margin** ("Baltic Birch Plywood", "Leftover siding") at 700–900px: labels wrap inside the margin and never run over the photo. *Pinned in Task 2's 760px check.*
3. **A pasted plate with a blank line in it** (hand-edited): the generator must not keep half a block. It stops at the blank line, validation fails, and it re-prompts. *Pinned by `test_validate_plate_rejects_truncated_block` in Task 3.*
4. **Names containing `&`, `<` or `"`**: the editor escapes them in the output, and re-importing gives back the original text. *Pinned in Task 4's browser check (escape round-trip).*
5. **Lightbox unchanged on plated pages**: the plate photo must not join the lightbox set, and FIG numbering must run on. *Pinned in Task 2's and Task 5's checks (lightbox count equals photo count without the plate).*

---

### Task 1: Drop "Scale NTS" and add the italic axis

**Files:**
- Modify: `tools/new_project.py` (template lines ~28–30 font link, ~90–94 title block head)
- Modify: `assets/css/rumbelievable.css:443-447` (`.title-block-head`)
- Modify: all 13 `pages/woodworking/*.html` (font link, title block head)
- Test: `tools/test_new_project.py`

**Interfaces:**
- Produces: a template and pages whose title-block head has two cells (`No.`, `Drawn`) and whose font URL is the Global Constraints one. Later tasks assume the italic axis is loaded.

- [ ] **Step 1: Write failing tests** in `GeneratorTest`:

```python
def test_new_page_has_no_nts(self):
    np.generate(PROJECT, self.root)
    self.assertNotIn("NTS", self.read("pages/woodworking/test-bench.html"))

def test_new_page_loads_archivo_italic(self):
    np.generate(PROJECT, self.root)
    self.assertIn("family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900",
                  self.read("pages/woodworking/test-bench.html"))
```

- [ ] **Step 2: Run** `python3 -m unittest tools/test_new_project.py`. Expected: the 2 new tests FAIL, the rest pass.
- [ ] **Step 3: Edit the template.** Delete the `<div><span class="spec-label">Scale</span>NTS</div>` line, and swap in the font URL.
- [ ] **Step 4: Run the tests.** Expected: all pass.
- [ ] **Step 5: Apply the same two edits to the 13 project pages** with one `sed -i ''` per edit over `pages/woodworking/*.html`. Then set `.title-block-head { grid-template-columns: repeat(2, minmax(0, 1fr)); }`.
- [ ] **Step 6: Verify.** `grep -rl "NTS" pages/woodworking tools/new_project.py` prints nothing. `grep -L "Archivo:ital" pages/woodworking/*.html` prints nothing.
- [ ] **Step 7: Commit:** `git add` the template, test, CSS and 13 pages; message `Drop Scale NTS from title blocks; load Archivo italic on project pages`.

---

### Task 2: Plate CSS

**Files:**
- Modify: `assets/css/rumbelievable.css`. Add a `/* ── Specimen plate ── */` block after the `.project-photo-grid` media queries (~line 1110), plus `.plate-link` next to `.spec-value a` (~line 486).
- Modify: `docs/superpowers/specs/2026-10-16-shop-drawing-redesign-design.md`. Add one line under "Project pages" in § 6: `Optional specimen plate: see 2026-10-16-specimen-plate-design.md.`
- Temporary (never committed, deleted at the end of this task): `pages/woodworking/_plate-fixture.html`, a copy of `moon-fry-bed-frame.html` (relative paths then still resolve) with the spec § 3 example block pasted as the article's last child, using the page's own in-progress photo URL.

**Interfaces:**
- Consumes: the class names in spec § 3 (`plate`, `plate-figure`, `plate-tag`, `plate-stage`, `plate-photo`, `plate-pin[data-side]`, `plate-dot`, `plate-label`, `plate-latin`, `plate-key`, `plate-key-name`, `plate-link`).
- Produces: the visual contract the editor preview (Task 4) and the plates (Tasks 5–6) render against.

- [ ] **Step 1: Build the fixture**, and serve the site root with `python3 -m http.server 8000` (background).
- [ ] **Step 2: Write the rules** per spec § 3 "Desktop" and "Small screens". Values the spec fixes:
  - stage `width: 60%; margin-inline: auto; position: relative`
  - pin row `position: absolute; left: 0; right: 0; top: var(--y); height: 0`
  - dot 10px ring `1.5px solid var(--brass)`, ink centre, number visually hidden (clip pattern)
  - leader 1px `var(--ink)`. Left: `left: -8px; width: calc(var(--x) + 8px)`. Right: `left: var(--x); right: -8px`.
  - label `width: calc(33.333% - 20px)`, `transform: translateY(-50%)`. Left: `right: calc(100% + 12px); text-align: right`. Right: `left: calc(100% + 12px)`.
  - `.plate-figure::after { content: "FIG. " counter(fig, decimal-leading-zero) " · " attr(data-caption); text-transform: uppercase; }`
  - `.plate-link { display: block; margin-top: 4px; }`
  - `@media (max-width: 700px)`: stage `width: 100%`; `::before` and `.plate-label` `display: none`; dot 18px with its number visible, mono 9px, centred.
  - key: `ol` with `list-style: none` and a counter drawn as a boxed mono number. `columns: 2` above 700px when it has 3 or more items (`.plate-key:has(li:nth-child(3))`).
- [ ] **Step 3: Verify desktop.** Headless Chrome screenshots of the fixture at 1280×1600 and 760×1600, cropped to the plate. Leaders meet the dots and the labels. Labels sit in the margins, and at 760px they wrap without touching the photo. Caption reads `FIG. 07 · SPECIMEN PLATE · 2 SPECIES` (the hero and 5 grid photos precede it). Latin is a true italic.
- [ ] **Step 4: Verify phone.** A 390px iframe harness (as in NEXT-STEPS "Verification helpers") shows numbered pins, no labels or leaders, the key, and `document.documentElement.scrollWidth <= 390`.
- [ ] **Step 5: Verify the lightbox and links.** In the harness, `document.querySelectorAll('.masonry-item img, .project-photo-main, .project-photo-grid img').length` is 6 on the fixture, the same as the live page. `#plate` resolves.
- [ ] **Step 6: Delete the fixture**, then confirm `git status` shows only the CSS and the spec pointer.
- [ ] **Step 7: Commit** the CSS and the spec pointer: `Add specimen plate styles`.

---

### Task 3: Generator support

**Files:**
- Modify: `tools/new_project.py`
- Modify: `tools/README.md` (a "Specimen plates" section: the editor URL, the paste prompt, the blank-line rule)
- Test: `tools/test_new_project.py`

**Interfaces:**
- Consumes: the plate block format (spec § 3).
- Produces:
  - `validate_plate(text: str) -> str | None`: `None` when the stripped text starts with `<section class="plate"` and ends with `</section>`, else a one-line reason.
  - `collect_plate() -> str`: prompt per spec § 6. Reads with `rstrip()` only, until a blank line. Returns `""` on an immediate blank. Re-prompts while `validate_plate` returns a reason.
  - `plate_html(block: str) -> str`: `textwrap.indent(textwrap.dedent(block).strip("\n"), "      ")`.
  - `spec_row_html(label, value, url=None, extra="")`: `extra` is appended inside `.spec-value` after the value.
  - `d["plate"]` (str, `""` for none) returned by `collect()`. `article_html` appends `plate_html(d["plate"])` last when non-empty. `render_page` passes `extra=PLATE_LINK` to the Wood row when `d["plate"]`.
  - `PLATE_LINK = '<a href="#plate" class="plate-link">See plate <span aria-hidden="true">→</span></a>'`

- [ ] **Step 1: Write failing tests.** Add `"plate": ""` to `PROJECT`, and `PLATE = '<section class="plate" id="plate" aria-labelledby="plate-title">\n  <h2 id="plate-title">Specimen Plate</h2>\n</section>'`.

```python
def test_page_without_plate_has_no_plate(self):
    np.generate(PROJECT, self.root)
    page = self.read("pages/woodworking/test-bench.html")
    self.assertNotIn('class="plate"', page)
    self.assertNotIn('href="#plate"', page)

def test_page_with_plate_ends_article_and_links_wood(self):
    np.generate({**PROJECT, "plate": PLATE}, self.root)
    page = self.read("pages/woodworking/test-bench.html")
    article = page[page.index('<article class="project-narrative">'):page.index("</article>")]
    self.assertTrue(article.rstrip().endswith("      </section>"))
    self.assertIn('      <section class="plate"', article)
    wood = page[page.index('<span class="spec-label">Wood</span>'):]
    self.assertLess(wood.index('href="#plate"'), wood.index("</div>"))

def test_validate_plate_accepts_block(self):
    self.assertIsNone(np.validate_plate(PLATE))

def test_validate_plate_rejects_non_plate(self):
    self.assertIsNotNone(np.validate_plate("<div>nope</div>"))

def test_validate_plate_rejects_truncated_block(self):
    self.assertIsNotNone(np.validate_plate(PLATE.split("\n")[0]))
```

- [ ] **Step 2: Run** `python3 -m unittest tools/test_new_project.py`. Expected: the 5 new tests FAIL (`AttributeError: validate_plate`, missing plate).
- [ ] **Step 3: Implement** the Interfaces above. Call `collect_plate()` in `collect()` after lessons.
- [ ] **Step 4: Run the tests.** Expected: all pass.
- [ ] **Step 5: Smoke-test the prompt.** Run `printf` piped input through `python3 -c "import sys; sys.path.insert(0,'tools'); import new_project as n; print(repr(n.collect_plate()))"`. Feed a two-line plate then a blank: it returns the block. A bad line, then a blank, then a blank: it prints a reason and returns `""`.
- [ ] **Step 6: Write the README section.**
- [ ] **Step 7: Commit:** `Generator: optional specimen plate`.

---

### Task 4: Plate editor

**Files:**
- Create: `tools/plate-editor.html`
- Modify: `tools/README.md` (add the editor walkthrough to the Task 3 section)

**Interfaces:**
- Consumes: the Task 2 CSS (linked as `../assets/css/rumbelievable.css`) and the Global Constraints font URL.
- Produces: markup matching spec § 3 exactly. It has 2-space indentation from column 0, no blank lines, pins sorted by `y` ascending and numbered from 1, and percentages with one decimal (`--x:48.0%`).
- Functions inside the script block (names fixed so the browser check can describe them):
  - `normaliseUrl(url) -> string`: replace `c_scale,w_\d+` with `c_scale,w_1200`; if absent, insert `c_scale,w_1200/f_auto/q_auto/` right after `/upload/`.
  - `latinFor(common) -> string`: lookup in `SPECIES` (the spec § 4 list, keys lower-case, trimmed), `""` if unknown.
  - `latinHtml(latin) -> string`: escaped; a trailing ` spp.`/` sp.` goes outside `<i>`.
  - `plateMarkup(state) -> string`, where `state = { url, no, title, pins: [{ x, y, side, common, latin }] }`.
  - `parsePlate(html) -> state`: via `DOMParser`. Reads `--x`/`--y` from each pin's `style`, `data-side`, the label's text minus `.plate-latin`, and the `.plate-latin` text. `no`/`title` come from the tag. It's the inverse of `plateMarkup`.
  - `collisions(pins) -> Set`: pins on the same side whose `y` values are within 6.
  - `esc(s) -> string`: escapes `& < > "`.

- [ ] **Step 1: Build the page.** Two columns: a setup form (URL, No., Title), a pin list (common, Latin, side ⇄, delete) with Copy and an import textarea on the left; on the right, a live preview that renders `plateMarkup(state)` into a container with the site's `.project-narrative` class around it so the counters and spacing match. Clicking the `.plate-photo` in the preview adds a pin. Pointer-dragging a `.plate-dot` moves it, clamped to 1–99. The side defaults to `x < 50 ? 'left' : 'right'`. A Phone toggle constrains the preview to 390px. Collision rows get a warning line. Copy uses `navigator.clipboard.writeText` and shows "Copied".
- [ ] **Step 2: Browser check at 1280px** (Claude in Chrome, or by hand), each item passing:
  - A URL with `c_scale,w_500` becomes `w_1200`. A bare `/upload/v123/x.jpg` URL gains the transform after `/upload/`.
  - Typing "white oak" fills *Quercus alba*. "Purpleheart" renders *Peltogyne* spp. with "spp." upright. "Leftover siding" leaves the Latin field blank.
  - Clicking the left half defaults the side to left, and the ⇄ button flips it.
  - Two same-side pins at y 40 and 44 both warn. Moving one to y 60 clears the warning.
  - **Edge pin:** a pin dropped at the corner clamps to 1/99, and its label stays fully visible in the margin.
  - **Escape round-trip:** a common name `Maple & "Ash" <test>` copies as escaped markup. Pasting that markup into import restores the exact name.
  - Copy, then import the copy, then copy again gives byte-identical output.
  - The phone toggle shows numbered pins and the key only.
  - There are no console errors.
- [ ] **Step 3: Write the README walkthrough.**
- [ ] **Step 4: Commit:** `Add specimen plate editor`.

---

### Task 5: Moon Fry plate (end-to-end acceptance)

**Files:**
- Modify: `pages/woodworking/moon-fry-bed-frame.html` (plate block as the article's last child; `PLATE_LINK` as the last line of the Wood row's `.spec-value`, after `<p>Purpleheart</p>`)

**Interfaces:**
- Consumes: the Task 4 editor output, and `PLATE_LINK` copy from Task 3.

- [ ] **Step 1: Choose the photo.** Download the page's photos to a fresh scratch dir and view them. Pick the one where both the white oak and the purpleheart strip are visible (the in-progress shot shows the strip, per the page text).
- [ ] **Step 2: Draft the pins.** Read off the pixel positions of each species in the image, convert them to percentages, enter them in the editor, and copy the block.
- [ ] **Step 3: Annie review gate.** Give Annie the editor URL and the block to import. **STOP** until she returns an adjusted block or approves this one.
- [ ] **Step 4: Paste it into the page.**
- [ ] **Step 5: Verify** the same checks as Task 2 Steps 3–5, against the real page (1280px, 760px, 390px, lightbox count unchanged at 6, `See plate →` jumps to `#plate`).
- [ ] **Step 6: Commit:** `Moon Fry Bed Frame: specimen plate`.

---

### Task 6: Plates for the other 8 multi-species projects

**Files (each: plate block as the article's last child, `PLATE_LINK` at the end of the Wood `.spec-value`):**
- Modify: `pages/woodworking/housewarming-cutting-board.html`, `floating-night-stands.html`, `little-free-library.html`, `full-circle-memorial-urn.html`, `patterned-plywood-box.html`, `simple-coasters.html`, `sapele-squatty-potty.html`, `urn.html`

**Interfaces:**
- Consumes: the Task 4 editor and the spec § 5 species table (common names as written there; Leftover siding has no Latin name).

- [ ] **Step 1: Draft all 8 plates** as in Task 5 Steps 1–2. Note any species no photo shows; the plate leaves that species out (spec § 5).
- [ ] **Step 2: Annie batch review gate.** List each page with its chosen photo, its pins and any omitted species, and give the 8 blocks to import. **STOP** until she returns adjusted blocks or approves them.
- [ ] **Step 3: Paste them into the 8 pages.** For pages where the Wood value is a single string (`Tulip poplar and walnut`, `Sapele // White Oak`), append `PLATE_LINK` after the text.
- [ ] **Step 4: Verify** each page at 1280px and 390px: leaders on target, labels in the margins, no horizontal scroll, lightbox count unchanged, and the anchor works. One headless screenshot pair per page, shown to Annie.
- [ ] **Step 5: Commit:** `Specimen plates for the multi-species projects`.

---

### Task 7: Local docs and handoff

**Files:**
- Modify: `CLAUDE.md` (git-ignored, so it is not committed). Under Architecture, describe the plate component, the inline-`style` exception and the editor. Under "Adding a new woodworking project", mention the plate prompt.
- Modify: `NEXT-STEPS.md` (untracked). Replace its contents: the redesign is merged; this branch holds the plates; what remains is Annie's approval to merge.

- [ ] **Step 1: Edit both files.**
- [ ] **Step 2: Run** `python3 -m unittest tools/test_new_project.py` one final time. Expected: all pass.
- [ ] **Step 3: Report to Annie.** Do not merge or push.
