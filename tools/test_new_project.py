"""
Tests for tools/new_project.py. Each test runs against a temporary copy of the
site files the generator touches, so the real site is never written.

Run from the site root: python3 -m unittest tools/test_new_project.py
"""

import re
import shutil
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import new_project as np  # noqa: E402

SITE = Path(__file__).resolve().parent.parent

PROJECT = {
    "no":         "014",
    "title":      "Test Bench",
    "slug":       "test-bench",
    "subtitle":   "A bench for testing",
    "year":       "2026",
    "card_img":   "https://example.com/card.jpg",
    "card_meta":  "White Oak // Walnut · Danish Oil · 2026",
    "hero_url":   "https://example.com/hero.jpg",
    "extra_urls": [f"https://example.com/{n}.jpg" for n in range(1, 6)],
    "wood":       "White Oak",
    "finish":     "Danish Oil",
    "joinery":    "Mortise and tenon",
    "hardware":   "",
    "plan_name":  "",
    "plan_url":   "",
    "narrative":  ["First paragraph.", "Second paragraph."],
    "lessons":    ["Measure twice"],
}


class GeneratorTest(unittest.TestCase):

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        for name in ("index.html", "woodworking.html"):
            shutil.copy(SITE / name, self.root / name)
        shutil.copytree(SITE / "pages" / "woodworking", self.root / "pages" / "woodworking")
        self.prev = np.latest_project(self.root)

    def tearDown(self):
        self.tmp.cleanup()

    def read(self, rel):
        return (self.root / rel).read_text(encoding="utf-8")

    def snapshot(self):
        return {p: p.read_bytes() for p in self.root.rglob("*.html")}

    def ledger_rows(self):
        text = self.read("index.html")
        body = text[text.index(np.LEDGER_START):text.index(np.LEDGER_END)]
        return re.findall(r'<span class="ledger-no">(\d+)</span>', body)

    def counts(self, rel):
        return re.findall(r'<span data-count="projects">(\d+)</span>', self.read(rel))

    # ── Number suggestion ──

    def test_latest_project_is_highest_number(self):
        no, slug, _ = self.prev
        pages = list((self.root / "pages" / "woodworking").glob("*.html"))
        highest = max(int(re.search(r'data-project-no="(\d+)"', p.read_text()).group(1)) for p in pages)
        self.assertEqual(int(no), highest)
        self.assertTrue((self.root / "pages" / "woodworking" / f"{slug}.html").exists())

    # ── A new project ──

    def test_new_page_written_with_prev_link(self):
        np.generate(PROJECT, self.root)
        page = self.read("pages/woodworking/test-bench.html")
        self.assertIn('data-project-no="014"', page)
        self.assertIn(f'<a href="./{self.prev[1]}.html" class="pager-prev">', page)
        self.assertIn(np.LATEST_MARKER, page)
        self.assertNotIn("@@", page)

    def test_new_page_has_no_nts(self):
        np.generate(PROJECT, self.root)
        self.assertNotIn("NTS", self.read("pages/woodworking/test-bench.html"))

    def test_new_page_loads_archivo_italic(self):
        np.generate(PROJECT, self.root)
        self.assertIn("family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900",
                      self.read("pages/woodworking/test-bench.html"))

    def test_card_prepended_and_counts_bumped(self):
        before = int(self.counts("woodworking.html")[0])
        np.generate(PROJECT, self.root)
        text = self.read("woodworking.html")
        first = re.search(r'<a href="\./pages/woodworking/([\w-]+)\.html" class="project-card">', text)
        self.assertEqual(first.group(1), "test-bench")
        self.assertIn('<span class="mill-tag">White Oak</span><span class="mill-tag">Walnut</span>', text)
        self.assertIn('<p class="project-card-finish">Danish Oil · 2026</p>', text)
        self.assertEqual(self.counts("woodworking.html"), [str(before + 1)])
        self.assertEqual(self.counts("index.html"), [str(before + 1)])

    def test_ledger_row_inserted_and_trimmed_to_five(self):
        before = self.ledger_rows()
        np.generate(PROJECT, self.root)
        after = self.ledger_rows()
        self.assertEqual(after, ["014"] + before[:4])
        self.assertIn('<span class="ledger-wood">White Oak · Walnut</span>', self.read("index.html"))

    def test_previous_newest_links_forward(self):
        np.generate(PROJECT, self.root)
        prev_page = self.read(f"pages/woodworking/{self.prev[1]}.html")
        self.assertNotIn(np.LATEST_MARKER, prev_page)
        self.assertIn('<a href="./test-bench.html" class="pager-next">014 Test Bench', prev_page)

    def test_regenerating_does_not_duplicate(self):
        np.generate(PROJECT, self.root)
        np.generate(dict(PROJECT, title="Test Bench II"), self.root)
        self.assertEqual(self.read("woodworking.html").count('href="./pages/woodworking/test-bench.html"'), 1)
        self.assertEqual(self.ledger_rows().count("014"), 1)
        self.assertEqual(len(self.ledger_rows()), 5)
        self.assertEqual(self.counts("index.html"), [str(int(self.prev[0]) + 1)])
        prev_page = self.read(f"pages/woodworking/{self.prev[1]}.html")
        self.assertIn("014 Test Bench II", prev_page)

    # ── Nothing written when a marker is missing ──

    def assert_nothing_written(self, rel, marker):
        path = self.root / rel
        path.write_text(path.read_text(encoding="utf-8").replace(marker, ""), encoding="utf-8")
        before = self.snapshot()
        with self.assertRaises(np.PatchError) as err:
            np.generate(PROJECT, self.root)
        self.assertIn(rel.split("/")[-1], str(err.exception))
        self.assertEqual(self.snapshot(), before)
        self.assertFalse((self.root / "pages" / "woodworking" / "test-bench.html").exists())

    def test_missing_ledger_marker(self):
        self.assert_nothing_written("index.html", np.LEDGER_START)

    def test_missing_grid_marker(self):
        self.assert_nothing_written("woodworking.html", np.GRID_MARKER)

    def test_missing_count(self):
        self.assert_nothing_written("woodworking.html", '<span data-count="projects">')

    def test_missing_latest_marker(self):
        self.assert_nothing_written(f"pages/woodworking/{self.prev[1]}.html", np.LATEST_MARKER)


if __name__ == "__main__":
    unittest.main()
