# Phase 2 visual foundation

This document records the reusable visual foundation established in Phase 2.
Phase 3 has replaced the specimen sheet with Header and Hero. The primitives
and token system remain available; the historical Phase 2 inventory is below.

## Styling and themes

src/styles/global.css imports fonts, tokens, reset, typography, and utilities
in that order. Component CSS is colocated with its component. The temporary
preview.css was removed in Phase 3; Hero-specific CSS lives with Hero.

The full requested palette, accent gradient, font weights, fluid type sizes,
spacing scale, radii, thin borders, restrained shadows, and motion values live
in tokens.css. The gradient and shadows are defined but not applied to the
preview. No animation libraries are installed.

Theme names refer to the surface: dark means light text on black; light means
dark text on warm white. Section sets the surface and semantic aliases:
--surface, --surface-raised, --foreground, --muted, --border-color,
--border-subtle, --contrast-surface, and --contrast-text. Other primitives
inherit them. RQBrand and VisualPlaceholder also accept an explicit theme.

Use typography classes to control visual size independently of heading
semantics: display-xl, display-lg, display-md, type-h1, type-h2, type-h3,
body-lg, body, text-small, label, text-muted. Use actual h1–h6 elements based
on document hierarchy, not the desired size. Display line-height is 0.92;
body line-height is 1.65. Long words can wrap instead of overflowing.

## Layout conventions

- .container: centered border-box maximum of 1600px, including fluid gutters.
- .container.container--wide: maximum 1840px with the same gutters.
- .container.container--full: no maximum and no gutters.
- .editorial-grid: four equal columns by default, eight at 768px, twelve at
  992px. All tracks use minmax(0, 1fr). Choose spans in the consuming layout.
- Common CSS breakpoints: 480, 768, 992, 1200, 1440px. Use only what a layout
  needs; there is no JavaScript breakpoint system.
- Section space: 96–220px default; 64–140px compact. Page gutters: 20–72px.

Do not suppress page overflow globally to conceal layout bugs. Section
overflow defaults to visible so focus outlines and expressive text stay intact.
Opt in to hidden or clip only for a visual container that requires it.

## Primitives

Import directly from each component folder; named exports and props types are
available from the same TSX file.

| Component | Main props | Notes |
| --- | --- | --- |
| Section | theme, spacing, overflow | Semantic section; accepts native attributes including aria-labelledby. |
| SectionHeading | eyebrow, title, description, align, level, size, titleId | Defaults to h2; size is default, large, or xl. Title supports React nodes and deliberate line breaks. Description expects phrasing content. |
| Button | variant, size, iconStart, iconEnd | Native button, default type=button; standard disabled and event props. |
| LinkButton | href, variant, size, iconStart, iconEnd, disabled | Native anchor for local paths, hashes, or external URLs. New tabs add noopener/noreferrer; label external links clearly. |
| RQBrand | size, theme | Temporary text monogram. Small, medium, large; inherits surrounding theme by default. |
| VisualPlaceholder | label, aspectRatio, theme | Minimal surface and label; no invented media. |
| MediaFrame | aspectRatio, radius, fit | Radius: none/xs/sm/md/lg/xl. Fit: cover/contain. Supports img, picture, video children. |

Button variants: primary, secondary, outline, text. Sizes: small, medium, large.
Icons are decorative; provide visible text or an aria-label for an icon-only
use. Internal links are ordinary anchors; no router has been added. Disabled
links have no href, expose aria-disabled, leave the tab order, and suppress
their click callback. Disabled buttons use the native disabled attribute.

MediaFrame deliberately clips visual content; focus outlines on any future
interactive descendants are inset. Supply alt text on img and accessible video
controls/captions at the call site. MediaFrame itself is a non-semantic div;
wrap it in a figure with figcaption when appropriate.

## Accessibility and interaction

Global focus-visible outlines use a 2px purple ring with 4px offset. Purple
has at least 3:1 contrast against both primary surfaces; regular small text
uses the neutral foreground/muted colors, not accent purple on light surfaces.
Buttons have minimum heights of 44, 48, and 56px. Focus is not removed.

Use .text-link for understated inline/navigation-style link states.
Motion tokens govern simple color/border transitions only. Reduced-motion
preferences reduce transitions and animations to near-zero, and scrolling
remains native with no global smooth scrolling. Forced-colors button borders
are preserved. Avoid using color alone to convey a state.

The preview uses one h1, labeled sections, h2 specimen-group headings, h3
subheadings, and a polite status message for button test interactions.

## Fonts

See src/assets/fonts/README.md. Archivo Black uses font-weight 400 because
the typeface already contains its black design at that weight; the general
--font-weight-black token remains 900 for Inter or future families.
Both fonts are loaded as self-hosted WOFF2 via centralized @font-face rules
with font-display: swap. No remote font requests are made.

## Homepage handoff

Visually review the display scale/tracking, black and warm-white contrast,
button shapes, section spacing, and the 32px media-frame corners.
Phase 3 removed the preview App content, preview.css, the temporary noindex
meta tag, and the preview page title. Reusable tokens, layout utilities, and
primitives remain. The body's minimum width now accommodates scrollbar gutters
at a 320px viewport; this is the only Phase 3 change to shared styling.

## Phase 2 verification

- TypeScript, ESLint (zero warnings), and production build: passed.
- Full visual inspections: 390, 768, 1440, and 1920px.
- Overflow measurements: zero at 375, 390, 430, 768, 1024, 1280, 1440, 1920px.
- Observed four/eight/twelve-column grids and 1600/1840px container caps.
- Keyboard focus: visible 2px purple outline with 4px offset on both themes.
- Enter activates buttons; internal links reach their destination. Disabled
  controls are skipped by Tab; disabled anchors have no href and tabindex=-1.
- External new-tab links include noopener/noreferrer and accessible labels.
- Browser console: no warnings or errors during inspection.
- Neutral text contrast: 18.66:1 dark primary, 17.29:1 light primary,
  8.18:1 dark muted, 5.26:1 light muted. Focus ring: 4.81:1 on black,
  3.88:1 on warm white.

The reduced-motion rule is implemented in reset.css; OS preference switching
was not separately exercised during browser inspection. Real image/video fit
will need visual checking once actual media is supplied; this phase uses the
requested minimal placeholder inside the media frame.

## Phase 2 file inventory

Created:

```text
DESIGN_SYSTEM.md
public/font-licenses.txt
src/styles/fonts.css
src/styles/tokens.css
src/styles/reset.css
src/styles/typography.css
src/styles/utilities.css
src/styles/preview.css
src/components/Button/Button.tsx
src/components/Button/Button.css
src/components/MediaFrame/MediaFrame.tsx
src/components/MediaFrame/MediaFrame.css
src/components/RQBrand/RQBrand.tsx
src/components/RQBrand/RQBrand.css
src/components/Section/Section.tsx
src/components/Section/Section.css
src/components/SectionHeading/SectionHeading.tsx
src/components/SectionHeading/SectionHeading.css
src/components/VisualPlaceholder/VisualPlaceholder.tsx
src/components/VisualPlaceholder/VisualPlaceholder.css
src/assets/README.md
src/assets/fonts/README.md
```

Also added .gitkeep files under branding, images, portrait, textures, the four
decorative discipline directories, and the four named project directories.
Removed the now-unnecessary src/assets/.gitkeep and src/components/.gitkeep.

Modified:

```text
src/App.tsx
src/styles/global.css
index.html
README.md
package.json
package-lock.json
```

The build regenerates ignored dist/ output. Existing TypeScript/ESLint/Vite
configuration and main.tsx are unchanged.
