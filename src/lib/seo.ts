import type { Metadata } from 'next';
import { getProfile } from './content';

// Per-page title, description, canonical URL and social preview. A page's openGraph replaces the
// layout's whole openGraph object (metadata merges shallowly), so every field is set here.
export function pageMetadata(title: string, description: string, path: string): Metadata {
  const name = getProfile().name;
  const fullTitle = `${title} · ${name}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName: name,
      locale: 'en_US',
      title: fullTitle,
      description,
      url: path,
      images: ['/opengraph-image'],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: ['/opengraph-image'],
    },
  };
}

// JSON-LD for a page, with "<" escaped so content can never close the script tag.
export function jsonLd(data: object) {
  return {
    __html: JSON.stringify({ '@context': 'https://schema.org', ...data }).replace(/</g, '\\u003c'),
  };
}
