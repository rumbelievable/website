# Specimen Plate: design spec

Date: 2026-10-16. Branch: `feature/specimen-plate` off `main`.
Builds on the Shop Drawing spec (`2026-10-16-shop-drawing-redesign-design.md`).

## 1. Intent

Each woodworking project can carry a **specimen plate**: one project photo, drawn up like a
natural-history plate, with hairline leaders running from the parts of the piece to labels naming the
wood species (common and Latin name). It answers "which wood is which part?" at a glance, and gives
the project pages a scientific, forensic feel that sits inside the drafting-sheet language.

Success:
- A plate reads cleanly at 1280px and at 390px, with no horizontal scroll.
- Annie places pins by clicking on the photo, not by guessing percentages.
- Projects without a plate look exactly as they do today.
- `make project` can add a plate to a new project, and the generator tests cover it.

## 2. Decisions

| Topic | Decision |
|---|---|
| Style | Anatomy / specimen plate: hairline leaders, pin dots, margin labels, a numbered key, a boxed specimen tag. No scale bar. |
| Photo | One photo per plate, chosen per project from existing shots. Any Cloudinary URL; swapping later means changing one `src`. |
| Label content | Common name (required) and Latin name (optional). No part names, no notes. |
| Placement | Last section inside `.project-narrative`, after the story, before the pager. The title block's `Wood` row links to it. |
| Rollout | Every project with more than one species gets a plate now (the 9 in § 5). Single-species projects get none unless Annie adds one later. Claude drafts each plate (photo choice and pin positions, from looking at the photos); Annie reviews and adjusts each in the editor before it is committed. The plate stays optional in the markup and the generator. |
| Rendering | CSS only. Pins positioned by inline `--x` / `--y` custom properties, horizontal leaders. No JS on the page. |
| Small screens | Under 700px, leaders and margin labels hide; pins show their number only. The key shows at every size. |
| Lightbox | The plate photo is not in the lightbox (it could not show the leaders). |
| "NTS" | Removed everywhere: from the plate and from every title block header. |
| Italic | Archivo's italic axis is added to the Google Fonts URL on project pages and in the generator template, for Latin names. |

## 3. The plate on the page

### Markup

The editor (§ 4) produces this block; it is pasted as the last child of `<article class="project-narrative">`.

```html
<section class="plate" id="plate" aria-labelledby="plate-title">
  <h2 id="plate-title">Specimen Plate</h2>
  <figure class="fig plate-figure" data-caption="Specimen plate · 2 species">
    <p class="plate-tag">Plate I · No. 009 · Moon Fry Bed Frame</p>
    <div class="plate-stage">
      <img class="plate-photo" src="https://res.cloudinary.com/df4rizvgx/image/upload/c_scale,w_1200/f_auto/q_auto/…" alt="Moon Fry Bed Frame, specimen plate" loading="lazy">
      <span class="plate-pin" data-side="left" style="--x:48%; --y:22%" aria-hidden="true">
        <span class="plate-dot">1</span>
        <span class="plate-label">Purpleheart <span class="plate-latin"><i>Peltogyne</i> spp.</span></span>
      </span>
      <span class="plate-pin" data-side="right" style="--x:63%; --y:55%" aria-hidden="true">
        <span class="plate-dot">2</span>
        <span class="plate-label">White Oak <span class="plate-latin"><i>Quercus alba</i></span></span>
      </span>
    </div>
  </figure>
  <ol class="plate-key">
    <li><span class="plate-key-name">Purpleheart</span> <span class="plate-latin" lang="la"><i>Peltogyne</i> spp.</span></li>
    <li><span class="plate-key-name">White Oak</span> <span class="plate-latin" lang="la"><i>Quercus alba</i></span></li>
  </ol>
</section>
```

Rules:
- Pins are numbered top to bottom by `--y`. Each pin's `.plate-dot` holds its number, which matches its `<li>` position in the key.
- A pin with no Latin name has no `.plate-latin` in its label or its key entry.
- Botanical convention: a trailing `spp.` or `sp.` sits outside the italics
  (`<i>Peltogyne</i> spp.`). The editor splits it off when it writes the markup.
- `data-caption` reads `Specimen plate · N species` (`1 species` when there is one).
- Pins are `aria-hidden`; the key is the accessible content. The image alt is `{Title}, specimen plate`.
- The plate is always "Plate I" (one per project).
- **House-rule exception:** the inline `style="--x:…; --y:…"` is positional data, not visual state.
  CSS cannot read lengths from `data-*` attributes, so custom properties are the only CSS-only way.
  This is the one sanctioned inline `style` on site pages.

### Numbering

- The `<h2>` sits inside `.project-narrative`, so the existing `sec` counter gives it `§ n` with no new
  rules.
- `.plate-figure` carries `.fig`, so it takes the next `FIG.` number. Its caption overrides the generic one:
  `.plate-figure::after { content: "FIG. " counter(fig, decimal-leading-zero) " · " attr(data-caption); }`
  with `text-transform: uppercase` on that rule (the generic caption is literal uppercase text, so it
  has none).
- The lightbox selector (`.masonry-item img, .project-photo-main, .project-photo-grid img`) does not match
  `.plate-photo`, so the lightbox is untouched.

### Desktop (≥ 700px)

- `.plate-figure` spans the content column. `.plate-stage` is `position: relative`, centred, 60% of the
  figure's width, leaving about 20% each side for labels. The photo has the standard 1px ink hairline.
- `.plate-pin`: an absolutely positioned **zero-height row the full width of the stage** at
  `top: var(--y)`, so that percentages on its children and pseudo-elements are percentages of the photo's
  width.
- `.plate-dot`: at `left: var(--x)`, centred on the point. A 10px brass ring with an ink centre; the
  number inside it is visually hidden on desktop and shown on small screens.
- Leader: the pin's `::before`, a 1px `--ink` hairline at the row's height. For `data-side="left"` it
  runs from `-8px` (just past the stage's left edge) to `var(--x)`; for `right`, from `var(--x)` to
  `calc(100% + 8px)`.
- `.plate-label`: in the margin at the leader's end, vertically centred on the row, width
  `calc(33.333% - 20px)` (the 20% figure margin is 33.333% of the 60% stage). Left labels sit at
  `right: calc(100% + 12px)`, right-aligned; right labels at `left: calc(100% + 12px)`, left-aligned.
  Common name in Martian Mono 10px uppercase, `--ink`; `.plate-latin` is a block on the next line in
  Archivo italic 12px, `--ink-2`, not uppercased. Long names wrap inside the margin.
- The stage has no `overflow: hidden`, so leaders and labels can extend into the margins.
- `.plate-tag`: a boxed mono 10px uppercase tag (1px ink border, `--paper-2` fill) above the stage,
  aligned with the stage's left edge.
- `.plate-key`: below the figure, a numbered list in mono with the Latin names in italic, the numbers
  drawn as small boxed figures matching the pin numbers. Laid out in columns when there are several
  species.

### Small screens (< 700px)

- `.plate-stage` widens to 100%. The leaders and `.plate-label` are `display: none`.
- `.plate-dot` grows to an 18px ring with its number showing inside (the number links pin to key).
- Nothing changes in the key.

### The `Wood` row link

On pages with a plate, the `Wood` row's `.spec-value` gets a last line:
`<a href="#plate" class="plate-link">See plate <span aria-hidden="true">→</span></a>`, styled like the
existing `.spec-value a` links. Pages without a plate don't get one.

## 4. The plate editor: `tools/plate-editor.html`

A standalone page served by `make preview` at `localhost:8000/tools/plate-editor.html`. It is not linked
from the site. It loads `../assets/css/rumbelievable.css` (so its preview is the real plate) and the same
Google Fonts URL as project pages. It never writes files; it produces markup to copy.

### Flow

1. **Setup fields:** photo URL, project number (`009`), project title. The URL is normalised to
   `c_scale,w_1200`: an existing `c_scale,w_NNN` is replaced; a URL with no transform gets
   `c_scale,w_1200/f_auto/q_auto/` inserted after `/upload/` (keeping any `v123…/` version segment
   after it).
2. **Place:** clicking the photo adds a pin at that point, as percentages to one decimal place. A row
   appears in the pin list with: common name (text), Latin name (text, pre-filled from the species list
   when the common name matches, case-insensitive; editable; may be blank), and side (left/right,
   defaulting to the half of the photo that was clicked). Each row has a delete button.
3. **Adjust:** pins can be dragged on the photo (pointer events; positions clamp to 0–100%).
4. **Preview:** the plate renders live using the site CSS, with a toggle that constrains the preview to
   390px to show the phone layout.
5. **Overlap warning:** if two pins on the same side are within 6 percentage points of each other on
   `--y`, both rows are flagged with "labels may collide; flip one to the other side".
6. **Copy:** one button copies the `<section class="plate">` block (§ 3 markup), with pins sorted and
   numbered top to bottom, the caption count filled in, and **no blank lines** (the generator relies on
   this). A note confirms the copy.
7. **Re-import:** a textarea accepts a previously generated plate block; parsing it restores the URL,
   tag fields and pins so a published plate can be adjusted and re-copied.

### Species list

A plain object in the editor's script, mapping lower-case common names to Latin names. It covers every
species in the current `Wood` rows plus common shop woods:

walnut → *Juglans nigra*; hard maple / maple → *Acer saccharum*; cherry → *Prunus serotina*;
white oak → *Quercus alba*; red oak → *Quercus rubra*; purpleheart → *Peltogyne spp.*;
sapele → *Entandrophragma cylindricum*; tulip poplar / poplar → *Liriodendron tulipifera*;
alder → *Alnus rubra*; baltic birch / baltic birch plywood → *Betula pendula*; ash → *Fraxinus americana*;
hickory → *Carya spp.*; mahogany → *Swietenia macrophylla*; padauk → *Pterocarpus soyauxii*;
wenge → *Millettia laurentii*; zebrawood → *Microberlinia brazzavillensis*; bubinga → *Guibourtia spp.*;
teak → *Tectona grandis*; cedar → *Thuja plicata*; pine → *Pinus spp.*; douglas fir → *Pseudotsuga menziesii*;
beech → *Fagus grandifolia*; birch → *Betula alleghaniensis*; bloodwood → *Brosimum rubescens*;
canary wood → *Centrolobium spp.*

Unknown species simply get a blank Latin field.

### Code rules

- All JS inline in one `<script>`, wrapped in `{ }`, no dependencies.
- The editor's own layout CSS (setup form, pin list, buttons) lives in a `<style>` block in the editor.
  This is a sanctioned exception: it is a dev tool, not a site page. The plate itself uses only
  `rumbelievable.css`.
- Output is escaped: `&`, `<`, `>`, `"` in names, title and URL are HTML-escaped.

## 5. Site-wide changes

- **CSS** (`assets/css/rumbelievable.css`): a new `/* ── Specimen plate ── */` block in the project page
  section, covering § 3. `.title-block-head` goes from 3 to 2 columns.
- **"Scale NTS" removed** from the title block header on all 13 project pages and in the generator
  template. The header becomes `No.` / `Drawn`.
- **Italic axis:** the Google Fonts URL on all 13 project pages and in the template becomes
  `family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900&family=Martian+Mono:wght@400;600`.
  Other pages are unchanged (they have no Latin names).
- **Plates for the 9 multi-species projects**, with the common names as they appear in each `Wood` row:

  | Page | Species |
  |---|---|
  | `moon-fry-bed-frame.html` | White Oak, Purpleheart |
  | `housewarming-cutting-board.html` | Walnut, Hard Maple, Cherry |
  | `floating-night-stands.html` | White Oak, Walnut |
  | `little-free-library.html` | Leftover siding (no Latin name), White Oak |
  | `full-circle-memorial-urn.html` | Tulip Poplar, Walnut |
  | `patterned-plywood-box.html` | Walnut, Hard Maple, Baltic Birch Plywood |
  | `simple-coasters.html` | Walnut, Maple, Alder |
  | `sapele-squatty-potty.html` | Sapele, White Oak |
  | `urn.html` | Walnut, Hard Maple |

  The photo for each is chosen from that page's existing photos: the one where every species is visible.
  If no single photo shows every species, the plate pins the ones it can, and the key still lists only
  the pinned species (the `Wood` row stays the full record). Each plate's "See plate →" link is added to
  its `Wood` row.
- The editor is reachable on the live site at `/tools/plate-editor.html`, because Pages deploys the repo
  root, but nothing links to it. That's acceptable: it has no secrets and writes nothing.

## 6. Generator (`tools/new_project.py`)

- **Prompt**, after lessons learned: `Specimen plate: paste the block from tools/plate-editor.html,
  then a blank line (or Enter to skip):`. Lines are read until a blank line, like `collect_narrative`, keeping their indentation.
- **Validation:** the joined paste must start with `<section class="plate"` and end with `</section>`;
  otherwise the generator prints why and asks again. An immediate blank line skips.
- **Rendering:** with a plate, the block is dedented and re-indented to the article's level (6 spaces) and appended as the last
  part of `article_html`, and the `Wood` row gets the `See plate →` link. Without a plate, output is
  byte-for-byte what the current template produces apart from the § 5 changes.
- **Template:** `Scale NTS` cell removed; italic font URL.
- The plate's tag number and title come from the editor, so the generator doesn't rewrite them.

## 7. Testing and verification

**Generator** (`tools/test_new_project.py`, stdlib `unittest`):
- A plate given → the section appears inside `<article class="project-narrative">`, after the last
  narrative part, and the `Wood` row contains `href="#plate"`.
- No plate → no `class="plate"` and no `#plate` link.
- A bad paste (no `<section class="plate"`, or no closing `</section>`) is rejected by the validator.
- The generated page contains no `NTS` and a font URL containing `ital`.
- Existing tests still pass.

**Editor** (by hand in the browser, at desktop width): load a URL with and without a transform; place,
drag and delete pins; Latin prefill and override; side default and flip; the overlap warning; the phone
preview; copy; paste the copied block back in and get the same pins.

**Pages** (at 1280px and 390px): a page with a plate and one without. Check the leaders land on the pins
and the labels clear the photo; the phone layout has numbered pins and no horizontal scroll; the
`FIG.` and `§` numbers run on correctly; `See plate →` scrolls to the plate; the lightbox steps through
the same images as before; the title block header shows `No.` / `Drawn` only; italic Latin is a real
italic.

**Acceptance:** the Moon Fry Bed Frame plate (purpleheart strip, white oak) goes first, end to end:
Claude drafts it, Annie adjusts it in the editor, it is pasted into
`pages/woodworking/moon-fry-bed-frame.html` and checked at both widths. Only then are the other 8 drafted,
and Annie reviews them as a batch.

## 8. Docs

- `tools/README.md`: a "Specimen plates" section covering the editor and the generator prompt.
- `CLAUDE.md` (git-ignored, local only): the plate component, the inline-`style` exception, the editor.
- Shop Drawing spec: a one-line pointer to this spec under project pages.

## 9. Out of scope

Angled or dog-leg leaders, label positions independent of the pin height, part names or notes on labels,
more than one plate per project, plates on album pages, a scale bar, and plates for single-species
projects.
