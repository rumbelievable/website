// Crops the empty margin off PNG exports. Run by tools/trim_views.py; macOS only.
//
// Usage: swift tools/trim_png.swift <outDir> <png>...
//
// Content is any pixel that is neither transparent nor near-white, so it works on
// white and transparent backgrounds. The crop is the content's box plus 4% of its
// longer side on every edge. A cropped copy is written to <outDir> under the same
// name only when it saves at least 5% of the width or height; inputs are never
// modified. One tab-separated line per input on stdout:
//   name  W  H  w  h  trimmed|tight      (W x H original, w x h crop)
//   name  blank                          (no content found, or unreadable)
//   name  error                          (the crop could not be written)
import Foundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers

let padFraction = 0.04
let tightFraction = 0.95

func load(_ path: String) -> CGImage? {
    guard let src = CGImageSourceCreateWithURL(URL(fileURLWithPath: path) as CFURL, nil) else { return nil }
    return CGImageSourceCreateImageAtIndex(src, 0, nil)
}

func contentBox(_ img: CGImage) -> CGRect? {
    let w = img.width, h = img.height
    var buf = [UInt8](repeating: 0, count: w * h * 4)
    let drawn = buf.withUnsafeMutableBytes { ptr -> Bool in
        guard let ctx = CGContext(data: ptr.baseAddress, width: w, height: h, bitsPerComponent: 8, bytesPerRow: w * 4,
                                  space: CGColorSpaceCreateDeviceRGB(),
                                  bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue) else { return false }
        ctx.draw(img, in: CGRect(x: 0, y: 0, width: w, height: h))
        return true
    }
    if !drawn { return nil }
    var minX = w, minY = h, maxX = -1, maxY = -1
    for y in 0..<h {
        let row = y * w * 4
        for x in 0..<w {
            let i = row + x * 4
            let a = buf[i + 3]
            if a <= 8 { continue }                                         // transparent
            if a > 247 && min(buf[i], buf[i + 1], buf[i + 2]) > 240 { continue }  // near-white
            if x < minX { minX = x }; if x > maxX { maxX = x }
            if y < minY { minY = y }; if y > maxY { maxY = y }
        }
    }
    if maxX < 0 { return nil }
    // Buffer row 0 is the top of the image, matching CGImage.cropping(to:).
    return CGRect(x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1)
}

let args = CommandLine.arguments
guard args.count >= 3 else {
    FileHandle.standardError.write("usage: swift trim_png.swift <outDir> <png>...\n".data(using: .utf8)!)
    exit(2)
}
let outDir = URL(fileURLWithPath: args[1])

for path in args.dropFirst(2) {
    let name = (path as NSString).lastPathComponent
    guard let img = load(path), let box = contentBox(img) else { print("\(name)\tblank"); continue }
    let pad = (max(box.width, box.height) * padFraction).rounded()
    let crop = box.insetBy(dx: -pad, dy: -pad).intersection(CGRect(x: 0, y: 0, width: img.width, height: img.height))
    let cw = Int(crop.width), ch = Int(crop.height)
    let tight = Double(cw) >= Double(img.width) * tightFraction && Double(ch) >= Double(img.height) * tightFraction
    if !tight {
        guard let cropped = img.cropping(to: crop),
              let dest = CGImageDestinationCreateWithURL(outDir.appendingPathComponent(name) as CFURL,
                                                         UTType.png.identifier as CFString, 1, nil) else {
            print("\(name)\terror"); continue
        }
        CGImageDestinationAddImage(dest, cropped, nil)
        if !CGImageDestinationFinalize(dest) { print("\(name)\terror"); continue }
    }
    print("\(name)\t\(img.width)\t\(img.height)\t\(cw)\t\(ch)\t\(tight ? "tight" : "trimmed")")
}
