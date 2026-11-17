# Deployment

The site is a Next.js app with no database and no secrets. `npm run build` builds it and
`npm run start` serves it with Node.js 22 or newer, so it runs on any host that supports Next.js.

## Before launch

1. Set `NEXT_PUBLIC_SITE_URL` to the site's final HTTPS address, without a trailing slash (see
   `.env.example`). It is used for canonical URLs, social previews, structured data, and the
   sitemap.
2. Set `preview: false` in `content/profile.md` so search engines can index the site and the
   "Preview" banner goes away.
3. Check the channel links, lesson links, and the social share image after deploying.

## Hosting on GitHub Pages

GitHub Pages serves static files only. The site does not use a server at runtime, but it is not
set up for a static export yet: that needs `output: 'export'` in `next.config.ts`, a GitHub
Actions workflow that builds and publishes the `out/` folder, and replacing the `/roadmaps`
redirect and the security headers, which a static host cannot run.

## Checking a deployment

1. Open the homepage, a roadmap page, and `/terms` in both themes and at phone width.
2. Search a roadmap for a topic with no lessons and check the empty state.
3. Open `/sitemap.xml`, `/robots.txt`, and a shared link preview.
4. Move through a page with the keyboard only.
