# Content guide

Everything the site shows comes from Markdown files in `content/`. Files are checked when the site
builds, so a typo in a field name or a link on the wrong platform stops the build with a clear
message.

## Site details: `content/profile.md`

| Field | What it does |
| --- | --- |
| `name`, `initials` | The site name and the two letters in the logo. |
| `headline`, `description` | Used in the social share image and as search fallbacks. |
| `seoTitle`, `seoDescription` | The homepage title (`<name> — <seoTitle>`) and search description. |
| `channels` | YouTube, LinkedIn, Facebook, and Instagram accounts, in the order the Keep learning section shows them. Each URL must be on its own platform. |
| `photo` | A picture in `public/` (for example `/images/profile.png`) for the social share image. |
| `linkedinUrl`, `githubUrl` | Optional extra profile links. |
| `preview` | While `true`, search engines are asked not to index the site, the sitemap is empty, and a "Preview" banner shows. Set it to `false` at launch. |

## The roadmap: `content/role-roadmap.md`

The homepage is one roadmap. Its `sections` are the columns, left to right. Each section has
`skills` (the blocks under it), and a skill can have `lessons`.

```md
---
title: Engineer to AI Engineer to FDE / AI Architect
description: Follow one project from a plain web app to an agent platform.
sections:
  - id: level-1
    title: 'Level 1: Practitioner'
    summary: Build your first agent. It answers from company data, uses tools, and ships in a tested web app.
    drawing: agent-app
    tone: cyan
    flag: AI Engineer
    skills:
      - title: Foundry and models
        icon: box
        part: layer
        lessons:
          - title: Parameters and model size
            youtubeUrl: https://www.youtube.com/watch?v=YOUR-VIDEO
            facebookUrl: coming-soon
            linkedinUrl: coming-soon
            labUrl: coming-soon
---
```

### Section fields

- `id` is the section's anchor (`/#level-1`). It must be unique, lowercase, with hyphens.
- `title` and `summary` are the heading and the one line under the drawing.
- `drawing` picks the picture above the section: `web-app`, `agent-app`, `services`, `platform`,
  or `beyond`. The drawings are in `src/components/roadmap/role-drawing.tsx`.
- `tone` is the section's colour: `cyan`, `blue`, `orange`, `pink`, `green`, or `yellow`.
- `flag` is the job title reached when the section is done. Leave it out for no flag.

### Skill fields

- `title` is the text on the block. `id` is optional; without it one is made from the title.
- `icon` is one of `code`, `layers`, `cloud`, `database`, `user`, `network`, `check`, `shield`,
  `sparkles`, `book`, `box`, `refresh`, `link`, `pin`, `compass`, or `chart`.
- `part` places the block in the section's system stack: `role` (the pill on top), `design` (the
  frame's label), `testing` (left side), `layer` (the stacked blocks, in file order), `security`
  (right side), `operations` (the band under the frame), or `platform` (the base). Give every
  skill of a section a part, or none; only `layer` can be used more than once.
- `group` puts skills in named boxes instead, as the Beyond section does.
- A section whose skills have neither is a plain list of blocks.

### Lessons and their links

- A skill with at least one lesson lights up, shows a dot per lesson, and opens its lesson list.
- `youtubeUrl` (youtube.com or youtu.be), `facebookUrl` (facebook.com, fb.com, or fb.watch) and
  `linkedinUrl` (linkedin.com) take an HTTPS URL for a clickable icon. Write `coming-soon`, or
  leave the field out, for a greyed icon.
- `labUrl` takes a path on this site (`/labs/...`) or an HTTPS URL and shows "Open lab". Without
  one the lesson shows "Lab soon".

## Terms: `content/terms.md`

The terms page. The title, description, and `updated` date are front matter; the text is normal
Markdown below it.

## What the mascot says

Each section that should have a mascot line has `data-guide` and `data-guide-line` attributes in
its component (`src/app/page.tsx` for the homepage). Edit the `data-guide-line` text to change what
it says. A section with `data-guide` but no line sends the mascot away while it is on screen.
