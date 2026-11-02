#!/usr/bin/env python3
"""
Crop the empty margin off a plan's PNG exports, so the model fills its slot
on the plan sheet.

For each PNG in {plan}/views/ with white or transparent margin to spare, the
untouched export moves to {plan}/originals/ and a cropped copy takes its place
under the same name, so the editor's Reload images picks it up with nothing to
re-link. Images already cropped are left alone, so it is safe to run again after
re-exporting. A re-exported image replaces the older copy in originals/.
JPGs (shop photos) and SVGs are not touched.

The cropping is done by tools/trim_png.swift, so this needs macOS with the
Xcode command line tools (`swift`).

Usage: python3 tools/trim_views.py [PLAN] [--plans-dir DIR]
  PLAN is a plan folder path, a folder name in the plans folder, or a project
  number (3 → p-003-…). Without it, lists the plans and asks.
"""

import argparse
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

SWIFT_SCRIPT = Path(__file__).resolve().parent / "trim_png.swift"
DEFAULT_PLANS_DIR = Path.home() / "Desktop" / "plans"
STATUS = {"trimmed": "trimmed", "tight": "already tight", "blank": "blank, skipped",
          "error": "could not crop, skipped"}


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


def trim_plan(plan):
    """Trim every PNG in {plan}/views/. Returns (name, status, original size, crop size) per file."""
    plan = Path(plan)
    views, originals = plan / "views", plan / "originals"
    if not views.is_dir():
        raise FileNotFoundError(views)
    files = candidates(views)
    if not files:
        return []
    if shutil.which("swift") is None:
        raise RuntimeError("needs `swift`. Install the Xcode command line tools: xcode-select --install")

    results = []
    with tempfile.TemporaryDirectory() as tmp:
        run = subprocess.run(["swift", str(SWIFT_SCRIPT), tmp, *map(str, files)],
                             capture_output=True, text=True)
        if run.returncode != 0:
            raise RuntimeError(f"trim_png.swift failed:\n{run.stderr.strip()}")
        for line in run.stdout.splitlines():
            fields = line.split("\t")
            name, kind = fields[0], fields[-1]
            if kind in ("blank", "error"):
                results.append((name, STATUS[kind], None, None))
                continue
            size = (int(fields[1]), int(fields[2]))
            crop = (int(fields[3]), int(fields[4]))
            if kind == "trimmed":
                # Copy the crop in beside the export first, so a failure never leaves a gap in views/.
                staged = views / f".{name}.trimming"
                shutil.copyfile(Path(tmp) / name, staged)
                originals.mkdir(exist_ok=True)
                os.replace(views / name, originals / name)
                os.replace(staged, views / name)
            results.append((name, STATUS[kind], size, crop))
    return results


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
    parser = argparse.ArgumentParser(description="Crop the empty margin off a plan's PNG exports.")
    parser.add_argument("plan", nargs="?", help="plan folder, folder name, or project number")
    parser.add_argument("--plans-dir", default=str(DEFAULT_PLANS_DIR))
    args = parser.parse_args()
    plans_dir = Path(args.plans_dir).expanduser()

    if not args.plan:
        plan = choose_plan(plans_dir)
    else:
        given = Path(args.plan).expanduser()
        plan = given if (given / "views").is_dir() else find_plan(list_plans(plans_dir), args.plan)
        if plan is None:
            sys.exit(f"  No plan folder matches {args.plan!r} (looked in {plans_dir}).")

    try:
        results = trim_plan(plan)
    except (FileNotFoundError, RuntimeError) as err:
        sys.exit(f"  {err}")
    if not results:
        sys.exit(f"  No PNGs in {plan / 'views'}.")

    print(f"\n  {plan / 'views'}\n")
    width = max(len(r[0]) for r in results)
    for name, status, size, crop in results:
        sizes = f"  {size[0]}x{size[1]} → {crop[0]}x{crop[1]}" if status == "trimmed" else ""
        print(f"    {name.ljust(width)}  {status}{sizes}")
    if any(r[1] == "trimmed" for r in results):
        print(f"\n  Untouched exports are in {plan / 'originals'}.")
        print("  In the editor, click Reload images.\n")
    else:
        print("\n  Nothing to crop.\n")


if __name__ == "__main__":
    main()
