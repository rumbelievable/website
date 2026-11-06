"""
Tests for tools/trim_views.py. Each test builds a plan folder in a temporary
directory, so no real plan is touched. The image tests need `swift` (Xcode
command line tools) and are skipped without it.

Run from the site root: python3 -m unittest tools/test_trim_views.py
"""

import json
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
WHITE, BLACK, RED = (255, 255, 255, 255), (0, 0, 0, 255), (200, 30, 30, 255)


def make_png(path, w, h, box=None, bg=WHITE, ink=BLACK):
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


def read_png(path):
    """Decode an 8-bit RGB or RGBA, non-interlaced PNG to (w, h, rows of (r, g, b) tuples)."""
    data = Path(path).read_bytes()
    pos, idat, w, h, bpp = 8, b"", None, None, None
    while pos < len(data):
        length, kind = struct.unpack(">I4s", data[pos:pos + 8])
        body = data[pos + 8:pos + 8 + length]
        if kind == b"IHDR":
            w, h, depth, ctype, _, _, interlace = struct.unpack(">IIBBBBB", body)
            assert depth == 8 and ctype in (2, 6) and interlace == 0, (depth, ctype, interlace)
            bpp = 4 if ctype == 6 else 3
        elif kind == b"IDAT":
            idat += body
        pos += 12 + length
    raw, stride, prev, rows = zlib.decompress(idat), w * bpp, bytearray(w * bpp), []
    for y in range(h):
        ftype, line = raw[y * (stride + 1)], bytearray(raw[y * (stride + 1) + 1:(y + 1) * (stride + 1)])
        for i in range(stride):
            a = line[i - bpp] if i >= bpp else 0
            b, c = prev[i], prev[i - bpp] if i >= bpp else 0
            if ftype == 1:
                line[i] = (line[i] + a) & 255
            elif ftype == 2:
                line[i] = (line[i] + b) & 255
            elif ftype == 3:
                line[i] = (line[i] + (a + b) // 2) & 255
            elif ftype == 4:
                p = a + b - c
                pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
                line[i] = (line[i] + (a if pa <= pb and pa <= pc else b if pb <= pc else c)) & 255
        rows.append([tuple(line[x * bpp:x * bpp + 3]) for x in range(w)])
        prev = line
    return w, h, rows


def png_size(path):
    return struct.unpack(">II", Path(path).read_bytes()[16:24])


def dark_run(path):
    """Number of dark pixels across the middle row: the width of a vertical line."""
    w, h, rows = read_png(path)
    return sum(1 for px in rows[h // 2] if max(px) < 128)


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

    def test_finds_plan_by_number_or_name(self):
        (self.plans / "p-003-floating-night-stands" / "views").mkdir(parents=True)
        plans = tv.list_plans(self.plans)
        for answer in ["3", "003", "p-003-floating-night-stands"]:
            self.assertEqual(tv.find_plan(plans, answer).name, "p-003-floating-night-stands")
        self.assertIsNone(tv.find_plan(plans, "4"))

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
        self.originals = self.plan / "originals"
        self.views.mkdir(parents=True)

    def tearDown(self):
        self.tmp.cleanup()

    def line(self, name="front.png"):
        """A 1px vertical line, 100px tall, in a 400x200 white export."""
        make_png(self.views / name, 400, 200, box=(200, 50, 201, 150))
        return (self.views / name).read_bytes()

    def test_crops_white_margin_and_keeps_original(self):
        make_png(self.views / "front.png", 400, 200, box=(180, 60, 220, 140))
        raw = (self.views / "front.png").read_bytes()
        self.assertEqual(tv.trim_plan(self.plan), [("front.png", "cropped", (400, 200), (46, 86))])
        self.assertEqual(png_size(self.views / "front.png"), (46, 86))  # 40x80 box + 4% of 80 each side
        self.assertEqual((self.originals / "front.png").read_bytes(), raw)

    def test_crops_transparent_margin(self):
        make_png(self.views / "iso.png", 300, 300, box=(100, 100, 200, 150), bg=(0, 0, 0, 0))
        tv.trim_plan(self.plan)
        self.assertEqual(png_size(self.views / "iso.png"), (108, 58))

    def test_second_run_changes_nothing(self):
        self.line()
        tv.trim_plan(self.plan)
        trimmed = (self.views / "front.png").read_bytes()
        original = (self.originals / "front.png").read_bytes()
        self.assertEqual(tv.trim_plan(self.plan)[0][1], "already done")
        self.assertEqual((self.views / "front.png").read_bytes(), trimmed)
        self.assertEqual((self.originals / "front.png").read_bytes(), original)

    def test_re_export_replaces_the_older_original(self):
        make_png(self.views / "front.png", 400, 200, box=(180, 60, 220, 140))
        tv.trim_plan(self.plan)
        make_png(self.views / "front.png", 500, 300, box=(100, 100, 300, 200))
        new_raw = (self.views / "front.png").read_bytes()
        tv.trim_plan(self.plan)
        self.assertEqual((self.originals / "front.png").read_bytes(), new_raw)
        self.assertEqual(png_size(self.views / "front.png"), (216, 116))

    def test_blank_image_is_skipped(self):
        make_png(self.views / "blank.png", 50, 50)
        raw = (self.views / "blank.png").read_bytes()
        self.assertEqual(tv.trim_plan(self.plan)[0][1], "blank, skipped")
        self.assertEqual((self.views / "blank.png").read_bytes(), raw)
        self.assertFalse(self.originals.exists())

    def test_tight_export_is_left_alone(self):
        make_png(self.views / "full.png", 50, 50, box=(1, 1, 49, 49))
        raw = (self.views / "full.png").read_bytes()
        self.assertEqual(tv.trim_plan(self.plan)[0][1], "already tight")
        self.assertEqual((self.views / "full.png").read_bytes(), raw)
        self.assertFalse(self.originals.exists())

    def test_leaves_no_temporary_files(self):
        self.line()
        tv.trim_plan(self.plan, thicken=1)
        self.assertEqual(sorted(p.name for p in self.views.iterdir()), ["front.png"])
        self.assertEqual(sorted(p.name for p in self.originals.iterdir()), [".trim.json", "front.png"])

    def test_thickens_line_drawings(self):
        raw = self.line()
        result = tv.trim_plan(self.plan, thicken=1)
        self.assertEqual(result[0][1], "cropped, lines thickened")
        self.assertEqual(dark_run(self.views / "front.png"), 3)
        self.assertEqual((self.originals / "front.png").read_bytes(), raw)

    def test_thicken_two(self):
        self.line()
        tv.trim_plan(self.plan, thicken=2)
        self.assertEqual(dark_run(self.views / "front.png"), 5)

    def test_never_thickens_twice(self):
        self.line()
        tv.trim_plan(self.plan, thicken=1)
        self.assertEqual(tv.trim_plan(self.plan, thicken=1)[0][1], "already done")
        self.assertEqual(dark_run(self.views / "front.png"), 3)

    def test_setting_is_remembered(self):
        self.line()
        tv.trim_plan(self.plan, thicken=1)
        self.assertEqual(tv.saved_thicken(self.plan), 1)
        self.line("side.png")  # a new export, run without a thickness
        tv.trim_plan(self.plan)
        self.assertEqual(dark_run(self.views / "side.png"), 3)
        self.assertEqual(dark_run(self.views / "front.png"), 3)

    def test_changing_thickness_rebuilds_from_original(self):
        raw = self.line()
        tv.trim_plan(self.plan, thicken=2)
        self.assertEqual(tv.trim_plan(self.plan, thicken=1)[0][1], "cropped, lines thickened")
        self.assertEqual(dark_run(self.views / "front.png"), 3)
        self.assertEqual(tv.trim_plan(self.plan, thicken=0)[0][1], "cropped")
        self.assertEqual(dark_run(self.views / "front.png"), 1)
        self.assertEqual((self.originals / "front.png").read_bytes(), raw)

    def test_colour_render_is_not_thickened(self):
        make_png(self.views / "render.png", 400, 200, box=(150, 50, 250, 150), ink=RED)
        result = tv.trim_plan(self.plan, thicken=1)
        self.assertEqual(result[0][1], "cropped, colour render, lines left alone")
        w, h, rows = read_png(self.views / "render.png")
        self.assertEqual(rows[h // 2][w // 2], RED[:3])

    def test_adopts_folder_cropped_without_a_record(self):
        # The layout left by the first version: a crop in views/, its export in originals/, no record.
        raw = self.line()
        tv.trim_plan(self.plan)
        (self.originals / ".trim.json").unlink()
        self.assertEqual(tv.trim_plan(self.plan, thicken=1)[0][1], "cropped, lines thickened")
        self.assertEqual(dark_run(self.views / "front.png"), 3)
        self.assertEqual((self.originals / "front.png").read_bytes(), raw)

    def test_bad_record_is_ignored(self):
        self.line()
        self.originals.mkdir()
        (self.originals / ".trim.json").write_text("not json")
        self.assertEqual(tv.trim_plan(self.plan)[0][1], "cropped")
        self.assertEqual(json.loads((self.originals / ".trim.json").read_text())["thicken"], 0)


if __name__ == "__main__":
    unittest.main()
