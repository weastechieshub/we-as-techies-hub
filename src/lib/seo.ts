import type { Metadata } from 'next';
import { getProfile } from './content';

// Built by src/app/og-image.png/route.tsx.
export const shareImage = {
  url: '/og-image.png',
  width: 1200,
  height: 630,
  alt: 'We as Techies Hub: a platform for learning AI engineering and system design',
};

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
      images: [shareImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [shareImage],
    },
  };
}

// JSON-LD for a page, with "<" escaped so content can never close the script tag.
export function jsonLd(data: object) {
  return {
    __html: JSON.stringify({ '@context': 'https://schema.org', ...data }).replace(/</g, '\\u003c'),
  };
}
