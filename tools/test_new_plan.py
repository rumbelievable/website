"""
Tests for tools/new_plan.py. Each test uses a temporary site root and plans
folder, so neither the real site nor the real plans folder is touched.

Run from the site root: python3 -m unittest tools/test_new_plan.py
"""

import json
import sys
import tempfile
import unittest
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import new_plan as npl  # noqa: E402

PAGE = """<body class="page-project" data-project-no="{no}">
  <p class="eyebrow">No. {no} · Woodworking · {year}</p>
  <h1>{title}</h1>
</body>"""


class NewPlanTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        base = Path(self.tmp.name)
        self.site = base / "site"
        self.plans = base / "plans"
        wood = self.site / "pages" / "woodworking"
        wood.mkdir(parents=True)
        for slug, no, title, year in [
            ("floating-night-stands", "003", "Floating Night Stands", "2025"),
            ("coffee-table", "010", "Coffee Table", "2026"),
        ]:
            (wood / f"{slug}.html").write_text(PAGE.format(no=no, title=title, year=year))

    def tearDown(self):
        self.tmp.cleanup()

    def test_lists_projects_by_number(self):
        projects = npl.list_projects(self.site)
        self.assertEqual([p["slug"] for p in projects], ["floating-night-stands", "coffee-table"])
        self.assertEqual(projects[0], {
            "slug": "floating-night-stands", "no": "003",
            "title": "Floating Night Stands", "year": "2025",
        })

    def test_finds_project_by_number_or_slug(self):
        projects = npl.list_projects(self.site)
        for answer in ["3", "003", "floating-night-stands", " Floating-Night-Stands "]:
            self.assertEqual(npl.find_project(projects, answer)["slug"], "floating-night-stands", answer)
        self.assertIsNone(npl.find_project(projects, "99"))
        self.assertIsNone(npl.find_project(projects, ""))

    def test_builds_starter_plan(self):
        project = npl.list_projects(self.site)[0]
        plan = npl.build_plan(project, today=date(2026, 11, 2))
        self.assertEqual(plan["version"], 1)
        self.assertEqual(plan["plan"], {
            "no": "P-003", "name": "Floating Night Stands", "drawn": "A.R.",
            "units": "Inches", "rev": "A", "date": "2026-11-02",
            "built": "No. 003, 2025", "paper": "letter",
        })
        self.assertEqual([s["layout"] for s in plan["sheets"]], ["cover", "drawing", "cutlist", "step"])

    def test_starter_sheets_match_editor_defaults(self):
        sheets = npl.build_plan(npl.list_projects(self.site)[0])["sheets"]
        self.assertEqual(sheets[0], {"layout": "cover", "title": "Cover", "scale": "Not to scale",
                                     "image": {"src": "", "caption": ""}, "notes": []})
        self.assertEqual(sheets[1]["views"], [{"src": "", "caption": ""}])
        self.assertEqual(sheets[2]["parts"], [{"name": "", "qty": "", "t": "", "w": "", "l": "",
                                               "material": "", "notes": ""}])
        self.assertEqual(sheets[3]["callout"], {"kind": "tip", "text": ""})

    def test_creates_plan_folder(self):
        project = npl.list_projects(self.site)[0]
        folder = npl.create_plan(project, self.plans, today=date(2026, 11, 2))
        self.assertEqual(folder, self.plans / "p-003-floating-night-stands")
        self.assertTrue((folder / "views").is_dir())
        written = json.loads((folder / "plan.json").read_text())
        self.assertEqual(written, npl.build_plan(project, today=date(2026, 11, 2)))

    def test_refuses_to_overwrite_existing_plan(self):
        project = npl.list_projects(self.site)[0]
        folder = self.plans / "p-003-floating-night-stands"
        folder.mkdir(parents=True)
        (folder / "plan.json").write_text("{}")
        with self.assertRaises(FileExistsError):
            npl.create_plan(project, self.plans)
        self.assertEqual((folder / "plan.json").read_text(), "{}")
        self.assertFalse((folder / "views").exists())

    def test_keeps_existing_views_folder(self):
        project = npl.list_projects(self.site)[0]
        views = self.plans / "p-003-floating-night-stands" / "views"
        views.mkdir(parents=True)
        (views / "front.png").write_bytes(b"png")
        npl.create_plan(project, self.plans)
        self.assertEqual((views / "front.png").read_bytes(), b"png")


if __name__ == "__main__":
    unittest.main()
