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
| Rollout | Optional per project. Annie makes plates herself with the editor; no pin positions are invented. |
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
      <span class="plate-pin" data-n="1" data-side="left" style="--x:48%; --y:22%" aria-hidden="true">
        <span class="plate-label">Purpleheart <i>Peltogyne</i> spp.</span>
      </span>
      <span class="plate-pin" data-n="2" data-side="right" style="--x:63%; --y:55%" aria-hidden="true">
        <span class="plate-label">White Oak <i>Quercus alba</i></span>
      </span>
    </div>
  </figure>
  <ol class="plate-key">
    <li><span class="plate-key-name">Purpleheart</span> <i lang="la">Peltogyne</i> spp.</li>
    <li><span class="plate-key-name">White Oak</span> <i lang="la">Quercus alba</i></li>
  </ol>
</section>
```

Rules:
- Pins are numbered top to bottom by `--y`. `data-n` on each pin matches its `<li>` position in the key.
- A pin with no Latin name has no `<i>` in its label or its key entry.
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
- `.plate-pin`: absolutely positioned at `left: var(--x); top: var(--y)`, centred on that point. A 10px
  brass ring with an ink centre dot, and a small mono number (`attr(data-n)`) beside it.
- Leader: a `::before` on the pin, a 1px `--ink` hairline at the pin's height, running horizontally from
  the pin to the stage edge and on into the margin. For `data-side="left"` it runs leftward from the pin
  (width `var(--x)` + margin offset); for `right`, rightward (width `100% - var(--x)` + margin offset).
- `.plate-label`: in the margin at the end of the leader, vertically centred on it. Common name in Martian
  Mono 10px uppercase, `--ink`; Latin name on the next line in Archivo italic 12px, `--ink-2`. Left labels
  are right-aligned to the leader end; right labels are left-aligned.
- `.plate-tag`: a boxed mono 10px uppercase tag (1px ink border, `--paper-2` fill) above the stage,
  aligned with the stage's left edge.
- `.plate-key`: below the figure, a numbered list in mono with the Latin names in italic, the numbers
  drawn as small boxed figures matching the pin numbers. Laid out in columns when there are several
  species.

### Small screens (< 700px)

- `.plate-stage` widens to 100%. The leaders and `.plate-label` are `display: none`.
- Pins show the ring with the number inside it (the number is what links pin to key).
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
- No plates are added to existing pages in this work, except the first one Annie makes as the acceptance
  test (§ 7).

## 6. Generator (`tools/new_project.py`)

- **Prompt**, after lessons learned: `Specimen plate: paste the block from tools/plate-editor.html,
  then a blank line (or Enter to skip):`. Lines are read until a blank line, like `collect_narrative`.
- **Validation:** the joined paste must start with `<section class="plate"` and end with `</section>`;
  otherwise the generator prints why and asks again. An immediate blank line skips.
- **Rendering:** with a plate, the block is re-indented to the article's level and appended as the last
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

**Acceptance:** Annie makes the Moon Fry Bed Frame plate (purpleheart strip, white oak) in the editor;
it is pasted into `pages/woodworking/moon-fry-bed-frame.html` and checked at both widths.

## 8. Docs

- `tools/README.md`: a "Specimen plates" section covering the editor and the generator prompt.
- `CLAUDE.md` (git-ignored, local only): the plate component, the inline-`style` exception, the editor.
- Shop Drawing spec: a one-line pointer to this spec under project pages.

## 9. Out of scope

Angled or dog-leg leaders, label positions independent of the pin height, part names or notes on labels,
more than one plate per project, plates on album pages, a scale bar, and adding plates to existing
projects (other than the acceptance plate).
