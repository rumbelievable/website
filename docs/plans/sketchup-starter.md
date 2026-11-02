# Drawing a plan set: SketchUp starter model and plan sheets

How a plan set gets made: model the piece in SketchUp's web app, export one PNG per view, lay the
views out on drafting sheets in `tools/plan-sheet.html`, print to PDF.

Spec: `docs/superpowers/specs/2026-11-02-plan-sheet-design.md`. Checked against SketchUp's help pages
on 2026-11-02; anything those pages didn't confirm for the web app is marked *(may differ in your
version)*.

## Before you start: SketchUp Free can't make plans you sell

SketchUp's own help pages say three things about the Free plan that matter here:

- **"SketchUp Free is not for commercial use."** ([SketchUp Free](https://help.sketchup.com/en/admin/sketchup-free))
  Selling plan sets is commercial use.
- **PNG downloads carry a watermark** in Free ("Print Files and Download Model Files in .png File
  Format: Yes, with a watermark"). ([SketchUp for Web features](https://help.sketchup.com/en/sketchup-web/web-features))
- **Free can't create or edit styles** ("Create and Edit Styles, Style templates, and Materials":
  subscription only). You can only pick built-in styles, so the style settings below can't be set.

**SketchUp Go** ($10.75/month, billed annually, as of 2026-11-02) is the same web app without those
limits. [Plans and pricing](https://sketchup.trimble.com/en/plans-and-pricing). Pro adds the desktop
app and LayOut; this workflow doesn't need it.

Free is fine for trying the workflow. The steps below are the same in Free and Go; the ones marked
**(Go)** need the subscription.

## Set up the starter model once

Open a new model in SketchUp for Web, make these settings, then save it as `plan-starter.skp`.

### Units

Open Model Info (the Open Model/Preferences icon, then **Model Info**) → **Units**:

- Format: **Fractional**, inches
- Precision: **1/16"**

### Style **(Go)**

Open the **Styles** panel → **Edit Style** tab. Then:

- **Face Settings:** **Hidden Line**, which gives white faces with black lines and prints cleanest. *(may differ in your version)*
- **Edge Settings:**
  - **Edges** on, and **Color: All same**, set to ink `#22272c`
  - **Profiles**, **Depth Cue**, **Extension**, **Endpoints** and **Jitter** all off
- **Background Settings:** background white; **Sky** and **Ground** off. With sky and ground off, a
  PNG export can have a transparent background.
- **Watermark Settings:** none.
- Section fill, if your version offers it: light grey. *(may differ in your version)*

In Free, open **Browse → Default Styles** and pick the plainest one with black edges and no sky.

### Camera

**Views** panel → **Parallel Projection**. Perspective views distort the dimensions.
*(may differ in your version)*

### Tags

Create these tags and put every part on one:

| Tag | Holds |
|---|---|
| Case | top, bottom, sides, back |
| Drawer | drawer box and front |
| Hardware | slides, pulls, screws |
| Wall | the wall and cleat context, for section views |
| Dimensions | every dimension and label |
| Guides | construction lines you don't want exported |

Turning a tag off removes it from a view. For example, a clean iso view leaves Dimensions and
Wall off.

### Scenes

In the **Scenes** panel, add one scene per view. A scene remembers the camera, the style and which
tags are visible. That's what makes every export come out framed the same way.

| Scene | Camera | Tags on |
|---|---|---|
| Front | Front standard view | Case, Drawer, Hardware, Dimensions |
| Side | Right standard view | Case, Drawer, Hardware, Dimensions |
| Top | Top standard view | Case, Hardware, Dimensions |
| Iso | Iso standard view | Case, Drawer, Hardware |
| Exploded | Iso, after moving parts apart on a copy | Case, Drawer, Hardware |
| Section A–A | Side, with a section plane through the drawer | everything except Guides |

When you change a view, **update the scene**, or the next export uses the old camera.

### Dimensions

Draw dimensions with the **Dimension** tool, on the **Dimensions** tag. Set the dimension colour
to cyan `#2f5d8a` if your version lets you. *(may differ in your version)*

The sheet's title block and captions use the site's fonts, so SketchUp's own dimension font doesn't
need to match.

### Save it

Save as **`plan-starter.skp`**. SketchUp for Web saves to Trimble Connect, so also **download** a copy
of the `.skp` and keep it with your plans.

## Start a new plan

1. Open `plan-starter.skp` and **Save as** `p-0nn-<slug>.skp` (for example `p-003-floating-night-stands.skp`).
2. Make a plan folder **outside this repo**, for example `~/Dropbox/plans/p-003-floating-night-stands/`,
   with a `views/` folder inside. GitHub Pages publishes everything in the repo, and these are
   drawings you sell.
3. Model the piece.

## Export the views

For each scene: select it, then **Download → PNG**.

- Width **3000 px** if the dialog offers a size.
- **Transparent background** if offered (it needs Sky and Ground off).
- Save into the plan's `views/` folder, named after the scene in lower case: `front.png`, `side.png`,
  `top.png`, `iso.png`, `exploded.png`, `section-a-a.png`. Re-exporting over the same name updates
  the sheet on **Reload images**, with nothing to re-link.

Shop photos go in `views/` too (`.jpg` works).

**About scale:** a PNG isn't to scale. A view's printed size depends on the sheet, not the model.
Leave the sheet's Scale at **Not to scale** and let the dimensions carry the sizes. Only write a
scale like 1:4 if you've measured the printed sheet against it.

## Lay out the sheets

1. In the site folder, run `make preview`, then open
   `http://localhost:8000/tools/plan-sheet.html` in **Chrome**. Other browsers can't open folders.
2. **Open plan folder** and choose the plan's folder. Chrome asks once for permission to edit it.
   A folder without a `plan.json` starts a new plan with a cover sheet.
3. Fill in the title block fields on any sheet. Plan number, name and so on update on every sheet.
4. **Add sheet** → Cover, Drawing, Cut list or Build step. Click a picture slot to choose an image
   from `views/`. Use the buttons above each sheet to reorder, delete, or switch between 1, 2 or 4
   views.
5. **Save** (or Cmd+S) writes `plan.json`. The images stay as separate files in `views/`.

To start from the sample instead, open
`http://localhost:8000/tools/plan-sheet.html?plan=plan-sample/p-003-floating-night-stands/` and use
**Save to folder…**. It copies the sample's plan and drawings into a folder you pick.

The status line warns when a sheet's content runs past its border (split it into two sheets), and
when an image in the plan isn't in `views/`.

## Print to PDF

**Print**, then in Chrome's print dialog:

- Destination: **Save as PDF**
- Paper size: the same as the toolbar's **Letter / A4** switch
- Margins: **None**
- Options: **Background graphics** on

You get one sheet per page. Print the plan once in each paper size if you sell both.

## Sources

- [SketchUp Free](https://help.sketchup.com/en/admin/sketchup-free): commercial use
- [SketchUp for Web features](https://help.sketchup.com/en/sketchup-web/web-features): what Free includes
- [Styles in SketchUp for Web](https://help.sketchup.com/en/styles-sketchup-web): Edit Style tab sections
- [Edge Styles](https://help.sketchup.com/en/sketchup/edge-styles): edge options
- [Importing and Exporting Image Files](https://help.sketchup.com/sketchup/importing-and-exporting-image-files): transparent PNG background
- [Plans and pricing](https://sketchup.trimble.com/en/plans-and-pricing)
