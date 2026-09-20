# Rezwan Qaderi — Portfolio

React + Vite + TypeScript. The homepage now contains the full chapter set:
**Header + Hero + Capabilities + Selected Work + Experience + Contact +
Footer** (Phase 8), with the supplied stylized bust, eight real project
screenshots, and GSAP motion.
It builds on the Phase 2 design system and approved Phase 3.5 composition.
Capabilities introduces the warm-white editorial chapter at `#about`.
Selected Work presents three distinct editorial showcases at `#work`.
Experience is a restrained career index at `#experience`. Contact closes the
page at `#contact` with an editorial callback to the Hero, and the Footer
adds a minimal utilitarian baseline with a Back to Top control.
No 3D dependencies have been added.

## Requirements

- Node.js 24.13 or newer (Node.js 24 LTS recommended)
- npm (included with Node.js)

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite, usually http://localhost:5173.
Stop the server with Ctrl+C. Use `npm ci` for reproducible installations.

## Verify and build

```sh
npm run typecheck
npm run lint
npm run build
npm run preview
```

The build command checks TypeScript and creates `dist/`. Preview serves that
production build locally; it is not a production server.

## Current architecture

```text
src/
  assets/                 Portrait, self-hosted fonts, and responsive Work WebPs
  components/
    Header/               Layered RQ mark, desktop navigation, mobile MENU
    Footer/               Minimal RQ/name/location baseline and Back to Top
    Button/               Button and LinkButton
    MediaFrame/
    RQBrand/
    Section/
    SectionHeading/
    VisualPlaceholder/
  sections/
    Hero/
      Hero.tsx            Semantic composition and separate motion layers
      Hero.css            Local responsive layout and layering
      HeroPortrait.tsx    Eager, high-priority transparent bust image
      useHeroMotion.ts    Scoped entrance, pointer depth, and native scroll depth
      README.md           Portrait replacement and implementation notes
    Capabilities/
      Capabilities.tsx    Multidisciplinary statement and four editorial rows
      Capabilities.css    Warm-white surface and responsive typography
      useCapabilitiesMotion.ts  Surface transition and scoped scroll reveals
    Work/
      Work.tsx            Preserved section intro and three showcase compositions
      RayleighShowcase.tsx       Layered product ecosystem
      LightningChartShowcase.tsx Offset dual-product presentation
      SelectedWeb.tsx     Alternating three-site editorial gallery
      ProjectShowcase.tsx Shared project heading and attribution
      ProjectMedia.tsx    Responsive, accessible image/video frame
      useWorkMotion.ts    Scoped reveals and small desktop image translations
      README.md           Asset inventory, optimization, behavior, and QA results
    Experience/
      Experience.tsx      Career index driven by data/experience.ts
      Experience.css      Restrained dark, typography-led layout
      useExperienceMotion.ts   Scoped once-only row reveals
    Contact/
      Contact.tsx         Editorial closing statement and mailto CTA
      Contact.css         Asymmetric layout echoing the Hero's proportions
      useContactMotion.ts Scoped title-mask and reveal entrance
  styles/                 Fonts, tokens, reset, typography, utilities, global entry
  lib/gsap.ts              GSAP, ScrollTrigger, and React hook registration
  data/
    projects.ts           Project identity, attribution, and real media
    experience.ts         Career entries rendered by Experience
  hooks/useInitialAnchor.ts     Initial hash navigation after React/font layout
  pages/                  Reserved
  App.tsx                 Header + main (Hero…Contact) + Footer
  main.tsx                React entry point
```

## Contact

Contact (`#contact`) closes the page with a two-line editorial statement,
short copy, and a `mailto:` CTA as the primary contact method — no contact
form. Secondary professional links (LinkedIn/GitHub) are intentionally
omitted: no verified URLs for either exist in this repository yet. The
placeholder email in `Contact.tsx` is marked `TODO(Rezwan)` and must be
replaced with a verified address before launch. A thin, cropped SVG arc in
the corner echoes the Hero portrait's orbital ring without repeating it.

The original portrait PNG is preserved, and the Hero loads an optimized WebP.
The full-body placement guide has been removed. See
[Hero notes](./src/sections/Hero/README.md) for composition, asset optimization,
and future replacement instructions.

ABOUT links to Capabilities and WORK links to Selected Work. The other links and CTA target future
section IDs. MENU is a focusable, explicitly unavailable button
until mobile navigation is implemented. The scroll cue is visual only.

Archivo Black and Inter are self-hosted through Fontsource. Existing tokens
and primitives are documented in [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md).
The temporary Phase 2 preview has been removed. Motion uses `gsap` and
`@gsap/react`; no smooth-scroll library is installed.

The Hero-to-Capabilities transition uses native scrolling: the Hero's existing
layers separate, supporting content recedes, and the incoming surface rises
24px on mobile or 48px on desktop. There is no pinning or artificial spacer.
Capabilities reveals its heading and discipline rows once, and observes reduced
motion live. Without motion, its content is visible in its final layout.

Work uses full-resolution WebP screenshots plus 960px/1600px responsive variants.
The originals in `reference-assets/` remain untouched. See [Work notes](./src/sections/Work/README.md)
for the optimization report and responsive behavior. Regenerate assets with
`python scripts/optimize-work.py` using Python with Pillow installed; Python is
only an asset preparation tool, not a runtime or build dependency.
