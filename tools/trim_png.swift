// Crops the empty margin off PNG exports and optionally thickens the lines of
// line drawings. Run by tools/trim_views.py; macOS only.
//
// Usage: swift tools/trim_png.swift <outDir> <thicken> <png>...
//
// Content is any pixel that is neither transparent nor near-white, so it works on
// white and transparent backgrounds. The crop is the content's box plus 4% of its
// longer side on every edge, applied only when it saves at least 5% of the width
// or height.
//
// <thicken> is a radius in pixels (0 = off). Line drawings (mostly white, almost
// no colour) are thickened by taking the darkest value within that radius, so a
// 1px line grows to 1 + 2 * radius px. They are flattened onto white first.
// Colour renders are never thickened, because it would smear the wood grain.
//
// A processed copy is written to <outDir> under the same name only when it was
// cropped or thickened; inputs are never modified. One tab-separated line per
// input on stdout:
//   name  W  H  w  h  cropped(0|1)  thickened(0|1)  lines|colour
//   name  blank      (no content found, or unreadable)
//   name  error      (the result could not be written)
import Foundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers

let padFraction = 0.04
let tightFraction = 0.95

let space = CGColorSpaceCreateDeviceRGB()
let bitmapInfo = CGImageAlphaInfo.premultipliedLast.rawValue

func load(_ path: String) -> CGImage? {
    guard let src = CGImageSourceCreateWithURL(URL(fileURLWithPath: path) as CFURL, nil) else { return nil }
    return CGImageSourceCreateImageAtIndex(src, 0, nil)
}

/// RGBA pixels, row 0 at the top. With `onWhite`, transparency is flattened onto white.
func pixels(_ img: CGImage, onWhite: Bool = false) -> [UInt8]? {
    let w = img.width, h = img.height
    var buf = [UInt8](repeating: 0, count: w * h * 4)
    let ok = buf.withUnsafeMutableBytes { ptr -> Bool in
        guard let ctx = CGContext(data: ptr.baseAddress, width: w, height: h, bitsPerComponent: 8,
                                  bytesPerRow: w * 4, space: space, bitmapInfo: bitmapInfo) else { return false }
        if onWhite {
            ctx.setFillColor(CGColor(red: 1, green: 1, blue: 1, alpha: 1))
            ctx.fill(CGRect(x: 0, y: 0, width: w, height: h))
        }
        ctx.draw(img, in: CGRect(x: 0, y: 0, width: w, height: h))
        return true
    }
    return ok ? buf : nil
}

func isBackground(_ buf: [UInt8], _ i: Int) -> Bool {
    let a = buf[i + 3]
    return a <= 8 || (a > 247 && min(buf[i], buf[i + 1], buf[i + 2]) > 240)
}

func contentBox(_ buf: [UInt8], _ w: Int, _ h: Int) -> CGRect? {
    var minX = w, minY = h, maxX = -1, maxY = -1
    for y in 0..<h {
        for x in 0..<w where !isBackground(buf, (y * w + x) * 4) {
            if x < minX { minX = x }; if x > maxX { maxX = x }
            if y < minY { minY = y }; if y > maxY { maxY = y }
        }
    }
    return maxX < 0 ? nil : CGRect(x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1)
}

/// A line drawing is under 40% ink, and under 5% of that ink is coloured.
func isLineDrawing(_ buf: [UInt8], _ w: Int, _ r: CGRect) -> Bool {
    var ink = 0, colour = 0
    for y in Int(r.minY)..<Int(r.maxY) {
        for x in Int(r.minX)..<Int(r.maxX) {
            let i = (y * w + x) * 4
            if isBackground(buf, i) { continue }
            ink += 1
            let hi = max(buf[i], buf[i + 1], buf[i + 2]), lo = min(buf[i], buf[i + 1], buf[i + 2])
            if Int(hi) - Int(lo) > 40 { colour += 1 }
        }
    }
    let area = Int(r.width) * Int(r.height)
    return Double(ink) < Double(area) * 0.4 && Double(colour) < Double(ink) * 0.05
}

/// Darkest value within `radius` (separable: rows, then columns), RGB only, on an opaque buffer.
func thicken(_ buf: [UInt8], _ w: Int, _ h: Int, _ radius: Int) -> [UInt8] {
    var rows = buf
    for y in 0..<h {
        for x in 0..<w {
            let lo = max(0, x - radius), hi = min(w - 1, x + radius)
            for c in 0..<3 {
                var m: UInt8 = 255
                for dx in lo...hi { m = min(m, buf[(y * w + dx) * 4 + c]) }
                rows[(y * w + x) * 4 + c] = m
            }
        }
    }
    var out = rows
    for y in 0..<h {
        let lo = max(0, y - radius), hi = min(h - 1, y + radius)
        for x in 0..<w {
            for c in 0..<3 {
                var m: UInt8 = 255
                for dy in lo...hi { m = min(m, rows[(dy * w + x) * 4 + c]) }
                out[(y * w + x) * 4 + c] = m
            }
        }
    }
    return out
}

func makeImage(_ buf: [UInt8], _ w: Int, _ h: Int) -> CGImage? {
    var copy = buf
    return copy.withUnsafeMutableBytes { ptr in
        CGContext(data: ptr.baseAddress, width: w, height: h, bitsPerComponent: 8,
                  bytesPerRow: w * 4, space: space, bitmapInfo: bitmapInfo)?.makeImage()
    }
}

func write(_ img: CGImage, to url: URL) -> Bool {
    guard let dest = CGImageDestinationCreateWithURL(url as CFURL, UTType.png.identifier as CFString, 1, nil) else { return false }
    CGImageDestinationAddImage(dest, img, nil)
    return CGImageDestinationFinalize(dest)
}

let args = CommandLine.arguments
guard args.count >= 4, let radius = Int(args[2]), radius >= 0 else {
    FileHandle.standardError.write("usage: swift trim_png.swift <outDir> <thicken> <png>...\n".data(using: .utf8)!)
    exit(2)
}
let outDir = URL(fileURLWithPath: args[1])

for path in args.dropFirst(3) {
    let name = (path as NSString).lastPathComponent
    guard let img = load(path), let buf = pixels(img), let box = contentBox(buf, img.width, img.height) else {
        print("\(name)\tblank"); continue
    }
    let pad = (max(box.width, box.height) * padFraction).rounded()
    var crop = box.insetBy(dx: -pad, dy: -pad).intersection(CGRect(x: 0, y: 0, width: img.width, height: img.height))
    let tight = crop.width >= Double(img.width) * tightFraction && crop.height >= Double(img.height) * tightFraction
    if tight { crop = CGRect(x: 0, y: 0, width: img.width, height: img.height) }
    let lines = isLineDrawing(buf, img.width, crop)
    let doThicken = radius > 0 && lines
    let cw = Int(crop.width), ch = Int(crop.height)

    if !tight || doThicken {
        guard var result = tight ? img : img.cropping(to: crop) else { print("\(name)\terror"); continue }
        if doThicken {
            guard let flat = pixels(result, onWhite: true),
                  let thick = makeImage(thicken(flat, cw, ch, radius), cw, ch) else { print("\(name)\terror"); continue }
            result = thick
        }
        if !write(result, to: outDir.appendingPathComponent(name)) { print("\(name)\terror"); continue }
    }
    print("\(name)\t\(img.width)\t\(img.height)\t\(cw)\t\(ch)\t\(tight ? 0 : 1)\t\(doThicken ? 1 : 0)\t\(lines ? "lines" : "colour")")
}
