"""
Tests for tools/trim_views.py. Each test builds a plan folder in a temporary
directory, so no real plan is touched. The cropping tests need `swift`
(Xcode command line tools) and are skipped without it.

Run from the site root: python3 -m unittest tools/test_trim_views.py
"""

import shutil
import struct
import sys
import tempfile
import unittest
import zlib
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import trim_views as tv  # noqa: E402

HAS_SWIFT = shutil.which("swift") is not None


def make_png(path, w, h, box=None, bg=(255, 255, 255, 255), ink=(0, 0, 0, 255)):
    """Write an RGBA PNG of size w x h, background bg, with box (x0, y0, x1, y1) filled with ink."""
    rows = bytearray()
    for y in range(h):
        rows.append(0)
        for x in range(w):
            inside = box and box[0] <= x < box[2] and box[1] <= y < box[3]
            rows.extend(ink if inside else bg)

    def chunk(kind, data):
        return struct.pack(">I", len(data)) + kind + data + struct.pack(">I", zlib.crc32(kind + data))

    png = b"\x89PNG\r\n\x1a\n"
    png += chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 6, 0, 0, 0))
    png += chunk(b"IDAT", zlib.compress(bytes(rows)))
    png += chunk(b"IEND", b"")
    Path(path).write_bytes(png)


def png_size(path):
    data = Path(path).read_bytes()
    return struct.unpack(">II", data[16:24])


class PlanFolderTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.plans = Path(self.tmp.name) / "plans"

    def tearDown(self):
        self.tmp.cleanup()

    def test_lists_plan_folders_with_views(self):
        (self.plans / "p-010-coffee-table" / "views").mkdir(parents=True)
        (self.plans / "p-003-floating-night-stands" / "views").mkdir(parents=True)
        (self.plans / "notes").mkdir()
        names = [p.name for p in tv.list_plans(self.plans)]
        self.assertEqual(names, ["p-003-floating-night-stands", "p-010-coffee-table"])

    def test_missing_plans_folder_lists_nothing(self):
        self.assertEqual(tv.list_plans(self.plans / "nope"), [])

    def test_only_pngs_are_candidates(self):
        views = self.plans / "p-003" / "views"
        views.mkdir(parents=True)
        for name in ["front.png", "Iso.PNG", "shop.jpg", "section.svg", ".hidden.png"]:
            (views / name).write_bytes(b"x")
        (views / "sub.png").mkdir()
        self.assertEqual([p.name for p in tv.candidates(views)], ["front.png", "Iso.PNG"])

    def test_plan_without_views_is_an_error(self):
        (self.plans / "p-003").mkdir(parents=True)
        with self.assertRaises(FileNotFoundError):
            tv.trim_plan(self.plans / "p-003")


@unittest.skipUnless(HAS_SWIFT, "needs swift (Xcode command line tools)")
class TrimTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.plan = Path(self.tmp.name) / "p-003-floating-night-stands"
        self.views = self.plan / "views"
        self.views.mkdir(parents=True)

    def tearDown(self):
        self.tmp.cleanup()

    def test_crops_white_margin_and_keeps_original(self):
        make_png(self.views / "front.png", 400, 200, box=(180, 60, 220, 140))
        raw = (self.views / "front.png").read_bytes()
        results = tv.trim_plan(self.plan)
        self.assertEqual(results, [("front.png", "trimmed", (400, 200), (46, 86))])
        self.assertEqual(png_size(self.views / "front.png"), (46, 86))  # 40x80 box + 4% of 80 each side
        self.assertEqual((self.plan / "originals" / "front.png").read_bytes(), raw)

    def test_crops_transparent_margin(self):
        make_png(self.views / "iso.png", 300, 300, box=(100, 100, 200, 150), bg=(0, 0, 0, 0))
        tv.trim_plan(self.plan)
        self.assertEqual(png_size(self.views / "iso.png"), (108, 58))

    def test_second_run_leaves_trimmed_images_alone(self):
        make_png(self.views / "front.png", 400, 200, box=(180, 60, 220, 140))
        tv.trim_plan(self.plan)
        trimmed = (self.views / "front.png").read_bytes()
        original = (self.plan / "originals" / "front.png").read_bytes()
        results = tv.trim_plan(self.plan)
        self.assertEqual(results[0][:2], ("front.png", "already tight"))
        self.assertEqual((self.views / "front.png").read_bytes(), trimmed)
        self.assertEqual((self.plan / "originals" / "front.png").read_bytes(), original)

    def test_re_export_replaces_the_older_original(self):
        make_png(self.views / "front.png", 400, 200, box=(180, 60, 220, 140))
        tv.trim_plan(self.plan)
        make_png(self.views / "front.png", 500, 300, box=(100, 100, 300, 200))
        new_raw = (self.views / "front.png").read_bytes()
        tv.trim_plan(self.plan)
        self.assertEqual((self.plan / "originals" / "front.png").read_bytes(), new_raw)
        self.assertEqual(png_size(self.views / "front.png"), (216, 116))

    def test_blank_image_is_skipped(self):
        make_png(self.views / "blank.png", 50, 50)
        raw = (self.views / "blank.png").read_bytes()
        results = tv.trim_plan(self.plan)
        self.assertEqual(results[0][:2], ("blank.png", "blank, skipped"))
        self.assertEqual((self.views / "blank.png").read_bytes(), raw)
        self.assertFalse((self.plan / "originals").exists())

    def test_leaves_no_temporary_files(self):
        make_png(self.views / "front.png", 400, 200, box=(180, 60, 220, 140))
        tv.trim_plan(self.plan)
        self.assertEqual(sorted(p.name for p in self.views.iterdir()), ["front.png"])


if __name__ == "__main__":
    unittest.main()
