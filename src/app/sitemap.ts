import type { MetadataRoute } from 'next';
import { getProfile, getSkills, siteUrl } from '@/lib/content';
import { roadmapSlugs } from '@/lib/roadmaps';

// Built once into a static file (the site is a static export).
export const dynamic = 'force-static';
export default function sitemap(): MetadataRoute.Sitemap {
  if (getProfile().preview) return [];
  const base = siteUrl();
  return [
    { url: base },
    { url: `${base}/terms` },
    ...getSkills()
      .filter((s) => roadmapSlugs().includes(s.slug))
      .map((s) => ({ url: `${base}/roadmaps/${s.slug}` })),
  ];
}
