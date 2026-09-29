# Deployment

GitHub Pages deploys automatically from the `main` branch using `.github/workflows/pages.yml`.

Live project site: `https://njzhl93.github.io/early-medieval-ireland-explorer/`

Current presentation milestone: **v0.22 — Dublin Visual Showcase**.

The Pages workflow reconstructs the public optimized Dyflin AD950 WebP from repository-safe text chunks, verifies its SHA-256 checksum, removes the temporary chunk files from the deployment artifact, and then deploys the static site.
