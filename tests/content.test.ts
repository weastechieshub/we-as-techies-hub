import { describe, it, expect } from 'vitest';
import {
  getArticles,
  getSkills,
  getProfile,
  profileSchema,
  roadmapSchema,
} from '../src/lib/content';
describe('Markdown catalog', () => {
  it('loads all capability cards and associates every visible article with a topic', () => {
    const skills = getSkills(),
      articles = getArticles();
    expect(skills).toHaveLength(19);
    expect(articles.map((a) => a.slug)).toEqual([
      'understand-a-model-card',
      'enterprise-ai-model-lifecycle',
    ]);
    for (const a of articles) {
      const s = skills.find((s) => s.slug === a.skill);
      expect(s).toBeDefined();
      expect(s!.topics.some((t) => t.id === a.topic)).toBe(true);
    }
  });
  it('lists the channel accounts in footer order, YouTube first', () => {
    const p = getProfile();
    expect(p.channels.map((c) => c.platform)).toEqual([
      'youtube',
      'linkedin',
      'facebook',
      'instagram',
    ]);
    expect(p.youtubeUrl).toBe('https://www.youtube.com/@weastechieshub');
    const base = {
      name: 'N',
      initials: 'N',
      headline: 'H',
      description: 'D',
      photo: '',
      preview: true,
    };
    expect(
      profileSchema.safeParse({
        ...base,
        channels: [{ platform: 'instagram', url: 'https://www.instagram.com/x/' }],
      }).success,
    ).toBe(true);
    expect(
      profileSchema.safeParse({
        ...base,
        channels: [{ platform: 'instagram', url: 'https://www.facebook.com/x' }],
      }).success,
    ).toBe(false);
    expect(
      profileSchema.safeParse({
        ...base,
        channels: [{ platform: 'youtube', url: 'https://youtube.com.evil.example/x' }],
      }).success,
    ).toBe(false);
  });
  it('stays in preview with no invented profile destinations', () => {
    expect(getProfile().preview).toBe(true);
    expect(getProfile().linkedinUrl).toBe('');
    // Only the published series playlists link out; everything else is a planned label.
    const real = getArticles().flatMap((a) =>
      [a.linkedinUrl, a.youtubeUrl, a.facebookUrl].filter((u) => u && u !== 'coming-soon'),
    );
    expect(real).toEqual([
      'https://www.youtube.com/playlist?list=PLcnEEeEORLhM',
      'https://www.facebook.com/watch/61596483666800/1831380931441570/',
      'https://www.youtube.com/playlist?list=PLEv6xUSykc_w',
      'https://www.facebook.com/watch/61596483666800/1895581824909308/',
    ]);
  });
});

describe('nested roadmap format', () => {
  const entry = {
    title: 'Foundry',
    slug: 'custom-foundry',
    group: 'ai',
    order: 1,
    description: 'Models',
    categories: [
      {
        title: 'Models',
        order: 1,
        articles: [
          {
            title: 'Model choice',
            order: 2,
            description: 'Choices',
            linkedinUrl: 'https://www.linkedin.com/posts/example',
            image: '/images/model.png',
          },
        ],
      },
    ],
  };
  it('accepts nested articles without dates, IDs, or status', () => {
    const result = roadmapSchema.parse(entry);
    expect(result.slug).toBe('custom-foundry');
    expect(result.categories[0].articles[0].status).toBe('published');
    expect(result.categories[0].articles[0]).not.toHaveProperty('date');
  });
  it('shows a More coming soon card only where a category asks for one', () => {
    expect(roadmapSchema.parse(entry).categories[0].moreComingSoon).toBe(false);
    const models = getSkills().find((s) => s.slug === 'model-selection')!;
    expect(models.topics).toEqual([{ id: 'models', title: 'Models & inference', more: true }]);
  });
  it('rejects invalid order and non-LinkedIn article links', () => {
    expect(roadmapSchema.safeParse({ ...entry, order: 0 }).success).toBe(false);
    const invalid = structuredClone(entry);
    invalid.categories[0].articles[0].linkedinUrl = 'https://example.com';
    expect(roadmapSchema.safeParse(invalid).success).toBe(false);
  });
  it('flattens all categories in roadmap and article order', () => {
    const articles = getArticles();
    const expected = getSkills().flatMap((skill) =>
      skill.topics.flatMap((topic) =>
        articles
          .filter((a) => a.skill === skill.slug && a.topic === topic.id)
          .sort((a, b) => a.order - b.order),
      ),
    );
    expect(articles.map((a) => a.slug)).toEqual(expected.map((a) => a.slug));
    expect(articles).toHaveLength(2);
  });
});
