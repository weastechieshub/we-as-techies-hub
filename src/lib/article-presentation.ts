export const categoryColors = ['cyan', 'orange', 'pink', 'yellow', 'green', 'blue'];

export function articleNumber(
  articles: { slug: string; skill: string; topic: string; order: number }[],
  article: { slug: string; skill: string; topic: string },
) {
  return (
    articles
      .filter((a) => a.skill === article.skill && a.topic === article.topic)
      .sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug))
      .findIndex((a) => a.slug === article.slug) + 1
  );
}
