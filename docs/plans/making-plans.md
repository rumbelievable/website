# Making a plan set

How a plan set gets made: model the piece in Fusion or SketchUp, export one PNG per view, crop
and thicken the exports, lay them out on drafting sheets in `tools/plan-sheet.html`, print to PDF.

Spec: `docs/superpowers/specs/2026-11-02-plan-sheet-design.md`. Menu paths not confirmed against
the program's own help pages are marked *(may differ in your version)*.

## The whole workflow

Run the commands from the site folder.

| Step | What you do | Command |
|---|---|---|
| 1. Start the plan | Makes the plan folder with a starter `plan.json` | `make plan` |
| 2. Export the views | One PNG per view into the plan's `views/` folder | in [Fusion](#export-from-fusion) or [SketchUp](#export-from-sketchup) |
| 3. Crop and thicken | Crops the margin off every PNG; thickens thin lines | `make trim-views PLAN=3 THICKEN=1` |
| 4. Lay out the sheets | Place the views, fill in notes, cut list and steps | `make preview`, then the editor in Chrome |
| 5. Print | One sheet per page, Letter or A4 | **Print** → Save as PDF |

The `Makefile` is git-ignored, so it exists only on the computer it was made on. Without it:

| `make` command | Same thing without make |
|---|---|
| `make plan` | `python3 tools/new_plan.py ~/Desktop/plans` |
| `make trim-views PLAN=3 THICKEN=1` | `python3 tools/trim_views.py 3 --thicken 1` |
| `make preview` | `python3 -m http.server 8000` |

## Where plans live

Plans you sell never go in this repo. The repo is public on GitHub, and GitHub Pages publishes
everything on `main` to rumbelievable.com, including `tools/` and `docs/`. Plans live in
`~/Desktop/plans/` instead, one folder per plan:

```
~/Desktop/plans/
  p-003-floating-night-stands/
    plan.json      the sheets: title block, captions, notes, cut list, steps (written by the editor)
    views/         the images the sheets use: PNG, JPG or SVG
    originals/     untouched exports, kept by make trim-views (plus its record, .trim.json)
```

The folder is named `p-<project number>-<project page slug>`, which is how `make plan` and
`make trim-views` find it from a project number.

## Before you start: licences

Both free plans are for non-commercial use, and selling plan sets is commercial.

- **Fusion for personal use** is for "home-based, non-commercial" projects. Autodesk lists selling
  products as needing a commercial subscription.
  ([Fusion free licence changes](https://www.autodesk.com/support/technical/article/Fusion-360-Free-License-Changes),
  [subscription types](https://www.autodesk.com/products/fusion-360/blog/subscription-types/))
- **SketchUp Free** "is not for commercial use", watermarks PNG downloads, and can't edit styles.
  SketchUp Go ($10.75/month billed annually, as of 2026-11-02) removes those limits.
  ([SketchUp Free](https://help.sketchup.com/en/admin/sketchup-free),
  [SketchUp for Web features](https://help.sketchup.com/en/sketchup-web/web-features),
  [plans and pricing](https://sketchup.trimble.com/en/plans-and-pricing))

Check the current terms before selling a plan. They have changed several times.

## 1. Start the plan

`make plan` lists the woodworking projects and asks for a number. For project 3 it makes
`~/Desktop/plans/p-003-floating-night-stands/` with an empty `views/` folder and a `plan.json`
whose title block is filled in from the project page (P-003, Floating Night Stands, "No. 003,
2025", today's date). It has four blank sheets: cover, drawing, cut list and build step.

- It never overwrites an existing `plan.json`, and it keeps anything already in `views/`. If you
  exported into a folder before running it, rename the folder to the `p-003-…` name first.
- It refuses a folder inside the repo.
- `make plan PLANS_DIR=~/somewhere` puts the plan elsewhere.
- If `make preview` is running, it opens the editor in Chrome.

## 2. Export the views

Save each view into the plan's `views/` folder with a short lower-case name: `front.png`,
`side.png`, `top.png`, `iso.png`, `exploded.png`, `section-a-a.png`. Exporting again under the same
name updates the sheet on **Reload images**, with nothing to re-link. Shop photos go in `views/`
too (`.jpg` works).

Don't worry about the margin around the model or thin lines: step 3 fixes both.

**About scale:** a PNG isn't to scale. A view's printed size depends on the sheet, not the model.
Leave the sheet's Scale at **Not to scale** and let the dimensions carry the sizes. Only write a
scale like 1:4 if you've measured the printed sheet against it.

### Export from Fusion

Set up the design once, then capture each view. *(Menu paths may differ in your version.)*

1. **Orthographic camera:** Display Settings (the bar under the canvas) → **Camera** →
   **Orthographic**. Perspective distorts the dimensions.
2. **Line drawing style:** Display Settings → **Visual Style** → **Shaded with Visible Edges
   Only** for a plain line drawing. Use a shaded or rendered style for colour views (like
   `nightstand_boxonly.png`); `make trim-views` crops those but never thickens them.
3. **Clean canvas:** hide sketches, the origin, construction geometry and the layout grid, and
   keep the background plain white (or transparent, below).
4. **Named views:** set up each view with the ViewCube (Front, Right, Top, Home), then save it in the
   Browser under **Named Views** so every export is framed the same way.
5. **Capture:** **File → Capture Image**. Save as PNG into `views/`. A **transparent background**
   option, if offered, works too; white works just as well.

Fusion draws edges 1px wide at any capture size, which is why exports look so fine on paper.
`make trim-views THICKEN=1` fixes that afterwards.

**For dimensioned drawings,** Fusion's Drawing workspace (**File → New Drawing → From Design**)
makes real shop drawings: projected views, section views like A–A, detail views, dimensions and
proper line weights. Hide its border and title block, since the plan sheet draws its own. Export
it as PDF, then turn each view into an image the editor can use (PNG, JPG or SVG; the editor can't
place a PDF): open the PDF in Preview, **File → Export**, Format **PNG**, resolution 300, and save
into `views/`. Run `make trim-views` on it like any other export.

### Export from SketchUp

Set up a starter model once, save it as `plan-starter.skp`, then **Save as** `p-0nn-<slug>.skp`
for each plan. Steps marked **(Go)** need SketchUp Go.

- **Units:** Model Info → **Units**: Fractional inches, precision **1/16"**.
- **Style (Go):** Styles panel → **Edit Style**:
  - **Face Settings:** **Hidden Line** *(may differ in your version)*
  - **Edge Settings:** Edges on, colour ink `#22272c`; Profiles, Depth Cue, Extension, Endpoints
    and Jitter off
  - **Background:** white, **Sky** and **Ground** off (so a PNG can have a transparent background)
  - **Watermark:** none
  - In Free, pick the plainest default style with black edges and no sky.
- **Camera:** Views panel → **Parallel Projection**. *(may differ in your version)*
- **Tags:** put every part on one, so a view can hide what it doesn't need:

  | Tag | Holds |
  |---|---|
  | Case | top, bottom, sides, back |
  | Drawer | drawer box and front |
  | Hardware | slides, pulls, screws |
  | Wall | the wall and cleat context, for section views |
  | Dimensions | every dimension and label |
  | Guides | construction lines you don't want exported |

- **Scenes:** one per view. A scene remembers the camera, style and visible tags. When you change a
  view, update the scene, or the next export uses the old camera.

  | Scene | Camera | Tags on |
  |---|---|---|
  | Front | Front standard view | Case, Drawer, Hardware, Dimensions |
  | Side | Right standard view | Case, Drawer, Hardware, Dimensions |
  | Top | Top standard view | Case, Hardware, Dimensions |
  | Iso | Iso standard view | Case, Drawer, Hardware |
  | Exploded | Iso, after moving parts apart on a copy | Case, Drawer, Hardware |
  | Section A–A | Side, with a section plane through the drawer | everything except Guides |

- **Dimensions:** the Dimension tool, on the Dimensions tag; cyan `#2f5d8a` if your version lets
  you set the colour. *(may differ in your version)*
- **Save:** SketchUp for Web saves to Trimble Connect, so also download a copy of the `.skp`.

To export: select each scene, then **Download → PNG**, about 3000 px wide, transparent background
if offered.

## 3. Crop and thicken

`make trim-views` asks which plan (or `make trim-views PLAN=3` skips the question). For every PNG
in `views/` it:

- **crops the margin.** Exports are the shape of your screen with the model small in the middle,
  and the sheet fits the whole image into each slot. It crops to the model plus a small border.
  White and transparent backgrounds both work.
- **keeps the original.** The untouched export moves to `originals/`; the processed copy keeps the
  same name in `views/`, so the editor's **Reload images** picks it up.
- **thickens lines, if asked.** `THICKEN=1` grows every line by 1px on each side, so a 1px edge
  prints as about a 0.4mm pen line in a drawing slot. `THICKEN=2` is heavier. Only line drawings
  are thickened; colour renders are cropped but left alone, since it would smear the wood grain.
  Lines closer than a couple of pixels can merge into one, so check fine details like drawer
  reveals.

Then click **Reload images** in the editor.

Running it again is always safe. Every image is rebuilt from its untouched export, so lines are
never thickened twice. Images already done are left alone. A re-exported image replaces its older
copy in `originals/`. The plan remembers `THICKEN`, so a later plain `make trim-views` keeps it;
`THICKEN=0` turns it off and rebuilds from the originals. JPGs and SVGs aren't touched.

It needs macOS with the Xcode command line tools (`xcode-select --install`).

## 4. Lay out the sheets

1. Run `make preview`, then open `http://localhost:8000/tools/plan-sheet.html` in **Chrome**.
   Other browsers can't open folders.
2. **Open plan folder** and choose the plan's folder (not `views/`). Chrome asks once for
   permission to edit it.
3. Fill in the title block on any sheet. Plan number, name and so on update on every sheet.
4. Click a picture slot to choose an image from `views/`, and type its caption. **Add sheet** adds
   a Cover, Drawing, Cut list or Build step sheet. The buttons above each sheet reorder or delete
   it, or switch a drawing between 1, 2 or 4 views.
5. **Save** (or Cmd+S) writes `plan.json`. The images stay as separate files in `views/`.

The status line warns when a sheet's content runs past its border (split it into two sheets), and
when an image in the plan isn't in `views/`.

To start from the sample instead, open
`http://localhost:8000/tools/plan-sheet.html?plan=plan-sample/p-003-floating-night-stands/` and use
**Save to folder…**, which copies the sample into a folder you pick.

## 5. Print to PDF

**Print**, then in Chrome's print dialog:

- Destination: **Save as PDF**
- Paper size: the same as the toolbar's **Letter / A4** switch
- Margins: **None**
- Options: **Background graphics** on

You get one sheet per page. Print the plan once in each paper size if you sell both.

## Sources

- [Fusion free licence changes](https://www.autodesk.com/support/technical/article/Fusion-360-Free-License-Changes) and [subscription types](https://www.autodesk.com/products/fusion-360/blog/subscription-types/): personal use terms
- [Thicker lines for exported image](https://forums.autodesk.com/t5/fusion-design-validate-document/thicker-lines-for-exported-image/td-p/9722077): Fusion has no setting for capture line weight
- [SketchUp Free](https://help.sketchup.com/en/admin/sketchup-free): commercial use
- [SketchUp for Web features](https://help.sketchup.com/en/sketchup-web/web-features): what Free includes
- [Styles in SketchUp for Web](https://help.sketchup.com/en/styles-sketchup-web): Edit Style tab sections
- [Edge Styles](https://help.sketchup.com/en/sketchup/edge-styles): edge options
- [Importing and Exporting Image Files](https://help.sketchup.com/sketchup/importing-and-exporting-image-files): transparent PNG background
- [Plans and pricing](https://sketchup.trimble.com/en/plans-and-pricing)
