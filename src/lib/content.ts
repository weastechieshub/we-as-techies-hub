import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { z } from 'zod';
import { cache as reactCache } from 'react';
import type { Profile, RoleRoadmap } from './types';

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

const roleLessonSchema = z.object({
  title: z.string().min(1),
  youtubeUrl: planned(youtube),
  facebookUrl: planned(facebook),
  linkedinUrl: planned(linkedin),
  labUrl: planned(
    z
      .string()
      .refine(
        (v) => (v.startsWith('/') && !v.startsWith('//')) || /^https:\/\//.test(v),
        'Use a local path or HTTPS URL',
      ),
  ),
});

export const roleRoadmapSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  sections: z
    .array(
      z.object({
        id: slug,
        title: z.string().min(1),
        summary: z.string().min(1),
        drawing: z.enum(['web-app', 'agent-app', 'services', 'platform', 'beyond']),
        tone: z.enum(['cyan', 'blue', 'orange', 'pink', 'green', 'yellow']),
        flag: z.string().min(1).optional(),
        skills: z
          .array(
            z.object({
              id: slug.optional(),
              title: z.string().min(1),
              icon: z
                .enum([
                  'code',
                  'layers',
                  'cloud',
                  'database',
                  'user',
                  'network',
                  'check',
                  'shield',
                  'sparkles',
                  'book',
                  'box',
                  'refresh',
                  'link',
                  'pin',
                  'compass',
                  'chart',
                ])
                .default('box'),
              part: z
                .enum(['role', 'design', 'testing', 'layer', 'security', 'operations', 'platform'])
                .optional(),
              group: z.string().min(1).optional(),
              lessons: z.array(roleLessonSchema).default([]),
            }),
          )
          .min(1),
      }),
    )
    .min(1),
});

// A link that is up, or nothing while it is still 'coming-soon'.
const live = (url?: string) => (url && url !== 'coming-soon' ? url : undefined);

// The role roadmap on the home page: its sections, their skills, and each skill's lessons.
export const getRoleRoadmap = cache((): RoleRoadmap => {
  const { data } = matter(fs.readFileSync(path.join(root, 'role-roadmap.md'), 'utf8'));
  const roadmap = roleRoadmapSchema.parse(data);
  unique(
    roadmap.sections.map((s) => s.id),
    'role roadmap section IDs',
  );
  const sections = roadmap.sections.map((s) => {
    const skills = s.skills.map((k) => ({
      ...k,
      id: k.id ?? identifier(k.title),
      lessons: k.lessons.map((l) => ({
        title: l.title,
        youtubeUrl: live(l.youtubeUrl),
        facebookUrl: live(l.facebookUrl),
        linkedinUrl: live(l.linkedinUrl),
        labUrl: live(l.labUrl),
      })),
    }));
    unique(
      skills.map((k) => k.id),
      `${s.id} skill IDs`,
    );
    // A section is drawn as a system stack only when every skill says which part it is.
    const placed = skills.filter((k) => k.part).length;
    if (placed && placed !== skills.length)
      throw new Error(`${s.id}: give every skill a part, or none of them`);
    for (const part of ['role', 'design', 'testing', 'security', 'operations', 'platform'])
      if (skills.filter((k) => k.part === part).length > 1)
        throw new Error(`${s.id}: only one skill can be the ${part} part`);
    return { ...s, skills };
  });
  return { ...roadmap, sections };
});

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.example').replace(/\/$/, '');
}
