# We as Techies Hub

A platform for learning AI engineering and system design on the Microsoft stack. One role
roadmap gives the direction; each lesson links to its video, its PDF guide and its lab.

Built with Next.js (App Router), React, TypeScript, and Tailwind CSS. All content is Markdown in
`content/`; there is no database and no backend service.

## What the site has

- **Homepage (`/`)**: the role roadmap, from the software engineering base through three levels
  to FDE and AI Architect. Each section has a drawing of what you can build by its end, a flag for
  the job title it leads to, and its skills drawn as the parts of that system. A skill with
  lessons lights up and opens its lesson list: the lab first, then the YouTube, Facebook and
  LinkedIn links, each shown as coming soon until it is up. The channels to follow close the page.
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
  role-roadmap.md     the roadmap on the homepage: sections, skills and each skill's lessons
  terms.md            terms and conditions
public/
  images/mascot/      head mascot frames: rest, talking, blink
  images/profile.png  picture used in the social share image
src/
  app/                routes: homepage, terms, not found, sitemap, robots, share image
  components/         UI components
  components/learn/   entrance effects, the Keep learning section, and the mascot
  components/roadmap/ the roadmap's drawings and skill stacks
  lib/                content loading and validation, SEO helpers, types
tests/                unit tests (Vitest) and browser tests (Playwright, with axe accessibility checks)
docs/                 content and deployment guides
```

## Content

Read the [content guide](docs/content.md) to add lessons and their links, change a section or a
skill, or change what the mascot says. Content changes go live with the next deployment.

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
