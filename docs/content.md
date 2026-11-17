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
| `channels` | YouTube, LinkedIn, Facebook, and Instagram accounts, in the order the footer and homepage show them. Each URL must be on its own platform. The YouTube one is also the red "Watch on YouTube" button. |
| `photo` | A picture in `public/` (for example `/images/profile.png`) for the social share image. |
| `linkedinUrl`, `githubUrl` | Optional extra profile links. |
| `preview` | While `true`, search engines are asked not to index the site, the sitemap is empty, and a "Preview" banner shows. Set it to `false` at launch. |

## Roadmaps: `content/roadmaps/*.md`

One file per capability. Each one is a chip on the homepage road. Once it has at least one
published lesson, it also gets its own page at `/roadmaps/<slug>` and a "Start" link.

A capability with no lessons yet only needs its basics:

```md
---
title: Microsoft Foundry
slug: microsoft-foundry
group: ai
order: 2
description: Models, agents, and the decisions that connect them.
---
```

A roadmap with lessons adds `categories` (the steps of the roadmap) and their `articles` (the
lessons):

```md
---
title: Model selection
slug: model-selection
group: ai
order: 1
description: Choosing the right model, not building one.
categories:
  - id: models
    title: Models & inference
    order: 1
    moreComingSoon: true
    articles:
      - id: understand-a-model-card
        title: Understand a model card
        order: 1
        description: What a model card tells you about a model.
        youtubeUrl: https://www.youtube.com/playlist?list=YOUR-PLAYLIST
        facebookUrl: https://www.facebook.com/watch/PAGE-ID/PLAYLIST-ID/
        linkedinUrl: coming-soon
        tags:
          - model card
---
```

### Fields

- `slug` sets the URL. It must be unique, lowercase, with hyphens.
- `group` picks the homepage row and road stop: `ai` (AI engineering), `architecture` (System
  design), `cloud` (Cloud & data), or `engineering` (Software engineering). Their names,
  descriptions, and colours are in `src/lib/types.ts`.
- `order` sorts capabilities, steps, and lessons. Use unique orders within each roadmap and step.
- `id` is optional on steps and lessons; without it one is made from the title. Keep IDs stable
  when you rename a title, and give lessons with the same title their own IDs.
- `moreComingSoon: true` on a step adds a "More coming soon" card after its lessons.
- `tags` are extra search words for a lesson.
- `status: draft` hides a lesson that is not ready.
- `image` and `imageAlt` add a picture to a lesson card (a local `/images/...` path or an HTTPS
  URL). Without one, the card shows a small sketch.

### Lesson links

- `youtubeUrl` (youtube.com or youtu.be) and `facebookUrl` (facebook.com, fb.com, or fb.watch) are
  for the video playlists. `linkedinUrl` (linkedin.com) is for the PDF post.
- Each one takes an HTTPS URL for a clickable link, `coming-soon` for a muted label, or can be left
  out to hide it. Leaving out all three hides the link row.
- Lessons with a YouTube link also appear as course cards in the homepage's "The latest courses"
  section.

## Terms: `content/terms.md`

The terms page. The title, description, and `updated` date are front matter; the text is normal
Markdown below it.

## What the mascot says

Each section that should have a mascot line has `data-guide` and `data-guide-line` attributes in
its component (for example `src/app/page.tsx` for the homepage). Edit the `data-guide-line` text
to change what it says. A section with `data-guide` but no line sends the mascot away while it is
on screen.
