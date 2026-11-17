import Link from 'next/link';
import { ArrowDown, ArrowUpRight, Code2 as Github } from 'lucide-react';
import { getProfile } from '@/lib/content';
import { roadmapSlugs } from '@/lib/roadmaps';
import { ThemeToggle } from './theme-provider';
import { ChannelIcon, channelNames } from './channel-icon';

export function Header() {
  const p = getProfile();
  const [firstRoadmap] = roadmapSlugs();
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
          <Link href={firstRoadmap ? `/roadmaps/${firstRoadmap}` : '/#path'}>Roadmaps</Link>
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
