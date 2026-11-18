import type { MetadataRoute } from 'next';
import { getProfile, siteUrl } from '@/lib/content';

// Built once into a static file (the site is a static export).
export const dynamic = 'force-static';
export default function sitemap(): MetadataRoute.Sitemap {
  if (getProfile().preview) return [];
  const base = siteUrl();
  return [{ url: base }, { url: `${base}/terms` }];
}
