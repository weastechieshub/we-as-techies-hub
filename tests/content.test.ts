import { describe, it, expect } from 'vitest';
import { getProfile, getRoleRoadmap, profileSchema } from '../src/lib/content';

describe('profile', () => {
  it('lists the channel accounts in order, YouTube first', () => {
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

  it('is public with no invented destinations', () => {
    expect(getProfile().preview).toBe(false);
    expect(getProfile().linkedinUrl).toBe('');
    // No lesson link is up yet: every channel icon and every lab shows as coming soon.
    const real = getRoleRoadmap().sections.flatMap((s) =>
      s.skills.flatMap((k) =>
        k.lessons.flatMap((l) =>
          [l.youtubeUrl, l.facebookUrl, l.linkedinUrl, l.labUrl].filter(Boolean),
        ),
      ),
    );
    expect(real).toEqual([]);
  });
});
