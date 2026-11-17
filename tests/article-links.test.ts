import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ArticleCard } from '../src/components/article-card';
import { roadmapSchema } from '../src/lib/content';
import type { Article } from '../src/lib/types';

const article: Article = {
  slug: 'sample',
  title: 'Sample article',
  description: 'A summary',
  skill: 'foundry',
  topic: 'models',
  order: 1,
  tags: [],
  image: '/images/test.png',
};

function render(links: Partial<Article>) {
  vi.stubGlobal('React', React);
  try {
    return renderToStaticMarkup(
      React.createElement(ArticleCard, { article: { ...article, ...links } }),
    );
  } finally {
    vi.unstubAllGlobals();
  }
}

describe('article destinations', () => {
  it('renders each destination as its own external link, never the title', () => {
    const html = render({
      linkedinUrl: 'https://www.linkedin.com/posts/test',
      youtubeUrl: 'https://www.youtube.com/playlist?list=PL1',
      facebookUrl: 'https://www.facebook.com/page/videos',
    });
    expect(html).toContain('Read on LinkedIn');
    expect(html).toContain('Watch on YouTube');
    expect(html).toContain('Watch on Facebook');
    expect(html.match(/target="_blank"/g)).toHaveLength(3);
    expect(html.match(/rel="noopener noreferrer"/g)).toHaveLength(3);
    expect(html.slice(html.indexOf('<h3'), html.indexOf('</h3>'))).not.toContain('<a');
  });

  it('shows planned destinations as labels without links', () => {
    const planned = render({
      linkedinUrl: 'coming-soon',
      youtubeUrl: 'coming-soon',
      facebookUrl: 'coming-soon',
    });
    expect(planned).toContain('LinkedIn · Coming soon');
    expect(planned).toContain('YouTube · Coming soon');
    expect(planned).toContain('Facebook · Coming soon');
    expect(planned).not.toContain('href=');
    const mixed = render({ linkedinUrl: 'https://www.linkedin.com/', youtubeUrl: 'coming-soon' });
    expect(mixed.match(/<a /g)).toHaveLength(1);
  });

  it('hides destinations that are not given', () => {
    expect(render({})).not.toContain('article-actions');
    expect(render({ linkedinUrl: 'https://www.linkedin.com/posts/test' })).not.toContain('YouTube');
    expect(render({ youtubeUrl: 'https://youtu.be/example' })).not.toContain('LinkedIn');
  });

  it('only accepts links on each platform’s own domain', () => {
    const lesson: Record<string, unknown> = { ...article, youtubeUrl: 'https://youtu.be/example' };
    const entry = {
      title: 'Foundry',
      slug: 'foundry',
      group: 'ai',
      order: 1,
      description: 'Models',
      categories: [{ title: 'Models', order: 1, articles: [lesson] }],
    };
    expect(roadmapSchema.safeParse(entry).success).toBe(true);
    lesson.youtubeUrl = 'https://youtube.com.evil.example/video';
    expect(roadmapSchema.safeParse(entry).success).toBe(false);
    lesson.youtubeUrl = 'https://youtu.be/example';
    lesson.facebookUrl = 'https://fb.watch/abc';
    expect(roadmapSchema.safeParse(entry).success).toBe(true);
    lesson.facebookUrl = 'https://facebook.com.evil.example/video';
    expect(roadmapSchema.safeParse(entry).success).toBe(false);
  });
});
