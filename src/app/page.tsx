import Link from 'next/link';
import { ArrowDown, ArrowRight, Clock3, Rocket } from 'lucide-react';
import { getArticles, getProfile, getSkills, siteUrl } from '@/lib/content';
import { jsonLd } from '@/lib/seo';
import { groups } from '@/lib/types';
import { roadmapSlugs } from '@/lib/roadmaps';
import { ChannelIcon, channelNames } from '@/components/channel-icon';
import { LearnEffects } from '@/components/learn/learn-effects';
import { LearningRoad } from '@/components/learn/learning-road';
import { MascotHead } from '@/components/learn/mascot-head';
import './home.css';

// The homepage: courses, the learning path, how it works, and the channels to follow.
export const metadata = { alternates: { canonical: '/' } };

const brandColour = {
  youtube: '#ff0000',
  linkedin: '#0a66c2',
  facebook: '#0866ff',
  instagram: '#d62976',
};

// Splits text into words that slide in one after another; `grad` words get the moving gradient.
function Words({ text, grad = [], start = 0 }: { text: string; grad?: string[]; start?: number }) {
  return text.split(' ').map((w, i) => (
    <span key={i}>
      <span
        className={`lx-w ${grad.includes(w.replace(/[.,]/g, '')) ? 'lx-grad' : ''}`}
        style={{ '--i': start + i } as React.CSSProperties}
      >
        {w}
      </span>{' '}
    </span>
  ));
}

export default function LearnPage() {
  const p = getProfile();
  const skills = getSkills();
  const live = new Set(roadmapSlugs());
  const courses = getArticles().filter((a) => a.youtubeUrl && a.youtubeUrl !== 'coming-soon');
  const topics = skills.map((s) => s.title);

  return (
    <main id="main" className="lx">
      <LearnEffects />
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

      {/* Hero */}
      <section className="lx-hero" data-guide="hero">
        <div className="shell lx-hero-grid">
          <div className="lx-hero-copy">
            <p className="lx-pill" data-fx>
              <span className="lx-dot" /> AI LEARNING · MICROSOFT STACK
            </p>
            <h1
              className="lx-title lx-words"
              data-fx-trigger
              aria-label="Learn AI engineering. One short lesson at a time."
            >
              <span className="lx-line" aria-hidden="true">
                <Words text="Learn AI engineering." grad={['AI', 'engineering']} />
              </span>
              <span className="lx-line" aria-hidden="true">
                <Words text="One short lesson at a time." start={3} />
              </span>
            </h1>
            <p className="lx-lead" data-fx style={{ '--d': 4 } as React.CSSProperties}>
              Video courses and PDF guides on choosing, building, and running enterprise AI with
              Microsoft Foundry and Azure. New lessons are added all the time.
            </p>
            <div className="lx-actions" data-fx style={{ '--d': 5 } as React.CSSProperties}>
              <a href="#courses" className="button button-primary lx-shine">
                Start learning <ArrowDown size={16} />
              </a>
              {p.youtubeUrl && (
                <a
                  href={p.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button button-youtube lx-shine"
                >
                  <ChannelIcon platform="youtube" size={20} inverse /> Watch on YouTube
                </a>
              )}
            </div>
            <p className="lx-formats" data-fx style={{ '--d': 6 } as React.CSSProperties}>
              <ChannelIcon platform="youtube" size={16} />
              <ChannelIcon platform="facebook" size={15} /> Videos on YouTube and Facebook
              <span className="lx-sep">·</span>
              <ChannelIcon platform="linkedin" size={15} /> PDFs on LinkedIn
            </p>
          </div>

          <div className="lx-hero-art" data-fx style={{ '--d': 2 } as React.CSSProperties}>
            <span className="lx-halo" aria-hidden="true" />
            <div className="lx-orbit" aria-hidden="true">
              {['Model cards', 'Microsoft Foundry', 'Agents', 'RAG', 'Evaluation', 'Azure'].map(
                (t, k) => (
                  <span
                    key={t}
                    className="lx-orbit-item"
                    style={{ '--k': k } as React.CSSProperties}
                  >
                    <span className="lx-orbit-chip">{t}</span>
                  </span>
                ),
              )}
            </div>
            <MascotHead
              size={250}
              lines={[
                "Hi! Let's learn AI engineering.",
                'Start with a model card.',
                'One short lesson at a time.',
              ]}
            />
          </div>
        </div>

        {/* Topics ticker with the head running across it. */}
        <div className="lx-lane" aria-hidden="true">
          <div className="lx-marquee">
            <div className="lx-marquee-track">
              {[...topics, ...topics].map((t, i) => (
                <span key={i}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Courses */}
      <section
        id="courses"
        className="lx-section shell"
        data-guide="courses"
        data-guide-line="Start here! Pick a course and press play."
      >
        <div className="lx-head-block">
          <p className="lx-eyebrow" data-fx>
            START HERE
          </p>
          <h2 className="lx-words" data-fx-trigger>
            <Words text="The latest courses." grad={['courses']} />
          </h2>
          <p className="lx-sub" data-fx style={{ '--d': 2 } as React.CSSProperties}>
            New ones are added regularly. Watch the full playlists, then follow the PDF guides.
          </p>
        </div>
        <div className="lx-courses">
          {courses.map((c, i) => (
            <article
              key={c.slug}
              className="lx-course"
              data-fx
              style={{ '--d': i + 1 } as React.CSSProperties}
            >
              <div className="lx-tilt lx-course-inner lx-glow-border tone-cyan">
                <span className="lx-tag">VIDEO COURSE</span>
                <h3>{c.title}</h3>
                <p>{c.description}</p>
                <div className="lx-course-links">
                  <a
                    className="lx-link lx-link-yt"
                    href={c.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ChannelIcon platform="youtube" size={18} inverse /> YouTube playlist
                  </a>
                  {c.facebookUrl && c.facebookUrl !== 'coming-soon' && (
                    <a
                      className="lx-link lx-link-fb"
                      href={c.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ChannelIcon platform="facebook" size={16} /> Facebook
                    </a>
                  )}
                  {c.linkedinUrl === 'coming-soon' ? (
                    <span className="lx-link lx-link-soon">
                      <ChannelIcon platform="linkedin" size={15} /> PDF · coming soon
                    </span>
                  ) : (
                    c.linkedinUrl && (
                      <a
                        className="lx-link"
                        href={c.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ChannelIcon platform="linkedin" size={15} /> PDF on LinkedIn
                      </a>
                    )
                  )}
                </div>
                <Link className="lx-more" href={`/roadmaps/${c.skill}#${c.topic}`}>
                  Lesson list <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Learning path */}
      <section id="path" className="lx-section shell" data-guide="path">
        <div className="lx-head-block">
          <p className="lx-eyebrow" data-fx>
            YOUR LEARNING PATH
          </p>
          <h2 className="lx-words" data-fx-trigger>
            <Words text="From models to production." grad={['production']} />
          </h2>
          <p className="lx-sub" data-fx style={{ '--d': 2 } as React.CSSProperties}>
            Follow the road one step at a time. Lit stops are ready to learn; the rest are on their
            way.
          </p>
        </div>
        <LearningRoad>
          {groups.map((g, i) => {
            const stopSkills = skills.filter((s) => s.group === g.id);
            const ready = stopSkills.some((s) => live.has(s.slug));
            return (
              <div key={g.id} className={`lx-stop ${i % 2 ? 'is-right' : 'is-left'}`}>
                <div className="lx-node-wrap">
                  <span className={`lx-node tone-${g.color} ${ready ? 'is-live' : ''}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="lx-stop-card" data-fx>
                  <div className={`lx-tilt lx-stop-inner tone-${g.color}`}>
                    <p className="lx-eyebrow">STOP {i + 1}</p>
                    <h3>{g.title}</h3>
                    <p>{g.description}</p>
                    <ul className="lx-chips">
                      {stopSkills.map((s) =>
                        live.has(s.slug) ? (
                          <li key={s.slug}>
                            <Link className="lx-chip is-live" href={`/roadmaps/${s.slug}`}>
                              {s.title}{' '}
                              <span>
                                Start <ArrowRight size={12} />
                              </span>
                            </Link>
                          </li>
                        ) : (
                          <li key={s.slug} className="lx-chip">
                            {s.title}
                            <span>
                              <Clock3 size={11} /> Soon
                            </span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </LearningRoad>
      </section>

      {/* How it works */}
      <section
        id="how"
        className="lx-section shell"
        data-guide="how"
        data-guide-line="Watch, read, then try it yourself."
      >
        <div className="lx-head-block">
          <p className="lx-eyebrow" data-fx>
            HOW IT WORKS
          </p>
          <h2 className="lx-words" data-fx-trigger>
            <Words text="Watch. Read. Apply." grad={['Apply']} />
          </h2>
        </div>
        <div className="lx-steps" data-fx-trigger>
          {[
            {
              title: 'Watch',
              text: 'A short video lesson on YouTube or Facebook.',
              icon: <ChannelIcon platform="youtube" size={34} />,
              tone: 'pink',
            },
            {
              title: 'Read',
              text: 'The PDF guide on LinkedIn, to review and keep.',
              icon: <ChannelIcon platform="linkedin" size={30} />,
              tone: 'blue',
            },
            {
              title: 'Apply',
              text: 'Try it in Microsoft Foundry and Azure.',
              icon: <Rocket size={28} />,
              tone: 'green',
            },
          ].map((s, i) => (
            <div
              key={s.title}
              className="lx-step"
              data-fx
              style={{ '--d': i + 1 } as React.CSSProperties}
            >
              <div className={`lx-tilt lx-step-inner tone-${s.tone}`}>
                <span className="lx-step-no">0{i + 1}</span>
                <span className="lx-step-icon">{s.icon}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Keep learning */}
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
    </main>
  );
}
