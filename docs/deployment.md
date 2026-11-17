# Deployment

The site is a static export: `npm run build` writes plain HTML, CSS, JavaScript, and images to
`out/`. It needs no server, database, or secrets, and it is hosted on GitHub Pages at
https://www.weastechies.com.

## How publishing works

Every push to `main` runs `.github/workflows/deploy.yml`, which installs dependencies, runs the
unit tests, builds the site, and publishes `out/` to GitHub Pages. You can also start it by hand
from the repository's **Actions** tab ("Deploy to GitHub Pages" → **Run workflow**).

## Settings it depends on

- **Repository variable `SITE_URL`** (Settings → Secrets and variables → Actions → Variables):
  the site's address, `https://www.weastechies.com`. It is used for canonical URLs, social
  previews, structured data, and the sitemap.
- **GitHub Pages** (Settings → Pages): source **GitHub Actions**, custom domain
  `www.weastechies.com`, **Enforce HTTPS** on.
- **DNS for weastechies.com** (managed at Squarespace):
  - `www` is a CNAME record pointing to `weastechieshub.github.io`.
  - `weastechies.com` forwards to `https://www.weastechies.com` with a Squarespace forwarding rule.
  - The email (MX), SPF, DKIM, and Google verification records are separate and must stay.

## Preview mode

`preview: true` in `content/profile.md` asks search engines not to index the site, empties the
sitemap, and shows a "Preview" banner. It is `false` now that the site is public.

## Checking a deployment

1. Open the homepage, a roadmap page, and `/terms` in both themes and at phone width.
2. Search a roadmap for a topic with no lessons and check the empty state.
3. Open `/sitemap.xml`, `/robots.txt`, and a shared link preview.
4. Move through a page with the keyboard only.
