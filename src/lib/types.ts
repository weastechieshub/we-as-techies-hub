export type ChannelPlatform = 'youtube' | 'linkedin' | 'facebook' | 'instagram';

// content/profile.md
export type Profile = {
  name: string;
  initials: string;
  headline: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  linkedinUrl: string;
  channels: { platform: ChannelPlatform; url: string }[];
  // The YouTube channel from `channels`, used by the "Watch on YouTube" buttons.
  youtubeUrl: string;
  githubUrl: string;
  photo: string;
  // While true, search engines are asked not to index the site and a preview banner shows.
  preview: boolean;
};

// content/role-roadmap.md: the role roadmap on the home page.
export type RoleTone = 'cyan' | 'blue' | 'orange' | 'pink' | 'green' | 'yellow';
export type RoleDrawingKind = 'web-app' | 'agent-app' | 'services' | 'platform' | 'beyond';
export type RoleIcon =
  | 'code'
  | 'layers'
  | 'cloud'
  | 'database'
  | 'user'
  | 'network'
  | 'check'
  | 'shield'
  | 'sparkles'
  | 'book'
  | 'box'
  | 'refresh'
  | 'link'
  | 'pin'
  | 'compass'
  | 'chart';
// Where a skill sits in its section's system stack.
export type RolePart =
  'role' | 'design' | 'testing' | 'layer' | 'security' | 'operations' | 'platform';

// One lesson of a skill. A link is missing while it is not up yet.
export type RoleLesson = {
  title: string;
  youtubeUrl?: string;
  facebookUrl?: string;
  linkedinUrl?: string;
  labUrl?: string;
};

// One block under a section. It lights up when it has lessons.
export type RoleSkill = {
  id: string;
  title: string;
  icon: RoleIcon;
  part?: RolePart;
  group?: string;
  lessons: RoleLesson[];
};

// One column of the roadmap. `flag` is the job title reached when the section is done.
export type RoleSection = {
  id: string;
  title: string;
  summary: string;
  drawing: RoleDrawingKind;
  tone: RoleTone;
  flag?: string;
  skills: RoleSkill[];
};

export type RoleRoadmap = {
  title: string;
  description: string;
  sections: RoleSection[];
};
