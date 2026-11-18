import Link from 'next/link';
import { ArrowDown, ArrowUpRight, Code2 as Github } from 'lucide-react';
import { getProfile } from '@/lib/content';
import { ThemeToggle } from './theme-provider';

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
          {/* The homepage is the roadmap, so the logo is the way back to it. Labs are not built
              yet, so this is a label, not a link. */}
          <span className="nav-soon">
            Labs <small>Soon</small>
          </span>
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
      <div className="footer-links">
        <Link href="/terms">Terms</Link>
        {p.githubUrl && (
          <a href={p.githubUrl} target="_blank" rel="noopener noreferrer">
            <Github size={14} /> GitHub <ArrowUpRight size={13} />
          </a>
        )}
        <a href="#top">
          Back to top <ArrowDown className="rotate-180" size={14} />
        </a>
      </div>
      <span className="mono footer-note">PERSPECTIVE BECOMES POSSIBILITY.</span>
    </footer>
  );
}
