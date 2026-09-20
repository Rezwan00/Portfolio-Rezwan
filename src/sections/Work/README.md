# Selected Work — Phase 6.6

The existing section introduction, portfolio typography, surfaces, header,
Hero, and Capabilities are preserved. No later homepage sections are added.

## Composition and content

- **Rayleigh × MVTRX:** MVTRX spans nine of twelve desktop columns (75%);
  the exchange overlaps its lower-right edge, while the smaller Rayleigh image
  supplies context at lower left. Attribution is Software Engineer, with no
  claim of sole product authorship.
- **LightningChart × Dashtera:** LightningChart sits to the right beside the
  role/discipline metadata. Dashtera appears below on the opposite side.
- **Selected Web:** Sorrento leads with a wide photograph; Alexis pairs a
  left-side title with a right-side image; Xorbix reverses the image/copy balance.
  The gallery includes only the three supplied sites and contribution labels.

## Phase 6.6 polish

The flagship composition and section intro are unchanged. LightningChart retains
its offset family composition, with attribution now centered beside the first
image. Its grid row gap is 32px instead of 48px; removing Dashtera's extra 24px
desktop margin reduces the inter-image layout gap from 72px to 32px. Existing
small scroll translations remain independent of this static layout spacing.

Selected Web now has three clearer scales: Sorrento spans eleven desktop columns
(previously ten) with no screenshot border; Alexis spans seven (previously eight)
and sits farther right, opposite its grouped title and metadata; Xorbix keeps
its eight-column image and top-aligned 2.6:1 crop, with grouped copy centered
beside it. Factual descriptions and project names remain unchanged.

Gallery gaps now use clamp(48px, 6vw, 96px), replacing clamp(64px, 8vw, 140px).
The transition into Selected Web and the end padding use the compact section
spacing token (64–140px), while the flagship-to-LightningChart gap keeps the
larger token. At 1440px, total Work height changed from approximately 5795px to
5431px: 364px shorter without altering the flagship.

Mobile uses title / metadata / image in both DOM and visual order. Tablet keeps
wide images, pairs title and metadata above them, and uses a greater Alexis
offset. Each title/metadata group reveals together instead of as two independent
items. No timing, easing, image-depth amplitude, or new effect was added.

Preference-toggle QA exposed a ScrollTrigger nested-refresh error when completed
once-triggers were recreated. The Work hook now skips entrance setup for already
revealed/visible content, preserving its static state while recreating only the
needed desktop depth. This fixes restoration from reduced motion without changing
the entrance sequence for unseen content. Reduced motion and unmount leave zero
ScrollTriggers; reverse scrolling preserves content. Temporary QA fixtures were
removed.

No assets were regenerated and no dependencies added. Responsive `sizes` hints
were adjusted for Sorrento and Alexis; WebP files, srcsets, dimensions, alt text,
lazy-loading behavior, and the nondestructive Xorbix crop remain intact. A browser
may choose a larger existing Sorrento candidate for the wider presentation.

Phase 6.6 modifies only `Work.css`, `SelectedWeb.tsx`, `useWorkMotion.ts`, this
README, and the root README. Hero, Capabilities, Header, design tokens, and
project content are untouched. All nine requested sizes were visually inspected
and checked for overflow, clipped text, image/text collisions, aspect ratios,
mobile ordering, and crop consistency; those checks passed.

Final Phase 6.6 TypeScript, ESLint (zero warnings), and production build passed.
The production browser console has no new errors or warnings. Direct `#work`
loading and refresh land at the section start. Native scrolling in both directions
correctly changes the header between Capabilities and Work. All eight production
images load and all reveals finish after a fast scroll to the end. No later phase
has been started.

There are no screenshot links, speculative routes, fake buttons, or coming-soon
messages. Content lives in `src/data/projects.ts`; the three compositions remain
separate components, with shared headings, attribution, and media rendering.

## Asset optimization

`scripts/optimize-work.py` uses Pillow WebP quality 94, method 6. Main images keep
the original dimensions. The script also creates 960px and 1600px variants and
a generated Vite import manifest. Original SHA-256 hashes are stored in
`src/assets/work/optimization.json` and were verified unchanged after processing.

| Image | Dimensions | Original KB | Full WebP KB |
| --- | --- | ---: | ---: |
| Rayleigh | 2537 × 892 | 1758.8 | 242.2 |
| MVTRX site | 2526 × 1296 | 1454.7 | 95.2 |
| MVTRX exchange | 2556 × 1302 | 423.8 | 247.3 |
| LightningChart | 2532 × 1300 | 1582.7 | 293.3 |
| Dashtera | 2541 × 1127 | 1031.8 | 201.5 |
| Sorrento | 2540 × 1121 | 3164.0 | 411.8 |
| Alexis Dindal | 2542 × 1302 | 2710.2 | 229.8 |
| Xorbix | 2542 × 1302 | 1973.4 | 176.4 |

Decimal totals: **14.10 MB → 1.90 MB** for all eight full-size images,
an **86.5% reduction**. The complete 960px set is **489 KB**. Browsers select
one candidate per image using `srcset` and composition-specific `sizes`.
No screenshot was recolored, distorted, or recreated.

Xorbix deliberately uses a top-aligned 2.6:1 CSS crop to exclude the captured
cookie notice and following section. Its source and production WebP remain
uncropped. Every other image displays at its original aspect ratio.

The first MVTRX image loads eagerly for direct `#work` navigation. Remaining
images load lazily and decode asynchronously. Explicit dimensions reserve
layout space. No new runtime dependency was introduced.

## Motion and accessibility

Existing scoped GSAP/useGSAP/ScrollTrigger infrastructure handles once-only
heading and image reveals. Images settle from scale 1.035 on desktop (1.01 on
smaller screens). Desktop depth uses small vertical translations (8–18px in
each direction) with separate transform wrappers for entrance and scroll.
There is no pinning, rotation, pointer effect, horizontal scrolling, or scroll
replacement. Revealed items stay revealed on reverse scrolling and breakpoint
changes. GSAP matchMedia/context and explicit focus-listener cleanup cover
unmounting and changing media preferences.

Reduced motion presents the complete static layout, including when the setting
changes live. Each image has useful alt text, semantic figures/captions, explicit
dimensions, and no unnecessary focus target. Heading levels and definition lists
preserve the content hierarchy. A retained video media option uses native controls
and supports captions; no videos are introduced in this phase.

## Responsive behavior

- Below 768px: wide single-column media, no overlapping screenshots. Rayleigh
  shows metadata then MVTRX/exchange/origin; LightningChart shows its first image,
  metadata, then Dashtera; each client entry shows title, metadata, image.
- 768–1199px: broad images with shallow alternating offsets and no overlap.
- From 1200px: full editorial composition, intentional flagship overlap, and
  restrained image depth.

## Files

Created: `RayleighShowcase.tsx`, `LightningChartShowcase.tsx`, `SelectedWeb.tsx`,
this README, `scripts/optimize-work.py`, eight full WebPs, sixteen responsive
WebPs, `src/assets/work/images.ts`, and `src/assets/work/optimization.json`.

Modified: `Work.tsx`, `Work.css`, `ProjectShowcase.tsx`, `ProjectMedia.tsx`,
`useWorkMotion.ts`, `src/data/projects.ts`, and the root README.

## Verification

Responsive geometry checked at 320×568, 375×667, 390×844, 430×932, 768×1024,
1024×768, 1280×800, 1440×900, and 1920×1080. No horizontal overflow, off-screen
headings, screenshot/text collisions, or unintended aspect-ratio changes.
Desktop, ultrawide, tablet, and mobile compositions were visually inspected.

Live reduced-motion testing left all Work content visible, with no media curtains
or transforms and zero ScrollTriggers. StrictMode unmount testing returned
ScrollTrigger count to zero. Mobile removes desktop media translations.
Fast scrolling to the bottom completed all reveals; reverse scrolling preserves
the revealed imagery. Temporary QA controls are removed from the delivered app.

Final `npm run typecheck`, `npm run lint` (zero warnings), and `npm run build`
all passed. The built site was served with Vite preview on port 4173. All eight
images loaded successfully; the fresh production browser console had no errors
or warnings. Initial `#work`, refresh at that hash, and Work/About/Home navigation
were verified. The header correctly switches dark/light/dark across those
sections. Hero and Capabilities remain intact.

There are no scope deviations. The deliberate Xorbix presentation crop and
desktop-to-tablet breakpoint at 1200px are composition choices described above.
Review the flagship overlap and the final Xorbix crop in the local preview before
Phase 7; no later phase was implemented.
