# Hero and Work motion pass

The existing design, assets, content, section order and Hero entrance remain.
Capabilities, Experience and Contact animation hooks were not changed.

## Stage A — Work

- Five selective handoffs: MVTRX website → exchange, Rayleigh → LightningChart,
  Dashtera → Selected Web, Sorrento → Alexis, and Alexis → Xorbix.
- Only individual media or a compact gallery entry can hold; no complete
  showcase is pinned. Holds span 120–320px of existing native scrolling and
  add no scroll distance (`pinSpacing: false`).
- Outgoing media scales to 94% and recedes in opacity. Incoming compositions
  retain their own layout. Gallery metadata lifts with its image to remain
  clear of the advancing chapter edge.
- Runs from 1024px width / 700px height only when the held element occupies
  at most 78% of the viewport height. Re-evaluated after resize/font settling.
- Interactive media/entries are excluded from holds. Existing native links,
  image alt text, source ratios and image loading strategy remain intact.
- Existing curtain reveals and inner image parallax remain separate transform
  owners. Reduced motion removes the handoffs entirely.

## Stage B — Hero

- One shared pointer sampler now drives the existing GSAP DOM wrappers and
  R3F mesh targets. Input is sampled once per animation frame with no React
  state changes. Exit, cancel, blur, scrolling and 1.8 seconds of inactivity
  return both systems to neutral. Pointer influence diminishes as Hero exits.
- The glass halo retains its geometry/material; idle drift is slower and
  smaller. GSAP still owns the unchanged entrance/scroll choreography.
- Supported enhanced devices use `rezwan-portrait-only.webp` plus WebGL.
  Loading, mobile, reduced motion, weak devices and failures use the untouched
  original `rezwan-hero.webp` composite. The fallback is hidden only when the
  portrait has decoded and the Canvas has rendered.
- DPR remains capped at 1.5, with the existing cheaper material tier and
  offscreen/hidden-document pausing.
- Removed production shader interception and FPS/DOM diagnostics. Retained
  the isolated `halo-qa` entry and added a separate motion review entry.
- On mobile the contact dock stays hidden while Hero is visible; it returns
  after Hero exits and retains its existing Contact-section exclusion. The
  Hero CTA remains available throughout. No Contact animation was changed.

## Verification and local QA

`motion-review.html` is a separate local QA entry, never imported by the app.
It offers native-scroll handoff/reverse controls, RAF frame sampling, renderer
draw counters, pointer sweeps, context-loss and lifecycle checks. Its
`?reduced` variant emulates the JavaScript reduced-motion preference; global
CSS reduced-motion rules remain as before. Hide/show controls simulate page
visibility changes. This is not a substitute for physical-device profiling.

For production-mode QA: `npx vite build --config halo-qa.config.ts`, then
`npm run preview`. Open `/Portfolio-Rezwan/motion-review.html`.
Always run the normal `npm run build` afterward: it excludes all QA pages.

Verified 320×568, 375×667, 390×844, 430×932, 768×1024, 1024×768,
1280×800, 1440×900 and 1920×1080 for overflow and responsive tiers.
Desktop forward/reverse scroll and pointer sweeps measured about 60 FPS
(scroll RAF p95 around 16.8ms in this browser). Renderer draw counts stopped
offscreen and during simulated hidden-tab state. Context loss restored the
composite; reduced-motion mode had zero ScrollTriggers/Canvas; unmount left
zero ScrollTriggers. These are local-browser observations, not universal GPU
performance guarantees.

Final TypeScript, ESLint and normal production build passed. The clean
production preview had no observed console errors/warnings during navigation,
Hero rendering and Work scrolling. The intentional context-loss test was run
separately. Native keyboard Tab focus retained its visible outline.

## File inventory

Modified:

- `src/sections/Work/ProjectMedia.tsx`
- `src/sections/Work/Work.css`
- `src/sections/Work/useWorkMotion.ts`
- `src/sections/Hero/HeroPortrait.tsx`
- `src/sections/Hero/useHeroMotion.ts`
- `src/sections/Hero/HeroHalo/GlassHalo.tsx`
- `src/sections/Hero/HeroHalo/HeroHalo.css`
- `src/sections/Hero/HeroHalo/HeroHaloCanvas.tsx`
- `src/sections/Hero/HeroHalo/useHaloInteraction.ts`
- `src/components/ContactDock/useContactDockMotion.ts`
- `halo-qa.tsx`
- `halo-qa.config.ts`

Created:

- `src/sections/Hero/heroPointer.ts`
- `motion-review.html` and `motion-review.tsx`
- `MOTION_REVIEW.md`
- Review screenshots under `artifacts/motion-review/`.

## Separate usability task

The mobile Header MENU remains `aria-disabled="true"` and does not open a
menu. Its explanatory text is outdated now that the remaining sections exist.
Implement accessible mobile navigation separately, with keyboard focus,
Escape/close behavior and the existing section links. This pass intentionally
does not redesign or enable navigation.

## Remaining limits

- No locally available reference recordings were used; this implements the
  agreed catalog/depth concepts within the existing compositions.
- The lazy Three.js/R3F chunk still triggers Vite's 500KB minified-size warning
  (approximately 255KB gzip). No dependency was added by this pass.
- Sticky overlap is deliberately absent on mobile, reduced-motion and
  non-fitting layouts; the original editorial presentation remains there.
