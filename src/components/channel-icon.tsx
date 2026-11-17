import type { ChannelPlatform } from '@/lib/types';

export const channelNames: Record<ChannelPlatform, string> = {
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
  instagram: 'Instagram',
};

// Platform logos in their own colours, used on lesson cards, the footer and the YouTube buttons.
// `inverse` draws the YouTube logo white with a red play mark, for use on a red button.
export function ChannelIcon({
  platform,
  size = 14,
  inverse = false,
}: {
  platform: ChannelPlatform;
  size?: number;
  inverse?: boolean;
}) {
  const common = {
    viewBox: '0 0 24 24',
    width: size,
    height: size,
    'aria-hidden': true,
    className: 'channel-icon',
  } as const;
  switch (platform) {
    case 'youtube':
      return (
        <svg {...common}>
          <path
            d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8z"
            fill={inverse ? '#fff' : '#ff0000'}
          />
          <path d="M9.6 15.6 15.8 12 9.6 8.4z" fill={inverse ? '#cc0000' : '#fff'} />
        </svg>
      );
    case 'linkedin':
      return (
        <svg {...common}>
          <rect width="24" height="24" rx="3" fill="#0a66c2" />
          <rect x="4.6" y="9.3" width="3.3" height="10.1" fill="#fff" />
          <circle cx="6.25" cy="5.9" r="1.95" fill="#fff" />
          <path
            d="M10.4 9.3h3.2v1.4c.5-.9 1.7-1.7 3.4-1.7 3.4 0 4 2.2 4 5.1v5.3h-3.3v-4.7c0-1.1 0-2.6-1.6-2.6s-1.9 1.2-1.9 2.5v4.8h-3.3z"
            fill="#fff"
          />
        </svg>
      );
    case 'facebook':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="12" fill="#0866ff" />
          <path
            d="M13.6 24v-9h2.8l.5-3.4h-3.3V9.5c0-1 .3-1.7 1.7-1.7h1.8V4.8c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5v2.4H7.2V15h2.9v8.7a12 12 0 0 0 3.5.3z"
            fill="#fff"
          />
        </svg>
      );
    case 'instagram':
      return (
        <svg {...common}>
          <defs>
            <linearGradient id="instagram-gradient" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="#feda75" />
              <stop offset="0.5" stopColor="#d62976" />
              <stop offset="1" stopColor="#4f5bd5" />
            </linearGradient>
          </defs>
          <rect x="1" y="1" width="22" height="22" rx="6" fill="url(#instagram-gradient)" />
          <rect
            x="6"
            y="6"
            width="12"
            height="12"
            rx="3.5"
            fill="none"
            stroke="#fff"
            strokeWidth="1.8"
          />
          <circle cx="12" cy="12" r="3" fill="none" stroke="#fff" strokeWidth="1.8" />
          <circle cx="16.3" cy="7.7" r="1" fill="#fff" />
        </svg>
      );
  }
}
