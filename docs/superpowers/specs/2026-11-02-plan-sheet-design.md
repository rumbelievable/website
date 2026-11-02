# Plan sheet template: design

Date: 2026-11-02 · Branch: `feature/plan-sheet`

## Goal

A reusable way to produce printed plan sets (the PDFs sold as digital woodworking plans) that
lightly follow the site's Shop Drawing design, drawn in **SketchUp Free**.

SketchUp Free has no LayOut, no Ruby and no custom templates, and `.skp` is a closed binary format,
so the "template" is two parts:

1. **A SketchUp starter model** Annie builds once from a checklist and duplicates per plan. It fixes
   the style, tags, scenes and export settings so every exported view looks the same.
2. **A print sheet editor**, `tools/plan-sheet.html`: drafting sheets with border, zones and title
   block, filled in the browser with text and the exported PNGs, printed to PDF from Chrome.

## Sources

- Approved product page: `mockups/plan-package/v2-r1.html` on branch `mockups/plan-package` (the
  light table, § 2 cover card, title block, general notes, sheet S-11). Its theme notes:
  `mockups/plan-package/theme.md` on the same branch.
- Rule from that decision: the PDFs follow the design **lightly** (sheet border, title block,
  Archivo + Martian Mono, ink/cyan/brass, numbered sheets), legible and printable first.
- Site tokens: `assets/css/rumbelievable.css`.

## Files

| Path | What |
|---|---|
| `tools/plan-sheet.html` | Editor and print template. A dev page, like `tools/plate-editor.html`: `noindex`, inline `<style>` and `<script>`. |
| `tools/plan-sample/p-003-floating-night-stands/plan.json` | Sample plan, placeholder data from the mockup, all four layouts. |
| `tools/plan-sample/p-003-floating-night-stands/views/*.svg` | Sample views made from the mockup's SVG drawings (no SketchUp export is possible here). |
| `docs/plans/sketchup-starter.md` | One-time SketchUp Free setup checklist and the per-plan export steps. |

The editor does **not** link `rumbelievable.css`: the site stylesheet's body padding, fixed `.sheet`
frame and nav rules are wrong for a print document. It copies the tokens it needs (`--paper`,
`--paper-2`, `--ink`, `--ink-2`, `--hairline`, `--brass`, `--brass-text`, `--cyan`, the two font
stacks) into its own `<style>`, as the mockup did. Fonts come from the same Google Fonts URL as
the plate editor.

Nothing else in the site changes: no nav link, no page, no generator change.

## Where plans live

A plan is a folder **outside this repo** (e.g. `~/Dropbox/plans/`), because GitHub Pages publishes
everything in the repo and these are paid drawings. Only the placeholder sample lives in the repo.

```
p-003-floating-night-stands/
  plan.json        written by Save
  views/           SketchUp exports and shop photos (png, jpg, svg)
```

The editor opens the folder with `showDirectoryPicker()` (Chrome, read/write; it works on
`http://localhost:8000` because localhost is a secure context). Images are read from `views/`
as files and shown via object URLs; they are never copied into `plan.json`. Re-exporting a view
over the same filename updates the sheet on the next **Reload images** or page reload.

## plan.json

```json
{
  "version": 1,
  "plan": {
    "no": "P-003",
    "name": "Floating Night Stands",
    "drawn": "A.R.",
    "units": "Inches",
    "rev": "A",
    "date": "2026-11-02",
    "built": "No. 003, 2025",
    "paper": "letter"
  },
  "sheets": [
    { "layout": "cover", "title": "Cover", "scale": "Not to scale",
      "image": { "src": "views/iso.png", "caption": "As built" },
      "notes": ["Dimensions in inches.", "Case is 3/4\" white oak, mitered at all four corners."] },

    { "layout": "drawing", "title": "Front elevation and section A–A", "scale": "1:4",
      "slots": 2,
      "views": [ { "src": "views/front.png", "caption": "Front elevation" },
                 { "src": "views/section-a-a.png", "caption": "Section A–A" } ],
      "notes": ["Check your slides' clearance before cutting the drawer box."] },

    { "layout": "cutlist", "title": "Cut list, for a pair", "scale": "",
      "parts": [ { "name": "Top", "qty": "2", "t": "¾", "w": "10", "l": "20",
                   "material": "White oak", "notes": "" } ],
      "materials": ["White oak, 4/4, 12 bd ft"],
      "hardware": ["18\" undermount slides, 1 pair per drawer"] },

    { "layout": "step", "title": "Fitting the undermount slides", "scale": "Not to scale",
      "images": [ { "src": "views/slides.jpg", "caption": "" } ],
      "steps": ["Mark a line 1/8\" up from the case bottom.", "Set each slide to the line."],
      "parts": "D, E, F",
      "callout": { "kind": "tip", "text": "" } }
  ]
}
```

- `plan.paper` is `"letter"` or `"a4"`. All sheets are landscape.
- Sheet numbers (`S-01`), the total, part letters and step numbers are **derived, never stored**:
  sheets number in array order; part letters run A, B, C… across all cut-list sheets in order
  (a second cut-list sheet continues the letters); step numbers count step sheets in order.
- `drawing.slots` is 1, 2 or 4. `views` holds up to that many entries; extra entries are kept but
  not shown, so switching 4 → 2 → 4 loses nothing.
- `step.images` holds 1 or 2. `step.callout.kind` is `"tip"` or `"caution"`; empty text hides it.
- Any string may be empty. An empty `scale` hides the Scale row.
- Unknown keys are preserved on save.

## The sheet

Every sheet is one printed page: Letter landscape (11 × 8.5 in) or A4 landscape (297 × 210 mm).

- **Paper:** white in print. On screen the sheets sit on a vellum (`--paper`) desk, each one white.
- **Border:** 1.5px ink rule inset from the page edge, zone labels 1–8 along the top and bottom,
  A–F down both sides, Martian Mono 7pt, `--ink-2`.
- **Title block,** bottom-right, ~3.4 in wide, ruled like the mockup's (`spec-row` grid,
  cyan hairlines, ink outer rules):
  - head row: Plan `P-003` · Drawn `A.R.`
  - Sheet title (Archivo 800, 125% width, uppercase)
  - plan name
  - Sheet `03 / 07` · Scale `1:4` (row hidden when empty)
  - Units · Rev `A` · Date
  - a 3pt `--brass` rule above the sheet number cell: the only brass on the sheet
- **Colour:** ink for linework and body text; cyan for labels, captions and callout rules;
  `--brass-text` is not used in print. Nothing below 8pt except zone labels (7pt).
- **Type:** Archivo for titles and body, Martian Mono for labels, tables, captions and the
  title block.

### Layouts

1. **Cover.** Plan number eyebrow (`PLAN SET P-003`), plan name large (Archivo 800, 125%,
   uppercase), hero image with caption, **sheet index** generated from every sheet's number and
   title, general notes (numbered), and "Built: No. 003, 2025" from `plan.built`.
2. **Drawing.** 1, 2 (side by side) or 4 (2 × 2) view slots. Images fit with `object-fit: contain`
   so any export size works. Each slot has a caption under it in Martian Mono, uppercase, ink,
   600 weight (like the mockup's `t-cap`). A numbered notes strip runs along the bottom, left of
   the title block; it hides when empty.
3. **Cut list + materials.** Parts table: Part · Name · Qty · T × W × L · Material · Notes, with
   the letter column derived. Header row in cyan Martian Mono, hairline rules. Below it, Materials
   and Hardware as two columns of plain lists. Rows that overflow the sheet do not split onto a
   new page; the editor warns instead (see Errors).
4. **Build step.** `STEP 03` eyebrow and the step title, 1 or 2 images with captions, numbered
   instructions, an optional **Parts: D, E, F** line, and an optional Tip or Caution callout set
   off by a 3px cyan left rule with its kind as a Martian Mono label. No icons.

## Editing

- A toolbar (screen only, `position: sticky`) holds: **Open plan folder**, **Save**,
  **Reload images**, **Letter / A4**, **Add sheet ▾** (cover, drawing, cut list, build step),
  **Print**, and a status line (folder name, "Unsaved changes", warnings).
- Every text field is `contenteditable="plaintext-only"`; edits write straight into the in-memory
  plan object. Lists (notes, steps, materials, hardware, cut-list rows) have add (+), delete (✕)
  and move (↑ ↓) buttons per item, labelled for screen readers.
- Each sheet has screen-only controls in its top margin: layout name, ↑ ↓ move, ✕ delete, and for
  drawing sheets a 1 / 2 / 4 slot switch, for step sheets a 1 / 2 image switch.
- Clicking an image slot opens a small list of the image files in `views/` (png, jpg, jpeg, svg),
  plus "None". The editor doesn't import files from elsewhere: copy exports into `views/` first.
- `Cmd/Ctrl+S` saves. Leaving with unsaved changes triggers the browser's `beforeunload` prompt.
- `?plan=<relative path>` loads a plan folder over HTTP read-only (used for the sample and for
  headless tests); Save is then replaced by **Save to folder…**, which asks for a directory.

## Printing

- `@page { size: letter landscape; margin: 0 }`, swapped for `size: A4 landscape` by the paper
  switch (the editor rewrites one `<style id="page-size">` element).
- Each sheet is a fixed-size box (`11in × 8.5in` or `297mm × 210mm`) with `break-after: page`.
- `@media print` hides the toolbar, sheet controls, list buttons and the desk background.
- Missing images print as a dashed box with the filename, so a gap can't go unnoticed.
- The editor's **Print** button runs `window.print()`; Annie saves as PDF from Chrome's dialog with
  margins "None" and "Background graphics" on (the guide says so).

## Errors

- **No folder access API** (not Chrome/Edge): status line says so; `?plan=` viewing still works.
- **Folder has no `plan.json`:** the editor offers to start a new plan there (one cover sheet,
  plan number blank) and creates `views/` on first Save if missing.
- **Invalid `plan.json`** (bad JSON or `version` ≠ 1): the status line names the problem
  ("plan.json line 14: unexpected comma") and nothing loads; Save is disabled, so the file is never
  overwritten. Annie fixes it in a text editor and opens the folder again.
- **Image not found** in `views/`: dashed placeholder on screen and in print, and a count in the
  status line ("2 images missing").
- **Sheet overflow:** after each render the editor checks every sheet's content box for overflow
  and marks the sheet ("Content runs past the sheet: split it") in the status line and in the
  sheet's top margin. Print still works.
- **Save fails** (permission revoked): status line error; changes stay in memory.

## SketchUp starter (docs/plans/sketchup-starter.md)

One-time setup in SketchUp Free, saved as `plan-starter.skp`, then **Save as** per plan:

- **Units:** fractional inches, precision 1/16".
- **Style:** Hidden Line faces; edges on, colour "all same" ink `#22272c`; profiles, depth cue,
  extension, endpoints, jitter off; background white; sky and ground off; section fill light grey
  where offered; no watermark.
- **Camera:** parallel projection.
- **Tags:** Case · Drawer · Hardware · Wall · Dimensions · Guides.
- **Scenes:** Front, Side, Top, Iso, Exploded, Section A–A; each saves camera, style and tag
  visibility.
- **Dimensions** on the Dimensions tag, cyan `#2f5d8a` if the dimension colour can be set.
- **Per plan:** for each scene, Download → PNG, 3000 px wide, transparent background, saved as
  `views/<scene>.png` in the plan folder (`front.png`, `section-a-a.png`, …).

Every menu path is checked against SketchUp's current help pages when the guide is written; steps
that may differ by version say so.

## Testing

No JS test infrastructure exists, and this adds none. Verification:

- Headless Chrome against `tools/plan-sheet.html?plan=plan-sample/p-003-floating-night-stands/`:
  the sample renders all four layouts; sheet numbers, the total, the cover's sheet index, part
  letters (continuing across two cut-list sheets) and step numbers are right; add / move / delete
  sheet and list items update all derived numbers; the serialized plan round-trips (load → save
  → load gives the same JSON, unknown keys kept); a missing image shows its placeholder and the
  count; an over-full cut list raises the overflow warning.
- Print to PDF headlessly at Letter and at A4: page count equals sheet count, each page the right
  size, no toolbar or controls in the output. Annie looks at the PDF.
- Manual, by Annie: Open plan folder → pick a PNG → Save → reload, in real Chrome (the permission
  prompt can't be clicked headlessly), and the SketchUp guide followed once.

## Out of scope

- Automatic mm conversion (the mockup's "metric on every sheet" is a placeholder claim).
- A 1:1 "print at 100%" check ruler for full-size templates.
- Board yield diagrams generated from the cut list.
- A Plans page, plans index or nav link on the site; selling and delivery.
- Cut-list rows splitting across pages automatically.
