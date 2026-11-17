import type { Skill, Article } from './types';

// A roadmap as the roadmap page shows it: the capability and its visible lessons.
export type RoadmapView = {
  skill: Skill;
  articles: Article[];
};
