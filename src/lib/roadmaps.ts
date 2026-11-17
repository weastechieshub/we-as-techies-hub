import { getArticles, getSkills } from './content';
import type { RoadmapView } from './roadmap-types';

// Only capabilities with visible articles get a roadmap page; the rest stay "Soon" on the homepage.
export function roadmapSlugs(): string[] {
  const articles = getArticles();
  return getSkills()
    .filter((s) => articles.some((a) => a.skill === s.slug))
    .map((s) => s.slug);
}

// The roadmaps the roadmap page can switch between: every one with lessons, plus the current one.
export function getRoadmaps(initialSlug: string): RoadmapView[] {
  const articles = getArticles();
  return getSkills()
    .filter((s) => s.slug === initialSlug || articles.some((a) => a.skill === s.slug))
    .map((skill) => ({ skill, articles: articles.filter((a) => a.skill === skill.slug) }));
}
