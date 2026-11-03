#!/usr/bin/env python3
"""
Crop the empty margin off a plan's PNG exports, so the model fills its slot on
the plan sheet, and optionally thicken the lines of line drawings.

For each PNG in {plan}/views/, the untouched export moves to {plan}/originals/
and the processed copy takes its place under the same name, so the editor's
Reload images picks it up with nothing to re-link. Every processed image is
rebuilt from its untouched export, so lines are never thickened twice, and
changing the thickness redoes them from scratch. A re-exported image replaces
the older copy in originals/. JPGs (shop photos) and SVGs are not touched.

--thicken N grows each line by N px on every side (0 = off). Only line drawings
are thickened; colour renders are cropped but left alone. The setting is
remembered per plan in originals/.trim.json, so later runs keep it.

The pixel work is tools/trim_png.swift, so this needs macOS with the Xcode
command line tools (`swift`).

Usage: python3 tools/trim_views.py [PLAN] [--thicken N] [--plans-dir DIR]
  PLAN is a plan folder path, a folder name in the plans folder, or a project
  number (3 → p-003-…). Without it, lists the plans and asks.
"""

import argparse
import hashlib
import json
import os
import shutil
import struct
import subprocess
import sys
import tempfile
from pathlib import Path

SWIFT_SCRIPT = Path(__file__).resolve().parent / "trim_png.swift"
DEFAULT_PLANS_DIR = Path.home() / "Desktop" / "plans"
MANIFEST = ".trim.json"


def list_plans(plans_dir):
    """Plan folders (folders with a views/ folder), sorted by name."""
    plans_dir = Path(plans_dir)
    if not plans_dir.is_dir():
        return []
    return sorted(p for p in plans_dir.iterdir() if (p / "views").is_dir())


def candidates(views):
    """PNG files in views/, sorted by name ignoring case. Hidden files are skipped."""
    return sorted((p for p in Path(views).iterdir()
                   if p.is_file() and p.suffix.lower() == ".png" and not p.name.startswith(".")),
                  key=lambda p: p.name.lower())


def find_plan(plans, answer):
    """Match a plan by folder name or project number (3 or 003 → p-003-…)."""
    answer = answer.strip()
    for p in plans:
        if p.name == answer:
            return p
    if answer.isdigit():
        prefix = f"p-{int(answer):03d}-"
        for p in plans:
            if p.name.startswith(prefix):
                return p
    return None


def sha256(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def png_size(path):
    with open(path, "rb") as f:
        head = f.read(24)
    return struct.unpack(">II", head[16:24]) if head[12:16] == b"IHDR" else None


def load_manifest(originals):
    try:
        data = json.loads((originals / MANIFEST).read_text(encoding="utf-8"))
    except (FileNotFoundError, ValueError):
        return {"thicken": 0, "files": {}}
    if not isinstance(data.get("files"), dict):
        data["files"] = {}
    if not isinstance(data.get("thicken"), int):
        data["thicken"] = 0
    return data


def save_manifest(originals, manifest):
    originals.mkdir(exist_ok=True)
    staged = originals / f"{MANIFEST}.saving"
    staged.write_text(json.dumps(manifest, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    os.replace(staged, originals / MANIFEST)


def saved_thicken(plan):
    return load_manifest(Path(plan) / "originals")["thicken"]


def run_swift(out_dir, thicken, sources):
    if shutil.which("swift") is None:
        raise RuntimeError("needs `swift`. Install the Xcode command line tools: xcode-select --install")
    run = subprocess.run(["swift", "-O", str(SWIFT_SCRIPT), str(out_dir), str(thicken), *map(str, sources)],
                         capture_output=True, text=True)
    if run.returncode != 0:
        raise RuntimeError(f"trim_png.swift failed:\n{run.stderr.strip()}")
    report = {}
    for line in run.stdout.splitlines():
        f = line.split("\t")
        if f[-1] in ("blank", "error"):
            report[f[0]] = {"kind": f[-1]}
        else:
            report[f[0]] = {"kind": "ok", "size": (int(f[1]), int(f[2])), "crop": (int(f[3]), int(f[4])),
                            "cropped": f[5] == "1", "thickened": f[6] == "1", "lines": f[7] == "lines"}
    return report


def trim_plan(plan, thicken=None):
    """
    Process every PNG in {plan}/views/. thicken=None uses the plan's saved setting.
    Returns (name, status, original size, result size) per file; sizes are None when skipped.
    """
    plan = Path(plan)
    views, originals = plan / "views", plan / "originals"
    if not views.is_dir():
        raise FileNotFoundError(views)
    manifest = load_manifest(originals)
    if thicken is None:
        thicken = manifest["thicken"]
    files = candidates(views)
    results, jobs = {}, {}  # jobs: name -> "new" (source is views/name) or "rebuild" (source is originals/name)

    for f in files:
        name, orig = f.name, originals / f.name
        entry = manifest["files"].get(name)
        if entry and entry.get("sha256") == sha256(f):
            if entry.get("thicken") == thicken:
                results[name] = ("already done", None, None)
            elif orig.exists():
                jobs[name] = "rebuild"
            else:
                results[name] = ("original missing, skipped", None, None)
        elif entry:
            jobs[name] = "new"  # re-exported since the last run
        elif orig.exists() and png_size(orig) != png_size(f):
            # Cropped before this folder had a record (the size differs from its export): adopt it.
            if thicken == 0:
                manifest["files"][name] = {"sha256": sha256(f), "thicken": 0}
                results[name] = ("already done", None, None)
            else:
                jobs[name] = "rebuild"
        else:
            jobs[name] = "new"

    if jobs:
        with tempfile.TemporaryDirectory() as tmp:
            sources = [views / n if kind == "new" else originals / n for n, kind in jobs.items()]
            report = run_swift(tmp, thicken, sources)
            for name, kind in jobs.items():
                r = report.get(name, {"kind": "error"})
                if r["kind"] == "blank":
                    results[name] = ("blank, skipped", None, None)
                    continue
                if r["kind"] == "error":
                    results[name] = ("could not process, skipped", None, None)
                    continue
                changed = r["cropped"] or r["thickened"]
                if kind == "new" and not changed:
                    manifest["files"].pop(name, None)
                    results[name] = ("already tight", r["size"], r["crop"])
                    continue
                # Stage the result beside the export first, so a failure never leaves a gap in views/.
                staged = views / f".{name}.trimming"
                shutil.copyfile(Path(tmp) / name if changed else originals / name, staged)
                if kind == "new":
                    originals.mkdir(exist_ok=True)
                    os.replace(views / name, originals / name)
                os.replace(staged, views / name)
                manifest["files"][name] = {"sha256": sha256(views / name), "thicken": thicken}
                parts = []
                if r["cropped"]:
                    parts.append("cropped")
                if r["thickened"]:
                    parts.append("lines thickened")
                elif thicken and not r["lines"]:
                    parts.append("colour render, lines left alone")
                results[name] = (", ".join(parts) or "restored from original", r["size"], r["crop"])

    manifest["thicken"] = thicken
    if (originals / MANIFEST).exists() or manifest["files"]:
        save_manifest(originals, manifest)
    return [(f.name, *results[f.name]) for f in files]


def choose_plan(plans_dir):
    plans = list_plans(plans_dir)
    if not plans:
        sys.exit(f"  No plan folders in {plans_dir}. Run `make plan` first.")
    print(f"\n  Plans in {plans_dir}:\n")
    for p in plans:
        print(f"    {p.name}")
    print()
    while True:
        try:
            answer = input("  Project number or folder name: ")
        except (EOFError, KeyboardInterrupt):
            sys.exit("\n  Nothing changed.")
        plan = find_plan(plans, answer)
        if plan:
            return plan
        print("  No plan matches that. Type a number or a name from the list.")


def main():
    parser = argparse.ArgumentParser(description="Crop the margin off a plan's PNG exports and thicken lines.")
    parser.add_argument("plan", nargs="?", help="plan folder, folder name, or project number")
    parser.add_argument("--thicken", default="", help="px to grow each line by (0 = off); default: the plan's last setting")
    parser.add_argument("--plans-dir", default=str(DEFAULT_PLANS_DIR))
    args = parser.parse_args()
    plans_dir = Path(args.plans_dir).expanduser()
    if args.thicken and not (args.thicken.isdigit() and int(args.thicken) <= 5):
        sys.exit("  --thicken is a whole number of pixels from 0 to 5.")
    thicken = int(args.thicken) if args.thicken else None

    if not args.plan:
        plan = choose_plan(plans_dir)
    else:
        given = Path(args.plan).expanduser()
        plan = given if (given / "views").is_dir() else find_plan(list_plans(plans_dir), args.plan)
        if plan is None:
            sys.exit(f"  No plan folder matches {args.plan!r} (looked in {plans_dir}).")

    try:
        results = trim_plan(plan, thicken)
    except (FileNotFoundError, RuntimeError) as err:
        sys.exit(f"  {err}")
    if not results:
        sys.exit(f"  No PNGs in {plan / 'views'}.")

    used = saved_thicken(plan)
    print(f"\n  {plan / 'views'}   (lines: {'+' + str(used) + ' px' if used else 'as exported'})\n")
    width = max(len(r[0]) for r in results)
    for name, status, size, crop in results:
        sizes = f"  {size[0]}x{size[1]} → {crop[0]}x{crop[1]}" if status.startswith("cropped") else ""
        print(f"    {name.ljust(width)}  {status}{sizes}")
    if any(r[2] for r in results if r[1] != "already tight"):
        print(f"\n  Untouched exports are in {plan / 'originals'}.")
        print("  In the editor, click Reload images.\n")
    else:
        print("\n  Nothing to change.\n")


if __name__ == "__main__":
    main()
