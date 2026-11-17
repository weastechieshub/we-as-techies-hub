import { getProfile } from '@/lib/content';
import { ChannelIcon, channelNames } from '@/components/channel-icon';
import { Words } from './words';

const brandColour = {
  youtube: '#ff0000',
  linkedin: '#0a66c2',
  facebook: '#0866ff',
  instagram: '#d62976',
};

// The closing section on the homepage and the roadmap pages: a button for each channel.
// It must sit inside an `.lx` element, which gives it the learning styles and entrance effects.
export function KeepLearning() {
  const p = getProfile();
  return (
    <section
      className="lx-cta shell"
      data-guide="follow"
      data-guide-line="Follow along so you never miss a lesson!"
    >
      <p className="lx-eyebrow" data-fx>
        KEEP LEARNING
      </p>
      <h2 className="lx-words" data-fx-trigger>
        <Words text="New lessons land on YouTube first." grad={['YouTube']} />
      </h2>
      <div className="lx-channels" data-fx style={{ '--d': 2 } as React.CSSProperties}>
        {p.channels.map((c) => (
          <a
            key={c.platform}
            className={`lx-channel is-${c.platform}`}
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ '--brand': brandColour[c.platform] } as React.CSSProperties}
          >
            <ChannelIcon platform={c.platform} size={20} inverse={c.platform === 'youtube'} />
            {channelNames[c.platform]}
          </a>
        ))}
      </div>
    </section>
  );
}
