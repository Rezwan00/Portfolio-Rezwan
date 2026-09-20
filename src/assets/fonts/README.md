# Fonts

Archivo Black and Inter are self-hosted through these npm packages:

- @fontsource/archivo-black (Archivo Black, normal, black design at weight 400)
- @fontsource-variable/inter (Inter Variable, weight axis 100–900)

Central @font-face declarations live in src/styles/fonts.css and use Latin
WOFF2 files from the packages. Both use font-display: swap. Inter normal and
italic are available; a browser fetches each face only when needed. Vite emits
fingerprinted local font assets into dist/assets. No Google Fonts requests or
external font stylesheets run in the browser.

Both fonts use the SIL Open Font License (OFL-1.1); the packages include their
LICENSE files. Preserve licensing when redistributing font files separately.
Their full license notices are also copied to public/font-licenses.txt so
they accompany the production build.

This directory remains available for future approved, locally stored fonts.
Additional language subsets must be declared centrally if the content needs
characters outside the current Latin subset.
