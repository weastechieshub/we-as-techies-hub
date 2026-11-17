import { describe, it, expect } from 'vitest';
import { searchArticles } from '../src/lib/search';
import { getArticles } from '../src/lib/content';
const articles = getArticles();
describe('Article discovery', () => {
  it('returns useful results for every homepage suggestion', () => {
    for (const query of ['Reading a model card', 'Model lifecycle', 'Choosing a model']) {
      expect(searchArticles(articles, query).length).toBeGreaterThan(0);
    }
  });
  it('finds relevant articles for a natural-language query', () => {
    const matches = searchArticles(articles, 'How do I read a model card before choosing?');
    expect(matches[0].slug).toBe('understand-a-model-card');
    expect(searchArticles(articles, 'retiring a model in the enterprise')[0].slug).toBe(
      'enterprise-ai-model-lifecycle',
    );
  });
  it('returns no results for an unknown topic or stop words alone', () => {
    expect(searchArticles(articles, 'astrophotography')).toEqual([]);
    expect(searchArticles(articles, 'how do I')).toEqual([]);
  });
  it('preserves the full collection for an empty query and supports large catalogs', () => {
    const large = Array.from({ length: 2100 }, (_, i) => ({
      ...articles[i % articles.length],
      slug: `article-${i}`,
    }));
    expect(searchArticles(large, '')).toHaveLength(2100);
    expect(searchArticles(large, 'lifecycle').length).toBeGreaterThan(100);
    expect(new Set(searchArticles(large, 'model').map((a) => a.slug)).size).toBe(
      searchArticles(large, 'model').length,
    );
  });
});
