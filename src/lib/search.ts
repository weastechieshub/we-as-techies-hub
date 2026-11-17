import type { Article } from './types';
const stop = new Set(
  'a an the is are to for of in on with and or how do i my can me what want about it this that from your you should'.split(
    ' ',
  ),
);
const aliases: Record<string, string[]> = {
  rag: ['retrieval', 'grounding'],
  documents: ['retrieval', 'context'],
  llm: ['model'],
  agents: ['agent'],
  deploying: ['deployment'],
  costs: ['cost'],
  testing: ['evaluation'],
  cloud: ['azure', 'deployment'],
  delivery: ['deployment', 'release'],
};
export function tokens(query: string) {
  return [
    ...new Set(
      query
        .toLowerCase()
        .match(/[\p{L}\p{N}]+/gu)
        ?.filter((t) => !stop.has(t))
        .flatMap((t) => [t, ...(aliases[t] || [])]) || [],
    ),
  ];
}
export function searchArticles(articles: Article[], query: string) {
  const terms = tokens(query);
  if (!query.trim()) return articles;
  if (!terms.length) return [];
  return articles
    .map((article) => {
      const title = article.title.toLowerCase();
      const tags = article.tags.join(' ').toLowerCase();
      const rest = `${article.description} ${article.topic} ${article.skill}`.toLowerCase();
      return {
        article,
        score: terms.reduce(
          (s, t) =>
            s +
            (title.includes(t) ? 5 : 0) +
            (tags.includes(t) ? 3 : 0) +
            (rest.includes(t) ? 1 : 0),
          0,
        ),
      };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.article);
}
