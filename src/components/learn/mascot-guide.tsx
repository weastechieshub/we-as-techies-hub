'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { MascotHead } from './mascot-head';

// The same head mascot follows visitors down every page. A section marks itself with
// data-guide="<id>" and, when the guide should talk there, data-guide-line="<what it says>".
// When a new section reaches the middle of the screen the head drops into the corner and says
// that section's line. Sections without a line (the homepage hero, the road) send it away,
// because the big hero head or the runner on the road is the mascot there. On long pages it
// steps aside while the footer is in view, and it starts again on each page.
export function MascotGuide() {
  const pathname = usePathname();
  const [stop, setStop] = useState<{ id: string; line: string } | null>(null);
  const [away, setAway] = useState(true);
  const [atFooter, setAtFooter] = useState(false);

  useEffect(() => {
    setStop(null);
    setAway(true);
    const sections = [...document.querySelectorAll<HTMLElement>('[data-guide]')];
    let seen = false;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          seen = true;
          const el = e.target as HTMLElement;
          const line = el.dataset.guideLine;
          if (line) {
            setStop({ id: `${pathname}#${el.dataset.guide ?? ''}`, line });
            setAway(false);
          } else {
            setAway(true);
          }
        }),
      { rootMargin: '-50% 0px -50% 0px' },
    );
    sections.forEach((s) => io.observe(s));
    // Short pages may never reach the middle of the screen: speak for the first visible section.
    const fallback = window.setTimeout(() => {
      if (seen) return;
      const el = sections.find((s) => {
        const r = s.getBoundingClientRect();
        return s.dataset.guideLine && r.bottom > 0 && r.top < window.innerHeight;
      });
      if (!el?.dataset.guideLine) return;
      setStop({ id: `${pathname}#${el.dataset.guide ?? ''}`, line: el.dataset.guideLine });
      setAway(false);
    }, 600);
    const footer = document.querySelector('footer');
    // On short pages the footer is always in view, so only step aside on pages that scroll.
    const footerIo = new IntersectionObserver(
      ([e]) =>
        setAtFooter(
          e.isIntersecting && document.documentElement.scrollHeight > window.innerHeight + 200,
        ),
      { threshold: 0.2 },
    );
    if (footer) footerIo.observe(footer);
    return () => {
      window.clearTimeout(fallback);
      io.disconnect();
      footerIo.disconnect();
    };
  }, [pathname]);

  if (!stop) return null;
  return (
    <div className={`lx-guide ${away || atFooter ? 'is-away' : ''}`} aria-hidden="true">
      <div key={stop.id} className="lx-guide-drop">
        <MascotHead size={96} lines={[stop.line]} once />
      </div>
    </div>
  );
}
