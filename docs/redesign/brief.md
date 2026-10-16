# Rumbelievable Redesign: Brainstorming Brief

Input for `/superpowers:brainstorming`. Part 1 is the design prompt. It follows the
three strategies from *Prompting for Frontend Aesthetics*: work on each design dimension
separately, name specific inspirations, and call out the defaults to avoid. Part 2 holds
structural wireframes. Part 3 lists open questions for the brainstorm to settle.

---

## Part 1: The Prompt

```xml
<project_context>
Rumbelievable is the personal portfolio of Annie Rumbles, a photographer and
woodworker. She was born in England and lives in Denver. It's a static site
(GitHub Pages) with no framework and no build step, and one shared stylesheet
(assets/css/rumbelievable.css). Content:
  - Photography: 6 albums (landscapes, mountains, reflections, night sky, wildlife,
    panoramas), shot mostly in Colorado. Masonry galleries with a lightbox.
  - Woodworking: 13 projects and counting. Each has a hero photo, a photo grid, a spec card
    (wood / finish / joinery / hardware / plan), and narrative sections. Some are
    playful ("Sapele Squatty Potty") and some carry a lot of weight (a memorial urn
    built from the lumber of the bed her grandfather was born in).
  - About and Contact (commissions enquiry form).
The voice is dry, warm, self-deprecating and British: "Things I've built — with my
hands, against my better judgment, and with varying degrees of success."
</project_context>

<frontend_aesthetics>
You tend to converge toward generic, "on distribution" outputs. In frontend design
this produces what users call the "AI slop" aesthetic. Avoid it. Design something
specific to *this* person: someone who makes things with a camera and with a saw.
The site should feel made by hand, the way the work is.

Typography: Choose fonts that are beautiful, distinctive, and fit the context.
Pair with high contrast: display + monospace, or serif + grotesk, or one variable
family pushed across extreme weights or widths. Use extremes: 200 against 800, and size
jumps of 3x or more. Load from Google Fonts. State the choice and the reasoning before
writing code.

Color & Theme: Commit to one cohesive aesthetic, defined as CSS custom properties
in :root. The brass logo color #b8924a is FIXED and stays the signature accent.
Pick one dominant field color with sharp accents rather than an evenly spread
palette. Light or dark are both acceptable. The current site is dark, so don't assume
dark is the answer.

Motion: CSS-only (vanilla JS only where CSS can't do it). Spend the motion budget
on one well-orchestrated page load with staggered reveals (animation-delay) rather
than scattered micro-interactions. Every animation has a prefers-reduced-motion
fallback.

Backgrounds: Create atmosphere and depth instead of flat solid fills. Layer CSS
gradients, inline SVG patterns or noise, or contextual textures. Photographs are
the main content: any texture must sit behind them and never compete with them.

Draw inspiration from the two crafts and the place:
  - Shop drawings and drafting: dimension lines, title blocks, hairline rules,
    drawing-sheet borders with zone references
  - Darkroom and film: contact sheets, frame numbers, edge codes, grease-pencil selects
  - Field notes: USGS topo contours, elevation and coordinate metadata, specimen labels
  - Lumberyard: mill stamps, end-grain tags, board-foot tallies
  - Museum placards and exhibition catalogues
Use these as raw material, not costume. One idea carried through rigorously beats
five used as decoration.

Avoid generic AI-generated aesthetics:
  - Overused fonts: Inter, Roboto, Arial, Open Sans, Lato, system stacks, Space
    Grotesk, Playfair Display, Fraunces. Cormorant Garamond + DM Sans (the current
    pairing) is itself a common "elegant dark portfolio" default. Keep it only if
    you can argue for it.
  - Purple or blue gradients, glassmorphism, soft drop-shadow cards with large radii
  - The template homepage of full-bleed hero, centered tagline and three equal cards
  - One Font Awesome icon on every tile
  - Hover effects that only scale(1.05)
Make unexpected choices that feel designed for this context.
</frontend_aesthetics>

<hard_constraints>
  - Vanilla HTML/CSS/JS. No Tailwind, no framework, no npm, no build step.
  - One stylesheet: assets/css/rumbelievable.css. All tokens are CSS variables.
  - JS is inline per page, wrapped in { } block scope. Scroll listeners use { passive: true }.
  - Mobile nav closes on outside click and on ESC. A single keydown listener handles
    both lightbox ESC and nav ESC.
  - Lightbox: album pages swap /c_scale,w_500/ → /c_scale,w_1400/; woodworking pages
    swap /c_scale,w_800/ → /c_scale,w_1600/. Focus moves to #lightboxClose on open
    and returns to the trigger on close.
  - Cursor styles and persistent visual state live in CSS classes, never in inline JS styles.
  - Images come from Cloudinary, with transforms in the URL.
  - Breakpoints: <900 albums 2-col · <700 mobile nav · <680 home stacks · <560 masonry 1-col
    (these may change, but must be stated explicitly).
  - tools/new_project.py generates project pages. Markup changes to the project template
    must be mirrored there.
  - No blog. No Blog nav link. /archive/ is untouched.
  - WCAG AA contrast for body text. Visible focus states. Real alt text.
</hard_constraints>

<always_use_shop_drawing_theme>
Direction A, "Shop Drawing", is chosen. The site is a set of drafting sheets and
every page is a drawing.
  - Ground: plain drafting-vellum cream #efe9dc with at most a faint paper tooth
    (noise), and no grid or pattern. Light theme only, with no dark/blueprint variant.
  - Sheet border: a thin drawing-sheet border, inset from the viewport and
    position: fixed like a passe-partout, so content scrolls beneath it and every
    screen reads as a sheet. Zone ticks run along the edges (1–8 across, A–F down),
    set in Martian Mono. The fixed nav sits inside the frame, and the border's top
    edge acts as the nav's lower rule. Below 700px it becomes a plain hairline inset
    with no zone labels. The lightbox covers the frame completely.
  - No graph paper anywhere. The drafting feel comes from the border, title
    blocks, dimension lines and type, not a background pattern.
  - Ink: graphite #22272c for text and rules, #555b61 for secondary text,
    rgba(34,39,44,.28) for hairlines.
  - Accents: brass #b8924a (logo, key rules, primary button) and cyanotype blue
    #2f5d8a (annotations, title-block lines, stamps). For small brass-coloured text
    use #7a5b22, because #b8924a fails AA on the paper.
  - Type: Archivo, using its width axis. Display is 800 weight, font-stretch 125%,
    uppercase. Body is Archivo at normal width. Martian Mono for labels, sheet
    numbers and annotations.
  - Vocabulary: title blocks (sheet no., scale NTS, drawn by), dimension lines
    (├── 6 ALBUMS ──┤), "§" section markers, double-rule stamps, registration
    marks. Each page header gets a sheet number.
  - Load moment: dimension lines and rules draw in (stroke-dashoffset or
    scaleX), then labels set in with staggered delays. Under reduced motion,
    show everything at once.
  - Photos: no mat. Each photo sits directly on the paper with a 1px graphite
    hairline and a small Martian Mono caption underneath ("FIG. 14"). Generate the
    figure numbers with a CSS counter on the masonry items, so no per-image markup is
    needed. The album or project name stays in the page header, not the caption.
</always_use_shop_drawing_theme>
```

**Decision (2026-10-15):** Direction A, Shop Drawing. The table below is kept for reference.
The mockup is at https://claude.ai/artifact/5ug3jZi1kobbfUycibtaos (Tweaks › Direction = A).

**Course correction (2026-10-16):** The literal graph-paper grid read as tacky. Keep the
drafting idea, but replace the grid with plain vellum inside a fixed drawing-sheet border
(see the theme block above). The mockup still shows the old grid. Treat the
**Background** row for A in the table below as superseded.

### Three candidate directions

These are starting positions for the brainstorm to choose from, combine, or reject.
Font names are proposals, not decisions.

| | **A · Shop Drawing** | **B · Contact Sheet** | **C · Field Notes** |
|---|---|---|---|
| **Idea** | The site is a set of drafting sheets. Each project is a drawing with a title block. | The site is a darkroom. Albums are rolls, photos are frames, favourites get grease-pencil circles. | The site is a field journal from the Front Range: topo lines, coordinates, specimen labels. |
| **Theme** | Light: drafting-paper cream, graphite ink, brass, plus a cyanotype-blue secondary | Dark: warm darkroom black, brass as the "safelight", chalk white | Light-mid: khaki/kraft paper, deep forest ink, brass |
| **Type** | Archivo (wide/narrow width axis) + Martian Mono for annotations | Gloock (display) + Azeret Mono (frame codes) + Schibsted Grotesk (body) | Newsreader italic (display, optical sizes) + Overpass / Overpass Mono (Highway Gothic lineage, road-trip signage) |
| **Background** | Faint grid paper (repeating-linear-gradient), registration marks in corners | SVG feTurbulence film grain + vignette; sprocket-hole rule as a divider | Inline-SVG topo contours at ~6% opacity, different per section |
| **Load moment** | Dimension lines draw in (stroke-dashoffset), then labels set in | Frames "develop": staggered fade from overexposed and blurred to sharp | Contours drift into place, then labels "stamp" in with a slight overshoot |
| **Spec card becomes** | Drawing title block (sheet no., scale, material, finish, drawn by) | Film-edge strip: `WALNUT ▸ 23 ▸ TRIED&TRUE ▸ 2026` | Specimen / lumber tag with a punched hole and string |
| **Risk** | Can feel cold or technical; photos may fight the grid | Leans into photography more than wood | Kitsch if the topo lines are overdone |

---

## Part 2: Wireframes

These are structural only. They show layout and hierarchy, not style, and apply to any
of the directions above. Width is ~1280px desktop unless noted. `[ ]` = image,
`▸` = interactive, `┃` = brass rule.

### W1 · Home: "The Seam" (replaces hero + 3 cards)

The two crafts sit side by side, split down the middle, with the name across the seam.

```
┌──────────────────────────────────────────────────────────────────────────┐
│ ◉ RUMBELIEVABLE                    Photography  Woodworking  About  ▸Contact│
├────────────────────────────────────┬─────────────────────────────────────┤
│                                    │                                     │
│                                    │                                     │
│      [ full-bleed panorama ]       │     [ full-bleed shop / grain ]     │
│                                    │                                     │
│                                    │                                     │
│  PHOTOGRAPHY                       │                        WOODWORKING  │
│  6 albums · Colorado & beyond      │          13 projects · since 20XX   │
│  ▸ Browse albums ────────→         │          ←──────── View projects ▸  │
│                                    │                                     │
│              R U M B E L ┃ I E V A B L E                                │
│                          ┃  (wordmark straddles the seam)               │
└────────────────────────────────────┴─────────────────────────────────────┘
  hover/focus a half → widens to ~62%, the other half dims (CSS :has())

  "There's so much to capture — may as well try."
   Denver, Colorado · Born in England · Always scheming          ▸ About me

  RECENT WORK ────────────────────────────────────────────────────────────
  No.   Title                         Kind    Material / Place        Year
  ───   ─────────────────────────     ─────   ───────────────────     ────
  013   Full Circle Memorial Urn      Wood    Tulip poplar · Walnut   2026  ▸
  012   Sapele Squatty Potty          Wood    Sapele                  2026  ▸
  011   Housewarming Cutting Board    Wood    Walnut · Maple · Cherry 2026  ▸
   —    Night Sky                     Photo   Colorado                 —    ▸
  ────────────────────────────────────────────────────────────────────────
  row hover → thumbnail floats beside the cursor (desktop only)

  ─────────────────────────── in · gh · ✉ ── © Rumbelievable 2026 ─────────
```

### W1m · Home, mobile (<680px)

```
┌──────────────────────┐
│ ◉ RUMBELIEVABLE   ☰  │
├──────────────────────┤
│ [ panorama ]         │
│ PHOTOGRAPHY        ▸ │
├──── RUMBELIEVABLE ───┤  ← wordmark sits on the seam, now horizontal
│ [ shop / grain ]     │
│ WOODWORKING        ▸ │
├──────────────────────┤
│ "So much to capture" │
│ RECENT WORK          │
│ 013 Memorial Urn   ▸ │
│ 012 Squatty Potty  ▸ │
│ 011 Cutting Board  ▸ │
└──────────────────────┘
```

### W2 · Photography landing: the album index

Asymmetric layout instead of a uniform 3×2 tile grid. Album names are set large and the
image is revealed on hover/focus.

```
┌──────────────────────────────────────────────────────────────────────────┐
│ GALLERIES                                                    6 albums     │
│ Photography                                                              │
│ Landscapes, mountains, wildlife & more — mostly Colorado.                │
├──────────────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────┐                                         │
│ │                              │   01  Landscapes ─────────────────── ▸  │
│ │   [ preview of hovered /     │   02  Mountains  ─────────────────── ▸  │
│ │     focused album — swaps    │   03  Night Sky  ─────────────────── ▸  │
│ │     with a crossfade ]       │   04  Panoramas  ─────────────────── ▸  │
│ │                              │   05  Reflections ────────────────── ▸  │
│ │   frame 03 · Night Sky       │   06  Wildlife   ─────────────────── ▸  │
│ └──────────────────────────────┘                                         │
└──────────────────────────────────────────────────────────────────────────┘
  <900px: falls back to a 2-col tile grid with names overlaid
```

### W3 · Album gallery

Masonry and the lightbox stay. Added: a metadata header and a frame counter in the lightbox.

```
┌──────────────────────────────────────────────────────────────────────────┐
│ ← All albums                                                             │
│ ALBUM 03 / 06                                                            │
│ Night Sky                                     NN frames · YYYY–YYYY      │
├──────────────────────────────────────────────────────────────────────────┤
│ [      ] [  ]   [      ]  [    ]                                         │
│ [      ] [  ]   [      ]  [    ]      masonry, 3 col → 2 → 1             │
│ [  ]     [    ] [  ]      [      ]    staggered "develop" on load        │
│ [  ]     [    ]           [      ]                                       │
├──────────────────────────────────────────────────────────────────────────┤
│ ← Reflections                                          Wildlife →        │
└──────────────────────────────────────────────────────────────────────────┘

  LIGHTBOX
  ┌────────────────────────────────────────────────────────────── ✕ ─┐
  │  ‹                    [   w_1400 image   ]                    ›  │
  │                                                                  │
  │  14 / 24                                          Night Sky      │
  └──────────────────────────────────────────────────────────────────┘
  (prev/next + counter = NEW behaviour; see open questions)
```

### W4 · Woodworking landing: the project index

The newest project is featured large, followed by the grid. Each card carries a material
tag, like a mill stamp.

```
┌──────────────────────────────────────────────────────────────────────────┐
│ CRAFT                                                     13 projects    │
│ Woodworking                                                              │
│ Things I've built — with my hands, against my better judgment…           │
├──────────────────────────────────────────────────────────────────────────┤
│ ┌───────────────────────────────────────────┐  LATEST · No. 013          │
│ │                                           │  Full Circle               │
│ │          [ featured project ]             │  Memorial Urn              │
│ │                                           │  ┌──────────────────────┐  │
│ │                                           │  │ POPLAR · WALNUT      │  │
│ └───────────────────────────────────────────┘  │ TRIED & TRUE · 2026  │  │
│                                                └──────────────────────┘  │
│                                                ▸ View project            │
├──────────────────────────────────────────────────────────────────────────┤
│ [        ]   [        ]   [        ]   [        ]                        │
│ 012 Sapele   011 Cutting  010 Nuthatch 009 Moon Fry                      │
│ ▕SAPELE▏     ▕WALNUT+2▏   ▕POPLAR▏     ▕…▏         ← mill-stamp tag      │
│ [        ]   [        ]   [        ]   [        ]                        │
│ …                                                                        │
└──────────────────────────────────────────────────────────────────────────┘
```

### W5 · Woodworking project page

The spec card moves up to become the page's title block. Narrative and photos alternate
instead of sitting as one photo dump above the text.

```
┌──────────────────────────────────────────────────────────────────────────┐
│ ← All projects                                                           │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                     [ hero photo, full width, w_1600 ]                   │
│                                                                          │
├────────────────────────────────────────────┬─────────────────────────────┤
│ Full Circle                                │ ┌─ TITLE BLOCK ───────────┐ │
│ Memorial Urn                               │ │ No.      013            │ │
│ In birth and at rest                       │ │ Wood     Poplar, walnut │ │
│                                            │ │ Finish   Tried & True   │ │
│                                            │ │ Joinery  Miters, splines│ │
│                                            │ │ Hardware Brass hinges   │ │
│                                            │ │ Plan     —              │ │
│                                            │ │ Year     2026           │ │
│                                            │ └─────────────────────────┘ │
├────────────────────────────────────────────┴─────────────────────────────┤
│   ABOUT THIS PROJECT                                                     │
│   ¶ narrative, ~65ch measure                                             │
│   ¶ …                                                                    │
│                                                                          │
│   [ photo ]  [ photo ]  [ photo ]       ← grid interleaved with text     │
│                                                                          │
│   ┃ "he was born with this wood, and now he will be laid to rest with   │
│   ┃  it."                                  ← optional pull quote         │
│                                                                          │
│   ¶ …                                                                    │
│   FAVOURITE PART · LESSONS LEARNED (when present)                        │
│   [ photo ]  [ photo ]  [ photo ]  [ photo ]                             │
├──────────────────────────────────────────────────────────────────────────┤
│ ← 012 Sapele Squatty Potty                    014 (coming soon) / — →    │
└──────────────────────────────────────────────────────────────────────────┘
  <900px: title block drops below the title, full width
```

### W6 · Contact

```
┌──────────────────────────────────────────────────────────────────────────┐
│ GET IN TOUCH                                                             │
│ Let's talk                                                               │
├───────────────────────────────┬──────────────────────────────────────────┤
│ Commissions, prints, or just  │  Name   ______________________________   │
│ to say hello.                 │  Email  ______________________________   │
│                               │  Type   [ Commission ▾ ]                 │
│ What I take on:               │  Message                                 │
│ · Furniture & small pieces    │  ____________________________________    │
│ · Print sales                 │  ____________________________________    │
│ · Photo licensing             │                                          │
│                               │  ▸ Send                                  │
│ in · gh · ✉                   │  I'll do my best to respond within a     │
│                               │  few days.                               │
└───────────────────────────────┴──────────────────────────────────────────┘
```

---

## Part 3: Open questions for the brainstorm

1. ~~**Direction:**~~ Decided: A, Shop Drawing.
Questions 2, 2b and 3 have leanings from a quick pass on 2026-10-16. They are not locked.
Confirm or reopen them in the brainstorm.

2. **Light or dark:** A is a light theme. Drop dark entirely, or offer a "blueprint"
   dark variant (cyanotype ground, white linework) behind a toggle?
   *Leaning: light only. Everything is a token, so dark can be added later.*
2b. **Photos in A:** What should the mat around photos be: paper, graphite, or
   white with a hairline?
   *Leaning: no mat. 1px hairline + mono "FIG. nn" caption from a CSS counter. The grid
   question no longer applies because there is no grid.*
2c. **Sheet border:** *Leaning: fixed to the viewport (passe-partout) rather than
   one tall scrolling sheet or one sheet per section. Hairline only below 700px.*
   Still open: zone count and spacing; how the border meets the fixed nav at each
   breakpoint; whether registration marks sit at the border corners.
3. **Homepage:** Is "The Seam" right, or too clever? Does the Recent Work ledger need
   upkeep beyond `make project`?
   *Leaning: keep the Seam and the ledger. `tools/new_project.py` (which already
   patches `woodworking.html`) would also insert a row at the top of the `index.html`
   ledger and trim it to about 5 rows. Albums stay out of the ledger.*
4. **Lightbox scope:** Add prev/next and a counter (new behaviour, touches all 19
   lightbox pages), or keep the current open/close only?
5. **Project numbering:** Assign each project a "No. 0xx"? This would need a new field
   in `tools/new_project.py`.
6. **Rollout:** Change the stylesheet first (all pages update at once), then markup page
   by page? Or build one prototype page per type (home, album, project) and sign off
   before touching the other ~20 pages?
7. **Prototype before production:** Build throwaway HTML mockups of the chosen direction
   in a scratch folder before editing real pages?
8. **About page:** It isn't wireframed. Keep the two-column bio or rethink it?
