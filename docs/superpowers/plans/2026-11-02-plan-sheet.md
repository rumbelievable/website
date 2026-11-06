# Plan Sheet Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A browser editor and print template (`tools/plan-sheet.html`) that lays out SketchUp Free exports on Shop Drawing sheets (cover, drawing, cut list, build step) and saves each plan as a folder with `plan.json`, plus a one-time SketchUp Free setup guide.

**Architecture:** One self-contained dev page with inline `<style>` and `<script>`. The script keeps the plan as a plain object, renders every sheet from it, and exposes its functions on `window.PlanSheet` so a test page (`tools/plan-sheet.test.html`) can drive it in an iframe under headless Chrome. Folder I/O goes through the File System Access API behind one function that takes a directory handle, so tests pass a fake handle.

**Tech Stack:** Static HTML/CSS, inline vanilla JS (ES2022), File System Access API (Chrome), Google Fonts, headless Chrome for tests. No dependencies.

**Spec:** `docs/superpowers/specs/2026-11-02-plan-sheet-design.md`

## Global Constraints

- Branch `feature/plan-sheet`. Never commit to `main`; never push or merge without Annie's explicit go-ahead.
- No build step, no dependencies, no package manager. Nothing outside `tools/`, `docs/` changes. `/archive/` untouched. No site page, nav link or generator change.
- `tools/plan-sheet.html` does **not** link `rumbelievable.css`. Tokens copied verbatim: `--paper: #efe9dc; --paper-2: #e6dfd0; --ink: #22272c; --ink-2: #555b61; --hairline: rgba(34, 39, 44, 0.28); --brass: #b8924a; --brass-text: #7a5b22; --cyan: #2f5d8a;` and the font stacks `'Archivo', 'Helvetica Neue', Arial, sans-serif` / `'Martian Mono', ui-monospace, Menlo, monospace`.
- Head: `<meta name="robots" content="noindex">`, title `Plan Sheet — Rumbelievable`, font URL exactly `https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900&family=Martian+Mono:wght@400;600&display=swap`.
- Script wrapped in `{ }`; the only global it creates is `window.PlanSheet`. One `keydown` listener.
- Sheet size: Letter `11in × 8.5in`, A4 `297mm × 210mm`, both landscape, `@page { margin: 0 }`.
- `--brass` never colours text; on a sheet it appears only as the 3pt rule above the title block's sheet-number cell. `--brass-text` is not used on sheets.
- Nothing printed below 8pt except zone labels (7pt).
- No browser dialogs (`alert`, `confirm`, `prompt`): confirmations go through the status line.
- `plan.json` schema `version: 1` as in the spec. Sheet numbers, totals, part letters and step numbers are derived, never written to `plan.json`. Unknown keys survive a save.
- Shell rules (Annie's CLAUDE.md): no `&&`/`||`/`;` chaining; run `make preview` in the background.

## Review Focus

1. **Typed or pasted text with quotes, `×`, `¾`, line breaks or rich formatting** (e.g. `3/4" × 10`, pasted from Notes): fields are `plaintext-only`, Enter in a single-line field doesn't insert a newline, and the text round-trips through Save exactly. *Pinned by `edit: pasted text round-trips` in Task 4.*
2. **Image filenames with spaces, capitals or upper-case extensions** (`Front View.PNG`) in `views/`: listed in the picker, shown, saved as `views/Front View.PNG`. *Pinned by `folder: odd filenames` in Task 5.*
3. **A plan with zero sheets** (all deleted, or a hand-written `"sheets": []`): the desk shows "No sheets yet. Add one from the toolbar.", numbering doesn't throw, Save writes `"sheets": []`. *Pinned by `model: empty plan` in Task 1 and `edit: delete last sheet` in Task 4.*
4. **More than 26 parts** across cut-list sheets: letters go `Z`, `AA`, `AB`. *Pinned by `model: part letters past Z` in Task 1.*
5. **Switching Letter → A4** with a sheet that fits Letter but not A4 (A4 is 0.23in shorter): the overflow warning appears after the switch. *Pinned by `edit: A4 switch re-checks overflow` in Task 4.*

---

## Test harness (used by every task)

`tools/plan-sheet.test.html` is a dev page with a ~40-line runner: `test(name, async fn)`, `eq(actual, expected, msg)` (deep-equal via `JSON.stringify`), `ok(cond, msg)`, and `load(query) → Promise<{win, doc, PS}>`, which creates a `1400 × 1000` iframe on `plan-sheet.html` + `query`, waits for `PS.ready` (a Promise the editor resolves after first render), and returns its window, document and `window.PlanSheet`. Tests run in order; results go into `<pre id="results">`, one line each; `document.title` becomes `PASS 14` or `FAIL 2 / 14`.

Run (server already in the background via `make preview`):

```
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --virtual-time-budget=20000 --dump-dom "http://localhost:8000/tools/plan-sheet.test.html" | grep -E "<title>|FAIL"
```

Passing looks like `<title>PASS n</title>` and no `FAIL` lines. A test can be run alone with `plan-sheet.test.html?only=<substring of name>`.

---

### Task 1: Page skeleton, plan model and test harness

**Files:**
- Create: `tools/plan-sheet.html` (shell, tokens, toolbar markup, empty `#desk`, script with the model functions)
- Create: `tools/plan-sheet.test.html`
- Modify: `docs/superpowers/specs/2026-11-02-plan-sheet-design.md` — Testing section's first line becomes "No JS test infrastructure existed; this adds one dev page, `tools/plan-sheet.test.html`, run in headless Chrome." (Annie approves this deviation at plan review.)

**Interfaces:**
- Produces on `window.PlanSheet`:
  - `parsePlan(text: string) → {ok: true, plan} | {ok: false, error: string}`. Errors: `"plan.json line N: <message>"` for bad JSON (line computed from V8's `position N` or `line N column M` message), `"plan.json is version X; this editor reads version 1"` for a wrong/missing version, `"plan.json has no sheets list"` if `sheets` isn't an array.
  - `serializePlan(plan) → string`: `JSON.stringify(plan, null, 2) + "\n"`.
  - `newPlan() → plan`: `version 1`, `plan: {no:"", name:"", drawn:"A.R.", units:"Inches", rev:"A", date:<today YYYY-MM-DD>, built:"", paper:"letter"}`, `sheets: [newSheet("cover")]`.
  - `newSheet(layout: "cover"|"drawing"|"cutlist"|"step") → sheet` with the spec's keys, empty strings/lists, `drawing.slots: 1`, `step.images: [{src:"",caption:""}]`, `step.callout: {kind:"tip", text:""}`, `cutlist.parts: [<one empty part>]`, titles `"Cover"`, `"Drawing"`, `"Cut list"`, `"Build step"`, scale `"Not to scale"` except cutlist `""`.
  - `sheetNo(i: number) → "S-01"`; `partLetter(n: number) → "A"…"Z","AA","AB"…` (0-based, spreadsheet-column style).
  - `numberPlan(plan) → Array<{sheetNo, n, total, firstPart: number|null, stepNo: number|null}>`, one per sheet: `n` is 1-based, `firstPart` is the 0-based running part index for cutlist sheets, `stepNo` is the 1-based count of step sheets.
  - `getPath(obj, "sheets.2.parts.0.qty")`, `setPath(obj, path, value)`.
  - `moveItem(arr, i, dir: -1|1)`, `removeItem(arr, i)`, `insertItem(arr, i, item)`: in place, no-ops at the ends.
  - `ready: Promise<void>`.

- [ ] **Step 1: Write the runner and failing model tests** in `tools/plan-sheet.test.html`:

```js
test('model: sheet numbers', async () => { const {PS} = await load('');
  eq([0, 8, 99].map(PS.sheetNo), ['S-01', 'S-09', 'S-100']); });
test('model: part letters past Z', async () => { const {PS} = await load('');
  eq([0, 25, 26, 27, 51, 52].map(PS.partLetter), ['A', 'Z', 'AA', 'AB', 'AZ', 'BA']); });
test('model: numbering across cut lists and steps', async () => { const {PS} = await load('');
  const p = PS.newPlan(); p.sheets = ['cover','cutlist','step','cutlist','step'].map(PS.newSheet);
  p.sheets[1].parts = [{}, {}, {}];
  const n = PS.numberPlan(p);
  eq(n.map(s => s.sheetNo), ['S-01','S-02','S-03','S-04','S-05']);
  eq(n.map(s => s.total), [5,5,5,5,5]);
  eq(n.map(s => s.firstPart), [null, 0, null, 3, null]);
  eq(n.map(s => s.stepNo), [null, null, 1, null, 2]); });
test('model: empty plan', async () => { const {PS} = await load('');
  const p = PS.newPlan(); p.sheets = [];
  eq(PS.numberPlan(p), []);
  ok(PS.serializePlan(p).includes('"sheets": []')); });
test('model: parse errors', async () => { const {PS} = await load('');
  eq(PS.parsePlan('{\n"version": 1,\n}').error.startsWith('plan.json line 3'), true);
  eq(PS.parsePlan('{"version": 2, "sheets": []}').error, 'plan.json is version 2; this editor reads version 1');
  eq(PS.parsePlan('{"version": 1}').error, 'plan.json has no sheets list'); });
test('model: unknown keys survive', async () => { const {PS} = await load('');
  const text = '{"version":1,"plan":{"no":"P-1","x":1},"sheets":[{"layout":"cover","y":[2]}],"z":true}';
  eq(JSON.parse(PS.serializePlan(PS.parsePlan(text).plan)), JSON.parse(text)); });
test('model: paths and list ops', async () => { const {PS} = await load('');
  const o = {sheets: [{parts: [{qty: '1'}]}]};
  PS.setPath(o, 'sheets.0.parts.0.qty', '4'); eq(PS.getPath(o, 'sheets.0.parts.0.qty'), '4');
  const a = [1, 2, 3]; PS.moveItem(a, 0, -1); eq(a, [1,2,3]); PS.moveItem(a, 0, 1); eq(a, [2,1,3]);
  PS.removeItem(a, 1); eq(a, [2,3]); PS.insertItem(a, 1, 9); eq(a, [2,9,3]); });
```

- [ ] **Step 2: Run the harness command.** Expected: `FAIL 7 / 7` (plan-sheet.html missing).
- [ ] **Step 3: Create `tools/plan-sheet.html`** with the head from Global Constraints, the token block, a sticky `<header class="toolbar">` holding buttons `Open plan folder`, `Save`, `Reload images`, a `Letter`/`A4` segmented pair, `Add sheet` (a `<details>` menu with the four layouts), `Print`, and `<p class="status" role="status">`; then `<main id="desk">`. Implement the Interfaces functions; `ready` resolves after the (still empty) first render.
- [ ] **Step 4: Run the harness.** Expected: `PASS 7`.
- [ ] **Step 5: Apply the spec edit, then commit.**

```bash
git add tools/plan-sheet.html tools/plan-sheet.test.html docs/superpowers/specs/2026-11-02-plan-sheet-design.md
git commit -m "Plan sheet: page skeleton, plan model and test page"
```

---

### Task 2: Sheet frame, title block, cover and drawing layouts, sample plan, print

**Files:**
- Modify: `tools/plan-sheet.html`
- Create: `tools/plan-sample/p-003-floating-night-stands/plan.json` (cover + two drawing sheets for now: slots 2 and 4)
- Create: `tools/plan-sample/p-003-floating-night-stands/views/front.svg`, `section-a-a.svg`, `iso.svg`, `exploded.svg` — from the mockup's SVGs (`git show mockups/plan-package:mockups/plan-package/v2-r1.html`): the elevation and section halves of the § 2 drawing, the S-01 cover view as iso, the S-06 exploded view. Each standalone with its CSS classes inlined as attributes (`stroke`, `fill`) since the editor's styles don't reach into `<img>`.
- Test: `tools/plan-sheet.test.html`

**Interfaces:**
- Consumes: Task 1 model functions.
- Produces on `window.PlanSheet`:
  - `state: {plan, mode: "empty"|"http"|"folder", base: string, dir: FileSystemDirectoryHandle|null, images: Map<string, string|null>, dirty: boolean}` (`images` maps a `src` to a displayable URL, or `null` when missing).
  - `load(plan, {mode, base, dir})` → sets state, resolves images, renders. `?plan=<path>` calls it with `mode: "http"` after `fetch(path + "plan.json")`; images resolve to `base + src` and are checked with `fetch(url, {method: "HEAD"})`.
  - `render()` → rebuilds `#desk` from `state.plan`.
  - `setPaper("letter"|"a4")` → sets `state.plan.paper`, `document.body.dataset.paper`, rewrites `<style id="page-size">` to `@page { size: letter landscape; margin: 0 }` / `@page { size: A4 landscape; margin: 0 }`, re-renders, marks dirty.
- DOM produced (later tasks and tests rely on these): each sheet is `<article class="sheet-page" data-i="N" data-layout="…">` containing `.sheet-zones` (top, bottom, left, right), `.sheet-body`, and `<aside class="tb">`. Editable text nodes carry `data-bind="<path>"` (`plan.name`, `sheets.N.title`, `sheets.N.views.M.caption`, `sheets.N.notes.M`…). Derived text: `.tb-sheet` ("03 / 07"), `.tb-no` (plan no), `.sheet-index li` on the cover. Image slots: `<figure class="slot" data-path="sheets.N.views.M">` with `<img>` or, when missing, `<div class="slot-missing">views/front.png not found</div>`; an empty `src` shows `<div class="slot-missing">No image</div>`.

Layout values from the spec: border 1.5px ink inset `0.4in`; zone labels 1–8 top and bottom, A–F both sides, Martian Mono 7pt `--ink-2`, centred in the 0.4in margin; `.sheet-body` padding `0.3in`; title block `3.4in` wide pinned bottom-right against the border, rows as the spec lists (head Plan · Drawn; sheet title Archivo 800 125% uppercase; plan name; Sheet · Scale, Scale hidden when empty; Units · Rev · Date), cyan hairlines `rgba(47, 93, 138, 0.4)`, 3pt `--brass` rule above `.tb-sheet`. Cover: eyebrow `PLAN SET {no}`, name, hero `slot` (`sheets.N.image`), `.sheet-index` (`S-01 · Cover` per sheet), numbered notes, `Built: {plan.built}` (hidden when empty). Drawing: `.slots-1|2|4` grid, captions Martian Mono uppercase 600 ink, numbered notes strip left of the title block, hidden when empty. Screen: `#desk` background `--paper`, sheets white with a soft shadow, `gap: 0.5in`. Print: toolbar, `.sheet-controls`, `.item-controls` hidden; sheets `break-after: page`; no desk background or shadow.

- [ ] **Step 1: Write failing tests:**

```js
const SAMPLE = '?plan=plan-sample/p-003-floating-night-stands/';
test('render: sample sheets and title blocks', async () => { const {doc} = await load(SAMPLE);
  const pages = [...doc.querySelectorAll('.sheet-page')];
  eq(pages.length, 3);
  eq(pages.map(p => p.querySelector('.tb-sheet').textContent), ['01 / 03', '02 / 03', '03 / 03']);
  eq(pages[0].querySelector('.tb-no').textContent, 'P-003'); });
test('render: cover index lists every sheet', async () => { const {doc, PS} = await load(SAMPLE);
  eq([...doc.querySelectorAll('.sheet-index li')].map(li => li.textContent),
     PS.state.plan.sheets.map((s, i) => `${PS.sheetNo(i)} · ${s.title}`)); });
test('render: drawing slots', async () => { const {doc} = await load(SAMPLE);
  eq(doc.querySelectorAll('[data-i="1"] .slot').length, 2);
  eq(doc.querySelectorAll('[data-i="2"] .slot').length, 4); });
test('render: missing image placeholder', async () => { const {doc, PS} = await load(SAMPLE);
  PS.state.plan.sheets[1].views[0].src = 'views/nope.png'; await PS.load(PS.state.plan, {mode: 'http', base: PS.state.base});
  eq(doc.querySelector('[data-i="1"] .slot-missing').textContent, 'views/nope.png not found'); });
test('render: paper sizes', async () => { const {doc, PS} = await load(SAMPLE);
  const r = () => doc.querySelector('.sheet-page').getBoundingClientRect();
  eq([Math.round(r().width), Math.round(r().height)], [1056, 816]);
  PS.setPaper('a4'); eq([Math.round(r().width), Math.round(r().height)], [1123, 794]);
  ok(doc.getElementById('page-size').textContent.includes('A4 landscape')); });
```

- [ ] **Step 2: Run the harness.** Expected: the 5 new tests FAIL.
- [ ] **Step 3: Write the sample `plan.json` and the four SVG views**, then implement `state`, `load`, `render`, `setPaper`, the `?plan=` boot path, the frame/title block/cover/drawing renderers and the screen + print CSS above.
- [ ] **Step 4: Run the harness.** Expected: `PASS 12`.
- [ ] **Step 5: Print check.** Run `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=10000 --print-to-pdf=<scratchpad>/letter.pdf "http://localhost:8000/tools/plan-sheet.html?plan=plan-sample/p-003-floating-night-stands/"`, then `mdls -name kMDItemNumberOfPages -name kMDItemPageWidth -name kMDItemPageHeight <scratchpad>/letter.pdf`. Expected: 3 pages, 792 × 612 pt. Read the PDF and look at it: no toolbar, border and title block inside the page.
- [ ] **Step 6: Commit.**

```bash
git add tools/plan-sheet.html tools/plan-sheet.test.html tools/plan-sample
git commit -m "Plan sheet: frame, title block, cover and drawing sheets, sample plan"
```

---

### Task 3: Cut list and build step layouts

**Files:**
- Modify: `tools/plan-sheet.html`
- Modify: `tools/plan-sample/p-003-floating-night-stands/plan.json` — append a cut-list sheet with the mockup's 8 parts (Top … French cleat, materials and hardware from the mockup/spec examples), a second cut-list sheet with 2 parts (`Drawer pull block`, `Cleat shim`), and a build step `Fitting the undermount slides` with the mockup's 4 instructions, parts `D, E, F`, one image (`views/section-a-a.svg`) and a tip. Final sample: 6 sheets.
- Test: `tools/plan-sheet.test.html`

**Interfaces:**
- Consumes: Task 2 `render`, DOM conventions, `numberPlan`.
- Produces: cut list `<table class="parts">` with header `Part · Name · Qty · T × W × L · Material · Notes`; row `td.part-letter` derived; editable cells bound to `sheets.N.parts.M.name|qty|t|w|l|material|notes`; T × W × L shows three bound spans joined by ` × `. `.materials` and `.hardware` lists bound to `sheets.N.materials.M` / `.hardware.M`. Step: eyebrow `.step-no` (`STEP 03`), `.steps li` bound to `sheets.N.steps.M`, `.step-parts` (`Parts: D, E, F`, hidden when empty), `.callout[data-kind="tip"|"caution"]` with label `TIP`/`CAUTION` and a 3px `--cyan` left rule, hidden when text empty; `step.images` render as 1 or 2 `slot`s.

- [ ] **Step 1: Write failing tests:**

```js
test('cutlist: letters continue across sheets', async () => { const {doc} = await load(SAMPLE);
  const letters = i => [...doc.querySelectorAll(`[data-i="${i}"] .part-letter`)].map(td => td.textContent);
  eq(letters(3), ['A','B','C','D','E','F','G','H']); eq(letters(4), ['I','J']); });
test('step: number, parts and callout', async () => { const {doc, PS} = await load(SAMPLE);
  const s = doc.querySelector('[data-i="5"]');
  eq(s.querySelector('.step-no').textContent, 'STEP 01');
  eq(s.querySelector('.step-parts').textContent, 'Parts: D, E, F');
  eq(s.querySelector('.callout').dataset.kind, 'tip');
  eq(s.querySelectorAll('.steps li').length, 4);
  PS.state.plan.sheets[5].callout.text = ''; PS.render();
  ok(doc.querySelector('[data-i="5"] .callout') === null || doc.querySelector('[data-i="5"] .callout').hidden); });
```

- [ ] **Step 2: Run the harness.** Expected: the 2 new tests FAIL. Update Task 2's `render: sample sheets` expectation to 6 sheets (`01 / 06` …).
- [ ] **Step 3: Implement the two renderers and their CSS** (table header cyan Martian Mono, hairline row rules; materials/hardware as two columns), and extend the sample.
- [ ] **Step 4: Run the harness.** Expected: `PASS 14`. Re-run Task 2's print check: 6 pages.
- [ ] **Step 5: Commit** (`git add tools/plan-sheet.html tools/plan-sheet.test.html tools/plan-sample`, message `Plan sheet: cut list and build step sheets`).

---

### Task 4: Editing — text, lists, sheet controls, overflow, status line

**Files:**
- Modify: `tools/plan-sheet.html`
- Test: `tools/plan-sheet.test.html`

**Interfaces:**
- Consumes: Tasks 1–3.
- Produces on `window.PlanSheet`:
  - `addSheet(layout)` (appends, scrolls it into view), `moveSheet(i, dir)`, `deleteSheet(i)`, `setSlots(i, n)` (drawing 1|2|4, step 1|2; pads `views`/`images` with `{src:"",caption:""}` and never truncates them).
  - `listAction(path: string, action: "add"|"remove"|"up"|"down", i: number)` for `sheets.N.notes|steps|materials|hardware|parts|views`.
  - `checkOverflow() → number[]` (sheet indices whose `.sheet-body` has `scrollHeight > clientHeight + 1` or `scrollWidth > clientWidth + 1`); sets `.is-overflowing` on those sheets.
  - `setStatus(text, kind: "info"|"warn"|"error")`.
  - every structural change and every `input` on a `[data-bind]` sets `state.dirty = true`.
- Behaviour:
  - Text fields are `contenteditable="plaintext-only"`. On `input`, `setPath(state.plan, el.dataset.bind, el.textContent)`, then update every other element with the same `data-bind` (e.g. `plan.name` on every title block) without touching the focused one; derived numbers update in place. No full re-render while typing.
  - Single-line fields (everything except `notes`/`steps` items) handle Enter in the one `keydown` listener: prevent default and blur. Notes/steps: Enter adds a new item after the current one and focuses it.
  - Each sheet gets `.sheet-controls` in the desk gap above it: layout name, `↑` `↓` `✕` buttons (`aria-label="Move sheet up"` etc.), a slot switch on drawing and step sheets. Each list item gets `.item-controls`: `+ ↑ ↓ ✕` with labels (`Add note after this`, …). Empty lists show a single `+ Add note` (etc.) button.
  - After every render, `setPaper` and every `input`, call `checkOverflow()`. Status line priority: errors > `Sheet S-04: content runs past the sheet. Split it.` (one line listing all overflowing sheet numbers) > `N images missing` > `Unsaved changes` > folder name. Overflowing sheets also show the same message in their `.sheet-controls`.
  - Zero sheets: `#desk` shows `<p class="desk-empty">No sheets yet. Add one from the toolbar.</p>`.
  - `beforeunload` prevents leaving while `state.dirty`.

- [ ] **Step 1: Write failing tests:**

```js
test('edit: typing updates model and every bound copy', async () => { const {doc, PS} = await load(SAMPLE);
  const el = doc.querySelector('[data-i="1"] [data-bind="plan.name"]');
  el.focus(); el.textContent = 'Night Stand'; el.dispatchEvent(new Event('input', {bubbles: true}));
  eq(PS.state.plan.plan.name, 'Night Stand');
  eq([...doc.querySelectorAll('[data-bind="plan.name"]')].every(e => e.textContent === 'Night Stand'), true);
  eq(PS.state.dirty, true); });
test('edit: pasted text round-trips', async () => { const {doc, PS} = await load(SAMPLE);
  const el = doc.querySelector('[data-bind="sheets.3.parts.0.notes"]');
  el.textContent = '3/4" × 10 — ¾ "quoted"'; el.dispatchEvent(new Event('input', {bubbles: true}));
  eq(PS.parsePlan(PS.serializePlan(PS.state.plan)).plan.sheets[3].parts[0].notes, '3/4" × 10 — ¾ "quoted"');
  eq(el.getAttribute('contenteditable'), 'plaintext-only'); });
test('edit: Enter in a title does not add a newline', async () => { const {doc, win} = await load(SAMPLE);
  const el = doc.querySelector('[data-bind="sheets.1.title"]'); el.focus();
  const ev = new win.KeyboardEvent('keydown', {key: 'Enter', bubbles: true, cancelable: true});
  el.dispatchEvent(ev); eq(ev.defaultPrevented, true); });
test('edit: add, move and delete sheets renumber', async () => { const {doc, PS} = await load(SAMPLE);
  PS.addSheet('drawing'); eq(doc.querySelectorAll('.sheet-page').length, 7);
  eq(doc.querySelector('[data-i="6"] .tb-sheet').textContent, '07 / 07');
  PS.moveSheet(6, -1); eq(PS.state.plan.sheets[5].layout, 'drawing');
  eq(doc.querySelector('.sheet-index li:nth-child(6)').textContent, 'S-06 · Drawing');
  PS.deleteSheet(5); eq(doc.querySelector('[data-i="0"] .tb-sheet').textContent, '01 / 06'); });
test('edit: slot switch keeps views', async () => { const {doc, PS} = await load(SAMPLE);
  PS.setSlots(2, 1); eq(doc.querySelectorAll('[data-i="2"] .slot').length, 1);
  eq(PS.state.plan.sheets[2].views.length, 4); PS.setSlots(2, 4);
  eq(doc.querySelectorAll('[data-i="2"] .slot').length, 4); });
test('edit: list actions and part letters', async () => { const {doc, PS} = await load(SAMPLE);
  PS.listAction('sheets.3.parts', 'remove', 0);
  eq(doc.querySelector('[data-i="3"] .part-letter').textContent, 'A');
  eq(doc.querySelector('[data-i="4"] .part-letter').textContent, 'H'); });
test('edit: delete last sheet', async () => { const {doc, PS} = await load(SAMPLE);
  while (PS.state.plan.sheets.length) PS.deleteSheet(0);
  ok(doc.querySelector('.desk-empty')); ok(PS.serializePlan(PS.state.plan).includes('"sheets": []')); });
test('edit: overflow warning', async () => { const {doc, PS} = await load(SAMPLE);
  for (let i = 0; i < 30; i++) PS.listAction('sheets.4.parts', 'add', 0);
  eq(PS.checkOverflow(), [4]);
  ok(doc.querySelector('.status').textContent.includes('Sheet S-05: content runs past the sheet')); });
test('edit: A4 switch re-checks overflow', async () => { const {PS} = await load(SAMPLE);
  // Fill sheet 4 until it just fits Letter, then switch.
  let n = 0; while (PS.checkOverflow().length === 0 && n < 60) { PS.listAction('sheets.4.parts', 'add', 0); n++; }
  PS.listAction('sheets.4.parts', 'remove', 0); eq(PS.checkOverflow(), []);
  PS.setPaper('a4'); eq(PS.checkOverflow(), [4]); });
```

The A4 test assumes one cut-list row is shorter than the 0.23in A4 shortfall. If rows are taller in the final CSS, the test adds a step note instead of a part; adjust the filler, never the assertion.

- [ ] **Step 2: Run the harness.** Expected: the 9 new tests FAIL.
- [ ] **Step 3: Implement** the Interfaces and Behaviour above.
- [ ] **Step 4: Run the harness.** Expected: `PASS 23`.
- [ ] **Step 5: Commit** (`Plan sheet: editing, sheet controls and overflow warnings`).

---

### Task 5: Folders — open, new plan, save, images, picker

**Files:**
- Modify: `tools/plan-sheet.html`
- Test: `tools/plan-sheet.test.html` (adds `fakeDir(files: Record<string, string|Blob>) → handle`: a directory handle with `kind`, `name`, `values()`, `getFileHandle(name, {create})`, `getDirectoryHandle(name, {create})`, `queryPermission/requestPermission → "granted"`; file handles with `getFile()` and `createWritable() → {write, close}`, writes landing back in the `files` record so tests can read them; nested paths like `views/front.png` become a subdirectory. A `failWrites` flag makes `createWritable` reject.)

**Interfaces:**
- Consumes: Tasks 1–4.
- Produces on `window.PlanSheet`:
  - `openFolder(dir) → Promise<void>`: reads `plan.json`; if missing, loads `newPlan()` with status `New plan: nothing saved yet`; if invalid, status shows the `parsePlan` error, nothing loads, Save disabled. Lists `views/` files whose lowercased extension is `.png .jpg .jpeg .svg` and maps `views/<name>` → object URL (revoking old ones). Sets `mode: "folder"`, `dirty: false`.
  - `save() → Promise<boolean>`: folder mode writes `serializePlan` to `plan.json` (creating `views/` if missing), clears dirty, status `Saved {time}`; on failure status `Couldn't save: {message}. Your changes are still here.`, keeps dirty, returns false. In `http` mode the Save button reads `Save to folder…`: picks a directory, writes `plan.json`, copies each referenced image fetched from `base + src` into `views/`, then switches to folder mode on that directory.
  - `reloadImages()` re-lists `views/` and re-renders.
  - `pickImage(path: string) → Promise<void>`: opens `.picker` (a `<div role="listbox">` anchored to the slot) listing `views/` filenames sorted case-insensitively plus `None`; choosing sets `<path>.src` to `views/<name>` or `""`. In http mode the picker shows `Open a plan folder to choose images`. Escape (in the one keydown listener) closes it.
  - Toolbar: `Open plan folder` calls `showDirectoryPicker({mode: "readwrite"})` then `openFolder`; if `state.dirty`, the first click only sets status `Unsaved changes. Click Open again to discard them.` and a second click within the same status proceeds. `Cmd/Ctrl+S` calls `save()` with default prevented. No `showDirectoryPicker` → status `This browser can't open folders. Use Chrome.` and the button is disabled.

- [ ] **Step 1: Write failing tests:**

```js
const planText = async () => (await fetch('plan-sample/p-003-floating-night-stands/plan.json')).text();
test('folder: open and save round-trip', async () => { const {PS} = await load('');
  const files = {'plan.json': await planText(), 'views/front.svg': new Blob(['<svg/>'], {type: 'image/svg+xml'})};
  await PS.openFolder(fakeDir(files));
  eq(PS.state.mode, 'folder'); eq(PS.state.images.get('views/front.svg') !== null, true);
  PS.state.plan.plan.rev = 'B'; PS.state.dirty = true;
  eq(await PS.save(), true); eq(JSON.parse(files['plan.json']).plan.rev, 'B'); eq(PS.state.dirty, false); });
test('folder: missing plan.json starts a new plan', async () => { const {doc, PS} = await load('');
  const files = {}; await PS.openFolder(fakeDir(files));
  eq(PS.state.plan.sheets.map(s => s.layout), ['cover']);
  ok(doc.querySelector('.status').textContent.includes('New plan'));
  await PS.save(); ok('plan.json' in files); });
test('folder: invalid plan.json is never overwritten', async () => { const {doc, PS} = await load('');
  const files = {'plan.json': '{"version": 1,,}'}; await PS.openFolder(fakeDir(files));
  ok(doc.querySelector('.status').textContent.startsWith('plan.json line 1'));
  eq(await PS.save(), false); eq(files['plan.json'], '{"version": 1,,}'); });
test('folder: odd filenames', async () => { const {doc, PS} = await load('');
  const files = {'plan.json': await planText(), 'views/Front View.PNG': new Blob(['x']), 'views/notes.txt': 'x'};
  await PS.openFolder(fakeDir(files)); await PS.pickImage('sheets.1.views.0');
  const opts = [...doc.querySelectorAll('.picker [role="option"]')].map(o => o.textContent);
  ok(opts.includes('Front View.PNG')); ok(!opts.includes('notes.txt'));
  doc.querySelector('.picker [role="option"]').click();
  eq(PS.state.plan.sheets[1].views[0].src, 'views/Front View.PNG'); });
test('folder: save failure keeps changes', async () => { const {doc, PS} = await load('');
  const files = {'plan.json': await planText()}; const dir = fakeDir(files);
  await PS.openFolder(dir); PS.state.dirty = true; dir.failWrites = true;
  eq(await PS.save(), false); eq(PS.state.dirty, true);
  ok(doc.querySelector('.status').textContent.startsWith("Couldn't save")); });
test('folder: missing image count', async () => { const {doc, PS} = await load('');
  await PS.openFolder(fakeDir({'plan.json': await planText()}));
  ok(/\d+ images missing/.test(doc.querySelector('.status').textContent)); });
```

- [ ] **Step 2: Run the harness.** Expected: the 6 new tests FAIL.
- [ ] **Step 3: Implement** the Interfaces above.
- [ ] **Step 4: Run the harness.** Expected: `PASS 29`.
- [ ] **Step 5: Commit** (`Plan sheet: open and save plan folders, image picker`).

---

### Task 6: SketchUp Free starter guide

**Files:**
- Create: `docs/plans/sketchup-starter.md`

**Interfaces:**
- Consumes: the folder layout and `views/<scene>.png` names from the spec; the print settings from Task 2.

- [ ] **Step 1: Check SketchUp Free's current UI.** WebFetch SketchUp's help pages (help.sketchup.com) for SketchUp for Web: Model Info → Units, the Styles panel (edge settings, face style, background), Camera → Parallel Projection, Tags, Scenes (which properties a scene saves), Section Plane fill, dimension text/colour settings, and Download → PNG options (size, transparent background). Note any setting Free doesn't offer.
- [ ] **Step 2: Write the guide.** Sections: *Set up the starter model once* (units, style, camera, tags, scenes, dimensions, save as `plan-starter.skp`), *Start a new plan* (Save as, make the folder `p-0nn-<slug>/` outside the repo with a `views/` folder), *Export the views* (per scene, PNG 3000 px wide, transparent background, `views/front.png`, `side.png`, `top.png`, `iso.png`, `exploded.png`, `section-a-a.png`), *Lay out the sheets* (`make preview`, open `localhost:8000/tools/plan-sheet.html`, Open plan folder, pick images, Save), *Print to PDF* (Chrome print: destination Save as PDF, margins None, Background graphics on, paper matching the Letter/A4 switch). Values exactly as the spec's SketchUp section. Mark each setting that the help pages didn't confirm for Free with "(may differ in your version)".
- [ ] **Step 3: Commit** (`Plan sheet: SketchUp Free starter guide`).

---

### Task 7: Final check

- [ ] **Step 1: Run the full harness.** Expected: `PASS 29` (`PASS 30` once Step 2 adds its test).
- [ ] **Step 2: Print the sample at Letter and A4** (Task 2's command; for A4 load the sample, call `setPaper('a4')` via a `&paper=a4` query the boot path honours — add that one-line override in `plan-sheet.html` if missing, and a test `render: paper query`). Expected: 6 pages each, 792 × 612 pt and 842 × 595 pt. Read both PDFs and check every page by eye.
- [ ] **Step 3: Update the local, git-ignored `CLAUDE.md`**: add `tools/plan-sheet.html` to Development (`make preview`, then `localhost:8000/tools/plan-sheet.html`; tests via the headless command), and a short "Plan sheets" note: plans are folders outside the repo, the page has its own `<style>`, `docs/plans/sketchup-starter.md`.
- [ ] **Step 4: Hand Annie the manual checks:** in real Chrome, Open plan folder on a copy of the sample (made with Save to folder…), pick a PNG, Save, reload; follow the SketchUp guide once and report anything that differs.
