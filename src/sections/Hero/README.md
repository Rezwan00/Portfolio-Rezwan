# Header + Hero — Phase 4.1

App renders Header and a main landmark containing Hero. The existing Phase 2
tokens and primitives remain unchanged. The approved Phase 3.5 composition and
supplied stylized bust now have a scoped GSAP motion system.

## Composition and layers

- Near-black surface, oversized Archivo Black name, transparent bust, then small
  foreground content. The Header sits above the Hero's isolated stacking context.
- One semantic h1: REZWAN with a visually hidden Qaderi suffix. There are no
  duplicated decorative word layers.
- The bust intersects the lower W/A region. Its purple/chrome ring supplies the
  main accent; surrounding interface elements remain black, white, and gray.
- Role and statement stay at lower left; disciplines and the white CTA stay at
  lower right on desktop. The intro is aligned above the central-left name area.
- Only the desktop visual is absolute. Foreground text retains intrinsic grid
  sizing. The portrait has no card, border, circle, background panel, or shadow.

## Responsive composition

- Below 600px: name and right-offset bust form one overlapping visual group.
  Bust width is 240–310px, followed by a tighter role/statement group and CTA
  group. A flexible final row holds the lower-edge metadata, instead of stretching
  all vertical gaps equally. Very small screens may grow beyond one viewport.
- 600–1199px: eight-column intermediate layout; portrait remains in flow with
  a 320–460px width governed by viewport height as well as width. Supporting
  text and CTA occupy opposing columns below it.
- From 1200px: twelve-column composition. Name remains about 19.25vw, capped
  at 22rem. Portrait width uses clamp(380px, min(34vw, 56svh), 560px): roughly
  490px at 1440x900, and 430px at 1366x768. Height derives from the actual ratio.
- Header navigation appears from 768px; smaller screens retain the prepared MENU.

## Source asset and optimization

Source: src/assets/portrait/rezwan-hero.png (1536x1024, 1,647,123 bytes).
Production: src/assets/portrait/rezwan-hero.webp (945x1020, 267,604 bytes).

The source PNG is untouched. scripts/optimize-hero.py removes near-transparent
outer padding, retaining an eight-pixel margin around the visible subject.
The source has stray alpha values of 1–2 at its outer canvas edges, so the
subject bounds use alpha > 4. The retained pixels are not resized or flattened.
WebP uses quality 95 and lossless alpha: 83.8% smaller than the PNG.
The script reopens the result and verifies the retained alpha channel is exact.

To regenerate after replacing the source, run:

    python scripts/optimize-hero.py

This optional asset-authoring step requires Pillow. Python/Pillow are not web
application dependencies and are not needed for npm install, dev, or build.
If a new source produces a different crop ratio, update the img width/height
and the aspect-ratio in Hero.css to match the script's reported dimensions.

HeroPortrait imports the WebP directly, so Vite fingerprints it for production.
The PNG is not emitted in the application bundle. The image uses eager loading,
fetchPriority=high, decoding=async, explicit intrinsic dimensions, and
object-fit: contain. The wrapper reserves the matching aspect ratio. It is
non-draggable, non-selectable, and has pointer-events: none. The visual remains
decorative with empty alt text and an aria-hidden wrapper; identity is supplied
by the h1 and surrounding text.

## Motion and interaction

`useHeroMotion` owns one entrance timeline, scoped to App's Header + Hero wrapper.
Plugin registration lives in `src/lib/gsap.ts`. `useGSAP` and `gsap.matchMedia`
revert animations, ScrollTriggers, and event listeners on unmount or preference
changes. Breakpoint changes settle the composition without replaying it.

The name begins at 0.32s with an 0.85s masked `power4.out` reveal. The portrait
starts at 0.48s, overlapping the name: y 105px, scale 0.8, rotation 4 degrees,
and opacity zero, returning to the static composition over 1.05s. Supporting
content retains the quieter Phase 4 timing. Total entrance is 2.15s on desktop.
Below 1024px, the timeline runs at 1.18× speed (about 1.82s), with portrait
y 55px, scale 0.88, and no rotation.

Layout, scroll, pointer, and entrance use separate nested layers. The whole-word
mask has compensating ink allowance, so the tight line box and final position
stay unchanged. Portrait centering remains independent of animated transforms.

After entrance, fine mouse pointers at 1024px and above drive `quickTo` motion:
portrait ±16px/±10px/±0.75 degrees, name ±5px/±3px in the opposite direction.
Leaving the Hero or window resets this depth. Native ScrollTrigger uses the
Hero's own height with no pinning or spacer. Phase 5 adds a subtle supporting-copy
fade as the warm-white Capabilities surface enters. Mobile scroll motion is
deliberately lighter; the approved Hero entrance and composition are unchanged.

Reduced-motion preference skips all JS motion and is observed live. No content
is hidden in CSS. Keyboard focus completes an unfinished entrance immediately.
The scroll arrow moves just 4px; CTA arrow hover uses CSS. No portrait float,
Lenis or loading screen is present.

ABOUT now targets Capabilities at `#about`; the other header links and CTA still
target future sections. MENU is focusable and explicitly unavailable until its behavior
is implemented. The scroll cue is decorative. Existing focus-visible,
reduced-motion, and simple CSS hover states remain intact.

## Phase 3.5 verification

- TypeScript, ESLint (zero warnings), and production build passed.
- Visually reviewed 1440x900, 1366x768, 390x844, 375x812, and 1920x1080.
- Additional layout measurements at 320, 430, 768, and 1024px found no horizontal
  overflow and no portrait/copy/CTA bounding-box collisions.
- All three desktop sizes fit their viewport height; mobile is allowed to grow.
- Browser confirmed the WebP loads at its natural 945x1020 dimensions, with
  object-fit: contain, eager loading, and high fetch priority.
- Transparency was visually checked over the black Hero; the alpha channel was
  compared programmatically against the retained source crop and was unchanged.
- Face, hair, sunglasses, and the chrome/purple ring remain clear at display size.
- One h1 and the data-hero-visual target remain. Browser console had no errors
  or warnings after loading the new asset.

The portrait/name overlap and supplied bust's lower cut edge remain unchanged.
Any future increase in motion ranges should recheck clearance to copy and CTA.

## Stage B interaction refinement — 2026-10-10

The existing composition, entrance sequence/timings, scroll transforms, artwork,
halo geometry/material/lights and navigation are retained. Work was not edited
in this pass.

- The shared pointer sampler gates DOM and WebGL input until the portrait
  finishes its entrance (timeline time 1.53s, respecting the compact speed).
  Newly mounted subscribers receive the current sample immediately. Portrait
  and word ranges remain 16/10px and opposite 5/3px respectively.
- Halo damping is frame-rate independent with a coefficient of 5, closer to
  the existing DOM settling time. Its existing slow idle drift is attenuated
  while following input and as Hero leaves view. It settles to neutral before
  the offscreen Canvas pauses. No new geometry or scene was introduced.
- The primary CTA uses a new inner `hero__cta-magnet` wrapper. Fine desktop
  mouse input moves it at most 6px horizontally / 4px vertically, after the
  entrance completes. The outer hit area, entrance and scroll wrappers remain
  independent. Keyboard focus snaps it to neutral; exit/cancel, scroll, resize,
  blur and tab hiding reset it. Mobile and reduced motion do not register it.
- The existing original `rezwan-hero.webp` composite was already correctly used
  for mobile, reduced motion, loading and failure states, so it is preserved.
  SHA-256 remains `89D32EB19F9C3B1B3B34D827F8C4DE2BB211D3B3F24CE104654B28D279FB6442`.
  Enhanced mode retains `rezwan-portrait-only.webp` with the WebGL halo.
- The mobile dock starts hidden/inert and resolves visibility before paint,
  removing the initial flash. It stays out of Hero until 80px beyond its edge,
  hides immediately on reverse scroll, and removes hidden links from keyboard
  navigation. Its existing Contact exclusion remains. Desktop keyboard focus
  completes the dock entrance immediately. Hidden border animation pauses.
- DPR caps, adaptive material quality, lazy loading, context-loss fallback and
  Canvas offscreen/page-visibility pausing remain. The existing scroll arrow
  now also pauses when the tab is hidden.

### Verification and remaining limit

Run `node --test scripts/hero-interactions.test.mjs` for deterministic behavior
checks: shared input/lifecycle, CTA limits and focus reset, static quality tiers,
real halo damping at simulated 30/60/120Hz, and dock mobile/desktop/reverse states.
The checks execute the source with simulated DOM events and real GSAP/Three.js
math; they do not render a browser or measure GPU FPS.

TypeScript, ESLint and the normal production build pass. The existing large lazy
Three.js chunk warning remains. No dependency was added. Browser automation
still fails at startup with a local sandbox-helper error, so fresh responsive
screenshots, WebGL initialization/context-loss checks, browser console and FPS
measurements for Stage B remain unverified. Earlier visual QA above is historical.
Use the local production preview to review this pass before deployment.
The retained local QA entry also includes a “Hero inspect” control; it is excluded
from normal production builds.

### Final interaction quality pass — 2026-10-10

No production animation or layout change was warranted by the source review and
deterministic checks. Expanded `scripts/hero-interactions.test.mjs`; all seven
tests pass. Added slow samples/rapid pointer reversals and queued-input exit,
quality policy at widths 320/375/390/430/768/1024/1280/1440/1920, Canvas visibility
and context-failure lifecycle, and actual Work GSAP tween forward/reverse/jump
checks using simulated flow geometry at viewport heights 768/900/1024/1080.
These are behavior checks, not rendered viewport tests or FPS measurements.

TypeScript, ESLint, production build and whitespace checks pass. The production
preview returns HTTP 200 and matches the current build. The original composite
hash is unchanged. No production diagnostics were found; useful standalone QA
entries remain excluded from the normal build. Work and Hero production code
were left unchanged during this pass.

Browser automation still fails before connecting because the Windows sandbox
helper cannot start. Fresh desktop/mobile visual checks, keyboard traversal,
layout-shift/flicker assessment, real WebGL failure appearance, browser console
and GPU/scroll performance remain pending. The existing 939 kB (255 kB gzip)
lazy halo chunk warning remains. The disabled mobile menu is a separate known
usability task; navigation was not changed.
