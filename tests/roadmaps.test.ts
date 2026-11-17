import { describe, it, expect } from 'vitest';
import { getRoadmaps, roadmapSlugs } from '../src/lib/roadmaps';
describe('roadmap catalog', () => {
  it('lets the roadmap page switch between the roadmaps that have lessons', () => {
    expect(getRoadmaps('model-selection').map((m) => m.skill.slug)).toEqual(['model-selection']);
    expect(getRoadmaps('model-selection')[0].articles).toHaveLength(2);
  });
  it('gives a roadmap page only to capabilities with visible articles', () => {
    expect(roadmapSlugs()).toEqual(['model-selection']);
  });
});
