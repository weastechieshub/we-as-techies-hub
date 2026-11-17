import Link from 'next/link';
import { ArrowDown, ArrowUpRight, Play, Code2 as Github } from 'lucide-react';
import { getProfile } from '@/lib/content';
import { ThemeToggle } from './theme-provider';
import { Button } from './ui/button';
import { ChannelIcon, channelNames } from './channel-icon';

// Opens the YouTube channel (from the profile's channels) from the hero and the closing section.
export function ContactLink({
  children = (
    <>
      <ChannelIcon platform="youtube" size={20} inverse /> Watch on YouTube
    </>
  ),
  className = '',
  button = false,
  buttonVariant = 'outline',
}: {
  children?: React.ReactNode;
  className?: string;
  button?: boolean;
  buttonVariant?: 'default' | 'outline';
}) {
  const profile = getProfile();
  if (!profile.youtubeUrl)
    return button ? (
      <Button
        variant={buttonVariant}
        disabled
        title="Add your YouTube channel URL in content/profile.md"
      >
        YouTube · coming soon <Play size={15} />
      </Button>
    ) : (
      <span className={`muted ${className}`}>YouTube · coming soon</span>
    );
  return (
    <a className={className} href={profile.youtubeUrl} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}
export function Header() {
  const p = getProfile();
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href="/" className="brand" aria-label={`${p.name} home`}>
          <span className="monogram">
            {p.initials}
            <i />
          </span>
          <span>{p.name}</span>
        </Link>
        <nav aria-label="Main navigation">
          <Link href="/#courses">Courses</Link>
          <Link href="/#path">Learning path</Link>
          <Link href="/#how">How it works</Link>
          <Link href="/roadmaps">Roadmaps</Link>
        </nav>
        <div className="header-actions">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
export function Footer() {
  const p = getProfile();
  return (
    <footer className="site-footer shell">
      <Link href="/" className="footer-name">
        {p.name}
        <span className="muted">Thoughtfully connected.</span>
      </Link>
      <div className="footer-links">
        {p.githubUrl && (
          <a href={p.githubUrl} target="_blank" rel="noopener noreferrer">
            <Github size={14} /> GitHub <ArrowUpRight size={13} />
          </a>
        )}
        <nav className="footer-channels" aria-label="Channels">
          {p.channels.map((c) => (
            <a
              key={c.platform}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${p.name} on ${channelNames[c.platform]}`}
            >
              <ChannelIcon platform={c.platform} />
              {channelNames[c.platform]}
            </a>
          ))}
        </nav>
        <Link href="/terms">Terms</Link>
        <a href="#top">
          Back to top <ArrowDown className="rotate-180" size={14} />
        </a>
      </div>
      <span className="mono footer-note">PERSPECTIVE BECOMES POSSIBILITY.</span>
    </footer>
  );
}
export function ContactSection() {
  const p = getProfile();
  return (
    <section
      id="contact"
      className="contact-section shell"
      data-guide="follow"
      data-guide-line="Follow along so you never miss a lesson!"
    >
      <div className="contact-signature" aria-hidden="true">
        <span className="monogram">
          {p.initials}
          <i />
        </span>
      </div>
      <div>
        <span className="eyebrow">THE NEXT CONVERSATION</span>
        <h2>
          A relevant opportunity.
          <br />
          <span className="muted">A useful conversation.</span>
        </h2>
        <p>
          For a role, a collaboration, or an interesting technical problem.
          <br className="desktop-only" /> Good work often starts with a conversation.
        </p>
        <ContactLink button className="button button-youtube" />
      </div>
      <span className="contact-cross" aria-hidden="true">
        ↗
      </span>
    </section>
  );
}
