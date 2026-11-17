import type { MetadataRoute } from 'next';
import { getProfile, getSkills, siteUrl } from '@/lib/content';
import { roadmapSlugs } from '@/lib/roadmaps';
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
