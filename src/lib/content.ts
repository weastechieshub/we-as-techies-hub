import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { z } from 'zod';
import { cache as reactCache } from 'react';
import type { Article, Profile, Skill } from './types';

// Everything the site shows is read from Markdown files in /content and validated here.
const root = path.join(process.cwd(), 'content');

// Content changes ship with a new deployment, so production reads each file once;
// development re-reads on every request so edits show up straight away.
function cache<T>(read: () => T): () => T {
  let loaded = false;
  let value: T;
  const requestCache = reactCache(read);
  return () => {
    if (process.env.NODE_ENV !== 'production') return requestCache();
    if (!loaded) {
      value = read();
      loaded = true;
    }
    return value;
  };
}

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const group = z.enum(['ai', 'architecture', 'cloud', 'engineering']);
const order = z.number().int().positive();
const httpsUrl = z
  .string()
  .url()
  .refine((v) => new URL(v).protocol === 'https:', 'Use an HTTPS URL');
const onHost = (hosts: string[], message: string) =>
  httpsUrl.refine((v) => {
    const host = new URL(v).hostname;
    return hosts.some((h) => host === h || host.endsWith(`.${h}`));
  }, message);
const linkedin = onHost(['linkedin.com'], 'Use a LinkedIn URL');
const youtube = onHost(['youtube.com', 'youtu.be'], 'Use a YouTube URL');
const facebook = onHost(['facebook.com', 'fb.com', 'fb.watch'], 'Use a Facebook URL');
const instagram = onHost(['instagram.com'], 'Use an Instagram URL');
// A destination is a real URL, or 'coming-soon' for a muted label.
const planned = <T extends z.ZodTypeAny>(url: T) =>
  z.union([z.literal('coming-soon'), url]).optional();

const articleSchema = z.object({
  id: slug.optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  order,
  linkedinUrl: planned(linkedin),
  youtubeUrl: planned(youtube),
  facebookUrl: planned(facebook),
  tags: z.array(z.string()).default([]),
  status: z.enum(['published', 'draft']).default('published'),
  image: z
    .string()
    .refine(
      (v) => (v.startsWith('/') && !v.startsWith('//')) || /^https:\/\//.test(v),
      'Use a local path or HTTPS image URL',
    )
    .optional(),
  imageAlt: z.string().optional(),
});

export const roadmapSchema = z.object({
  title: z.string().min(1),
  slug,
  group,
  order,
  description: z.string().min(1),
  categories: z
    .array(
      z.object({
        id: slug.optional(),
        title: z.string().min(1),
        order,
        moreComingSoon: z.boolean().default(false),
        articles: z.array(articleSchema).default([]),
      }),
    )
    .default([]),
});

const identifier = (title: string) =>
  slug.parse(
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, ''),
  );

function unique(values: (string | number)[], label: string) {
  if (new Set(values).size !== values.length) throw new Error(`Duplicate ${label}`);
}

function markdownFiles(folder: string) {
  return fs
    .readdirSync(path.join(root, folder))
    .filter((f) => f.endsWith('.md'))
    .map((file) => matter(fs.readFileSync(path.join(root, folder, file), 'utf8')).data);
}

// Every roadmap (one file per capability), with IDs filled in and everything sorted by `order`.
const getCatalog = cache(() => {
  const catalog = markdownFiles('roadmaps')
    .map((data) => {
      const roadmap = roadmapSchema.parse(data);
      const categories = roadmap.categories
        .map((c) => ({
          ...c,
          id: c.id ?? identifier(c.title),
          articles: c.articles
            .map((a) => ({ ...a, id: a.id ?? identifier(a.title) }))
            .sort((a, b) => a.order - b.order),
        }))
        .sort((a, b) => a.order - b.order);
      unique(
        categories.map((c) => c.id),
        `${roadmap.slug} category IDs`,
      );
      unique(
        categories.map((c) => c.order),
        `${roadmap.slug} category orders`,
      );
      for (const c of categories)
        unique(
          c.articles.map((a) => a.order),
          `${roadmap.slug}/${c.id} article orders`,
        );
      return { ...roadmap, categories };
    })
    .sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));
  unique(
    catalog.map((r) => r.slug),
    'roadmap slugs',
  );
  unique(
    catalog.flatMap((r) => r.categories.flatMap((c) => c.articles.map((a) => a.id))),
    'article IDs (set an explicit id for repeated titles)',
  );
  return catalog;
});

export const getSkills = cache((): Skill[] =>
  getCatalog().map((r) => ({
    slug: r.slug,
    title: r.title,
    group: r.group,
    description: r.description,
    order: r.order,
    topics: r.categories.map((c) => ({ id: c.id, title: c.title, more: c.moreComingSoon })),
  })),
);

// Published articles (drafts are hidden), in roadmap, category and article order.
export const getArticles = cache((): Article[] =>
  getCatalog().flatMap((r) =>
    r.categories.flatMap((c) =>
      c.articles
        .filter((a) => a.status === 'published')
        .map(({ id, status: _status, ...a }) => ({ ...a, slug: id, skill: r.slug, topic: c.id })),
    ),
  ),
);

const channelHosts = {
  youtube: youtube,
  linkedin: linkedin,
  facebook: facebook,
  instagram: instagram,
} as const;
const channel = z
  .object({ platform: z.enum(['youtube', 'linkedin', 'facebook', 'instagram']), url: httpsUrl })
  .refine(
    (c) => channelHosts[c.platform].safeParse(c.url).success,
    "Use a URL on the channel's own platform",
  );

export const profileSchema = z
  .object({
    name: z.string(),
    initials: z.string(),
    headline: z.string(),
    description: z.string(),
    seoTitle: z.string().default(''),
    seoDescription: z.string().default(''),
    linkedinUrl: z.union([z.literal(''), linkedin]).default(''),
    channels: z.array(channel).default([]),
    githubUrl: z.union([z.literal(''), httpsUrl]).default(''),
    photo: z
      .string()
      .refine((v) => !v || (v.startsWith('/') && !v.startsWith('//')), 'Use a local /image path'),
    preview: z.boolean(),
  })
  .transform((p) => ({
    ...p,
    youtubeUrl: p.channels.find((c) => c.platform === 'youtube')?.url ?? '',
  }));

export const getProfile = cache((): Profile => {
  const { data } = matter(fs.readFileSync(path.join(root, 'profile.md'), 'utf8'));
  return profileSchema.parse(data);
});

export const getTerms = cache(() => {
  const { data, content } = matter(fs.readFileSync(path.join(root, 'terms.md'), 'utf8'));
  const metadata = z
    .object({
      title: z.string().min(1),
      description: z.string().min(1),
      updated: z.string().min(1),
    })
    .parse(data);
  return { ...metadata, body: content.trim() };
});

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.example').replace(/\/$/, '');
}
