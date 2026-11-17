import type { MetadataRoute } from 'next';
import { getProfile, siteUrl } from '@/lib/content';
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: getProfile().preview ? undefined : '/',
      disallow: getProfile().preview ? '/' : undefined,
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
