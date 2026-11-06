#!/usr/bin/env python3
"""
Start a plan folder for a woodworking project.

Asks which project the plan is for, then makes {plans}/p-NNN-slug/ with an
empty views/ folder and a starter plan.json (cover, drawing, cut list and
build step sheets) for tools/plan-sheet.html to open.

Plan folders live outside the repo, because GitHub Pages publishes everything
in it. Usage: python3 tools/new_plan.py [PLANS_DIR]   (default ~/Desktop/plans)
"""

import json
import re
import subprocess
import sys
import urllib.request
from datetime import date
from pathlib import Path

SITE_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_PLANS_DIR = Path.home() / "Desktop" / "plans"
EDITOR_URL = "http://localhost:8000/tools/plan-sheet.html"


def list_projects(root=SITE_ROOT):
    """Project pages as dicts (slug, no, title, year), oldest number first."""
    projects = []
    for page in (root / "pages" / "woodworking").glob("*.html"):
        text = page.read_text(encoding="utf-8")
        no = re.search(r'data-project-no="(\d+)"', text)
        title = re.search(r"<h1>(.*?)</h1>", text, re.S)
        year = re.search(r'class="eyebrow">No\. \d+ · .*? · (\d{4})<', text)
        if not (no and title):
            continue
        projects.append({
            "slug": page.stem,
            "no": no.group(1),
            "title": " ".join(title.group(1).split()),
            "year": year.group(1) if year else "",
        })
    return sorted(projects, key=lambda p: int(p["no"]))


def find_project(projects, answer):
    """Match a typed project number (3 or 003) or slug."""
    answer = answer.strip().lower()
    if not answer:
        return None
    for p in projects:
        if answer == p["slug"] or (answer.isdigit() and int(answer) == int(p["no"])):
            return p
    return None


# Starter sheets. Keep these in step with newSheet() in tools/plan-sheet.html.
def _image():
    return {"src": "", "caption": ""}


def _starter_sheets():
    return [
        {"layout": "cover", "title": "Cover", "scale": "Not to scale", "image": _image(), "notes": []},
        {"layout": "drawing", "title": "Drawing", "scale": "Not to scale", "slots": 1,
         "views": [_image()], "notes": []},
        {"layout": "cutlist", "title": "Cut list", "scale": "",
         "parts": [{"name": "", "qty": "", "t": "", "w": "", "l": "", "material": "", "notes": ""}],
         "materials": [], "hardware": []},
        {"layout": "step", "title": "Build step", "scale": "Not to scale", "images": [_image()],
         "steps": [], "parts": "", "callout": {"kind": "tip", "text": ""}},
    ]


def build_plan(project, today=None):
    today = today or date.today()
    built = f"No. {project['no']}, {project['year']}" if project["year"] else f"No. {project['no']}"
    return {
        "version": 1,
        "plan": {
            "no": f"P-{project['no']}",
            "name": project["title"],
            "drawn": "A.R.",
            "units": "Inches",
            "rev": "A",
            "date": today.isoformat(),
            "built": built,
            "paper": "letter",
        },
        "sheets": _starter_sheets(),
    }


def create_plan(project, plans_dir, today=None):
    """Write {plans_dir}/p-NNN-slug/plan.json and views/. Never overwrites a plan.json."""
    folder = Path(plans_dir) / f"p-{project['no']}-{project['slug']}"
    plan_file = folder / "plan.json"
    if plan_file.exists():
        raise FileExistsError(plan_file)
    (folder / "views").mkdir(parents=True, exist_ok=True)
    plan_file.write_text(json.dumps(build_plan(project, today), indent=2, ensure_ascii=False) + "\n",
                         encoding="utf-8")
    return folder


def preview_running():
    try:
        with urllib.request.urlopen(EDITOR_URL, timeout=1):
            return True
    except OSError:
        return False


def main():
    plans_dir = Path(sys.argv[1]).expanduser() if len(sys.argv) > 1 else DEFAULT_PLANS_DIR
    if SITE_ROOT in plans_dir.resolve().parents or plans_dir.resolve() == SITE_ROOT:
        sys.exit(f"  {plans_dir} is inside the site repo, which GitHub Pages publishes. Pick a folder outside it.")

    projects = list_projects()
    print("\n  New plan. Which project is it for?\n")
    for p in projects:
        print(f"    {p['no']}  {p['title']}")
    print()
    project = None
    while project is None:
        try:
            answer = input("  Project number or slug: ")
        except (EOFError, KeyboardInterrupt):
            sys.exit("\n  Nothing written.")
        project = find_project(projects, answer)
        if project is None:
            print("  No project matches that. Type a number from the list.")

    try:
        folder = create_plan(project, plans_dir)
    except FileExistsError as err:
        sys.exit(f"\n  {err} already exists. Open it in the editor instead. Nothing written.")

    print(f"\n  Made {folder}")
    print(f"    plan.json  P-{project['no']} {project['title']}: cover, drawing, cut list, build step")
    print("    views/     put your Fusion or SketchUp exports here (PNG, JPG or SVG)")
    if preview_running():
        subprocess.run(["open", "-a", "Google Chrome", EDITOR_URL], check=False)
        print(f"\n  Opened {EDITOR_URL} in Chrome.")
    else:
        print(f"\n  Run `make preview`, then open {EDITOR_URL} in Chrome.")
    print("  Click Open plan folder and choose the folder above.\n")


if __name__ == "__main__":
    main()
