// The homepage rows (and roadmap groups), in order.
export type GroupId = 'ai' | 'architecture' | 'cloud' | 'engineering';
export const groups: { id: GroupId; title: string; description: string; color: string }[] = [
  {
    id: 'ai',
    title: 'AI engineering',
    description: 'Choosing, grounding, and building with AI models.',
    color: 'cyan',
  },
  {
    id: 'architecture',
    title: 'System design',
    description: 'Architecture that holds up as systems grow.',
    color: 'green',
  },
  {
    id: 'cloud',
    title: 'Cloud & data',
    description: 'Where systems run and how data moves.',
    color: 'blue',
  },
  {
    id: 'engineering',
    title: 'Software engineering',
    description: 'Languages, frameworks, and quality.',
    color: 'orange',
  },
];
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

// One capability (a file in content/roadmaps). Its categories are the steps of its roadmap.
export type Skill = {
  slug: string;
  title: string;
  group: GroupId;
  description: string;
  order: number;
  // `more` adds a "More coming soon" card after the step's articles on the roadmap page.
  topics: { id: string; title: string; more: boolean }[];
};

// One published lesson inside a roadmap step.
export type Article = {
  slug: string;
  title: string;
  description: string;
  skill: string;
  topic: string;
  tags: string[];
  order: number;
  linkedinUrl?: string;
  youtubeUrl?: string;
  facebookUrl?: string;
  image?: string;
  imageAlt?: string;
};
