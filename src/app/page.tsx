import type { CSSProperties } from 'react';
import { getProfile, getRoleRoadmap, siteUrl } from '@/lib/content';
import { jsonLd } from '@/lib/seo';
import { KeepLearning } from '@/components/learn/keep-learning';
import { LearnEffects } from '@/components/learn/learn-effects';
import { Words } from '@/components/learn/words';
import { RoleDrawing } from '@/components/roadmap/role-drawing';
import { SkillStack } from '@/components/roadmap/skill-stack';
import './role-roadmap.css';

// The homepage is the role roadmap: every section side by side on one line, from the software
// engineering base to what comes after Level 3. Each section has a drawing of what you can build
// by its end, the flag of the job title it leads to, and its skills as the parts of that system.
// The content is content/role-roadmap.md.
export const metadata = { alternates: { canonical: '/' } };

export default function RoleRoadmapPage() {
  const p = getProfile();
  const roadmap = getRoleRoadmap();
  // The last role in the title ("... to FDE / AI Architect") gets the moving gradient.
  const words = roadmap.title.split(' ');
  const cut = words.lastIndexOf('to') + 1;
  const lead = words.slice(0, cut).join(' ');
  const goal = words.slice(cut);
  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          '@type': 'WebSite',
          name: p.name,
          url: siteUrl(),
          description: p.seoDescription || p.description,
          inLanguage: 'en',
          sameAs: [...p.channels.map((c) => c.url), p.linkedinUrl, p.githubUrl].filter(Boolean),
        })}
      />
      <div className="lx rm">
        <LearnEffects />
        <div
          className="rm-shell"
          data-guide="role-roadmap"
          data-guide-line="Glowing skills have lessons. Tap one to open them."
        >
          <div className="rm-top">
            <div>
              <p className="lx-eyebrow" data-fx>
                ROADMAP
              </p>
              <h1 className="rm-title lx-words" data-fx-trigger>
                {lead && <Words text={lead} />}
                <Words text={goal.join(' ')} grad={goal} start={cut} />
              </h1>
            </div>
            <p className="rm-sub" data-fx style={{ '--d': 2 } as CSSProperties}>
              {roadmap.description}
            </p>
          </div>
          <nav className="rm-jump" aria-label="Roadmap sections">
            {roadmap.sections.map((s) => (
              <a key={s.id} href={`#${s.id}`}>
                {s.title.split(':')[0]}
              </a>
            ))}
          </nav>
          <div className="rm-road" data-fx-trigger>
            <div className="rm-ground" aria-hidden />
            {roadmap.sections.map((s, i) => (
              <section
                key={s.id}
                id={s.id}
                className={`rm-sec tone-${s.tone}`}
                style={{ '--i': i } as CSSProperties}
                aria-labelledby={`${s.id}-title`}
              >
                <div className="rm-art" data-fx-trigger>
                  <RoleDrawing kind={s.drawing} flag={s.flag} />
                </div>
                {/* The heading and its line are separate rows, so they line up across sections. */}
                <h2
                  id={`${s.id}-title`}
                  className="rm-h"
                  data-fx
                  style={{ '--d': i } as CSSProperties}
                >
                  {s.title}
                </h2>
                <p className="rm-sum" data-fx style={{ '--d': i } as CSSProperties}>
                  {s.summary}
                </p>
                <SkillStack section={s} delay={i} />
              </section>
            ))}
          </div>
        </div>
        <KeepLearning />
      </div>
    </main>
  );
}
