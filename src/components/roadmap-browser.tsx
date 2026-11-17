'use client';
import { useRouter } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { categoryColors } from '@/lib/article-presentation';
import { TopicMap } from './topic-map';
import type { RoadmapView } from '@/lib/roadmap-types';

// The roadmap page: the selected roadmap, with a picker for the other roadmaps that have lessons.
export function RoadmapBrowser({
  roadmaps,
  initialSlug,
}: {
  roadmaps: RoadmapView[];
  initialSlug: string;
}) {
  const router = useRouter();
  const active = roadmaps.find((r) => r.skill.slug === initialSlug) || roadmaps[0];
  if (!active) return null;
  return (
    <>
      <span className="sr-only" role="status">
        Showing {active.skill.title} roadmap
      </span>
      <TopicMap
        key={active.skill.slug}
        skill={active.skill}
        articles={active.articles}
        roadmapOptions={
          <div className="roadmap-picker" aria-label="Choose a roadmap">
            <div
              className="search-suggestions roadmap-picker-row"
              role="group"
              aria-label="Roadmaps"
            >
              <span className="roadmap-picker-label">Roadmaps</span>
              <div className="roadmap-picker-options">
                {roadmaps.map((r, index) => (
                  <span className="roadmap-option" key={r.skill.slug}>
                    <button
                      className={`tone-${categoryColors[index % categoryColors.length]}`}
                      type="button"
                      aria-pressed={r.skill.slug === active.skill.slug}
                      onClick={() => router.push(`/roadmaps/${r.skill.slug}`)}
                    >
                      {r.skill.title}
                      <ArrowUpRight size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        }
      />
    </>
  );
}
