"""Regenerate the web portrait from its untouched PNG source (requires Pillow)."""
from pathlib import Path

from PIL import Image, ImageChops

root = Path(__file__).resolve().parents[1]
source = root / "src/assets/portrait/rezwan-hero.png"
output = source.with_suffix(".webp")

with Image.open(source) as original:
    rgba = original.convert("RGBA")
    alpha = rgba.getchannel("A")
    # The source has stray alpha values of 1–2 at the canvas edges. Find the
    # visible subject, then retain an 8px safety margin around hair/material.
    bounds = alpha.point(lambda value: 255 if value > 4 else 0).getbbox()
    if bounds is None:
        raise ValueError("The source portrait is fully transparent.")
    left, top, right, bottom = bounds
    crop = (
        max(0, left - 8), max(0, top - 8),
        min(rgba.width, right + 8), min(rgba.height, bottom + 8),
    )
    portrait = rgba.crop(crop)
    # No resizing. High-quality RGB compression with lossless alpha.
    portrait.save(output, "WEBP", quality=95, method=6, alpha_quality=100)
    with Image.open(output) as encoded:
        if ImageChops.difference(portrait.getchannel("A"), encoded.getchannel("A")).getbbox():
            raise ValueError("WebP encoding changed the retained alpha channel.")
        print(f"Source: {rgba.size}, {source.stat().st_size:,} bytes")
        print(f"Crop: {crop}; output: {encoded.size}, {output.stat().st_size:,} bytes")
        print(f"Alpha: {encoded.getchannel('A').getextrema()} (unchanged after encoding)")
        print(f"Reduction: {1 - output.stat().st_size / source.stat().st_size:.1%}")
