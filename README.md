# We as Techies Hub

A platform for learning AI engineering and system design on the Microsoft stack. Short video
courses on YouTube and Facebook, PDF guides on LinkedIn, and roadmaps that connect them.

Built with Next.js (App Router), React, TypeScript, and Tailwind CSS. All content is Markdown in
`content/`; there is no database and no backend service.

## What the site has

- **Homepage (`/`)**: the latest courses with their playlist links, a learning path drawn as a
  road through four areas (AI engineering, System design, Cloud & data, Software engineering),
  how the lessons work, and the channels to follow.
- **Roadmaps (`/roadmaps/<slug>`)**: one page per capability that has published lessons, with its
  steps, lesson cards, and search. Capabilities without lessons show as "Soon" on the homepage.
- **Terms (`/terms`)**: terms and conditions, written in `content/terms.md`.
- **The head mascot** from the videos, which follows visitors down each page and says a line for
  each section.
- Light and dark themes, search metadata, a sitemap, and a generated social share image.

## Run locally

Requires Node.js 22 or newer.

```sh
npm install
npm run dev
```

Then open http://127.0.0.1:3000.

## Project structure

```text
content/
  profile.md          site name, search title and description, channel accounts, preview switch
  roadmaps/*.md       one file per capability: the homepage road and the roadmap pages
  terms.md            terms and conditions
public/
  images/mascot/      head mascot frames: rest, talking, blink
  images/profile.png  picture used in the social share image
src/
  app/                routes: homepage, roadmaps, terms, not found, sitemap, robots, share image
  components/         UI components
  components/learn/   homepage effects, the learning road, and the mascot
  lib/                content loading and validation, search, SEO helpers, types
tests/                unit tests (Vitest) and browser tests (Playwright, with axe accessibility checks)
docs/                 content and deployment guides
```

## Content

Read the [content guide](docs/content.md) to add lessons, link playlists, open a new roadmap, or
change what the mascot says. Content changes go live with the next deployment.

## Checks

```sh
npm run typecheck
npm test
npm run test:e2e
npm run build
```

`npm run test:e2e` uses the app on port 3000 if it is already running, and starts it otherwise.

## Typography

All fonts are open source (SIL Open Font License) and served from the site itself through
[Fontsource](https://fontsource.org) packages, so visitors' browsers make no requests to font
services. Fraunces for headings and titles, Space Grotesk for body text, IBM Plex Mono for labels
and numbers, and Inter for buttons, navigation, and links. They are imported in
`src/app/layout.tsx`.

## Deployment

See the [deployment guide](docs/deployment.md).

## License

The code is released under the [MIT License](LICENSE): you may use, change, and share it, as long
as you keep the copyright and license notice.

The license covers the code only. The We as Techies Hub name and logo, the mascot images
(`public/images/mascot/`), the illustrations (`public/images/`), and the lesson and site content
(`content/`) belong to We as Techies Hub and are not covered by the license. Please don't reuse
them; use your own content and images in your copy.

The fonts come from npm packages and keep their own SIL Open Font License.
