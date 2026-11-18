import { describe, it, expect } from 'vitest';
import { getRoleRoadmap, roleRoadmapSchema } from '../src/lib/content';

describe('role roadmap', () => {
  it('runs from the software engineering base to beyond, with a flag where a job title is reached', () => {
    const { sections } = getRoleRoadmap();
    expect(sections.map((s) => s.id)).toEqual(['base', 'level-1', 'level-2', 'level-3', 'beyond']);
    expect(sections.map((s) => s.flag)).toEqual([
      'Engineer',
      undefined,
      'AI Engineer',
      'FDE / AI Architect',
      undefined,
    ]);
  });

  it('places every skill of a level in the system stack', () => {
    for (const section of getRoleRoadmap().sections.slice(1, 4)) {
      expect(
        section.skills.every((k) => k.part),
        section.id,
      ).toBe(true);
      for (const part of ['role', 'design', 'testing', 'security', 'operations', 'platform'])
        expect(
          section.skills.filter((k) => k.part === part),
          `${section.id} ${part}`,
        ).toHaveLength(1);
    }
  });

  it('lists lessons under their skill and leaves out links that are not up yet', () => {
    const skill = getRoleRoadmap().sections[1].skills.find((k) => k.id === 'foundry-and-models')!;
    expect(skill.lessons).toHaveLength(7);
    const [first] = skill.lessons;
    expect(first.title).toBe('Parameters and model size');
    // Every link of these lessons is still 'coming-soon' in the content file.
    expect(first.youtubeUrl).toBeUndefined();
    expect(first.facebookUrl).toBeUndefined();
    expect(first.linkedinUrl).toBeUndefined();
    expect(first.labUrl).toBeUndefined();
  });

  it('rejects a lesson link that is on the wrong site', () => {
    const section = (youtubeUrl: string) => ({
      title: 'Roadmap',
      description: 'A roadmap.',
      sections: [
        {
          id: 'base',
          title: 'Base',
          summary: 'A summary.',
          drawing: 'web-app',
          tone: 'green',
          skills: [{ title: 'Skill', lessons: [{ title: 'Lesson', youtubeUrl }] }],
        },
      ],
    });
    expect(roleRoadmapSchema.safeParse(section('https://www.youtube.com/watch?v=1')).success).toBe(
      true,
    );
    expect(roleRoadmapSchema.safeParse(section('https://example.com/video')).success).toBe(false);
  });
});
