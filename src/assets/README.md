# Asset architecture

These directories reserve space for real assets. The .gitkeep files preserve
empty directories; remove them when adding content. The supplied Hero PNG is
preserved alongside an optimized WebP; no additional artwork has been generated.

- branding/: future rq-mark.svg, rq-3d.[format]; RQBrand is currently live text.
- decorative/: engineering/, design/, product/, web/ artwork.
- fonts/: font loading notes and space for future local licensed font files.
- images/: shared images that do not belong to a specific project.
- portrait/: supplied rezwan-hero.png and production rezwan-hero.webp. Regenerate
  the WebP with scripts/optimize-hero.py (Python + Pillow); see the Hero README.
- projects/: mvtrx/, lightningchart/, bamboo/, web-work/ project assets.
- textures/: future approved texture assets.

Import assets from src so Vite can fingerprint and optimize their delivery.
Use public/ only for files that require stable paths. Provide meaningful alt text
for informative imagery, empty alt text for decorative imagery, and captions or
accessible alternatives for video where needed. MediaFrame does not provide
image alt text automatically.
