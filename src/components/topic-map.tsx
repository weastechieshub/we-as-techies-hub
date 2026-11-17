'use client';
import { useState, type ReactNode } from 'react';
import { RoadmapConnections } from './roadmap-connections';
import { ArticleCard } from './article-card';
import { RoadmapSearch } from './roadmap-search';
import type { Skill, Article } from '@/lib/types';
import { searchArticles } from '@/lib/search';
import { categoryColors as colors, articleNumber } from '@/lib/article-presentation';

// One roadmap: its steps (categories) down the middle, each step's lessons branching left and
// right, and a search box that narrows both as you type.
export function TopicMap({
  skill,
  articles,
  roadmapOptions,
}: {
  skill: Skill;
  articles: Article[];
  roadmapOptions?: ReactNode;
}) {
  const [query, setQuery] = useState('');
  const searching = !!query.trim();
  const found = searchArticles(articles, query);
  const topics = skill.topics
    .map((topic, index) => ({
      ...topic,
      index,
      // A step whose own title matches keeps all its lessons.
      items: (searching && topic.title.toLowerCase().includes(query.trim().toLowerCase())
        ? articles
        : found
      )
        .filter((a) => a.topic === topic.id)
        .sort((a, b) => a.order - b.order),
    }))
    .filter((t) => !searching || t.items.length);
  return (
    <div className="roadmap">
      <RoadmapSearch
        query={query}
        onQueryChange={setQuery}
        suggestions={skill.topics.slice(0, 3).map((t) => t.title)}
      >
        {roadmapOptions}
      </RoadmapSearch>
      <div className="discovery-heading roadmap-content-heading">
        <h1>{skill.title}</h1>
        <p>{skill.description}</p>
      </div>
      <p id="roadmap-results" className="roadmap-hint" aria-live="polite">
        {searching
          ? `${topics.reduce((sum, t) => sum + t.items.length, 0)} matching articles in ${topics.length} categories`
          : 'Explore a category. Watch the lessons on YouTube.'}
      </p>
      <div className="roadmap-canvas">
        {topics.map((t) => {
          const more = t.more && !searching;
          return (
            <section
              id={t.id}
              key={t.id}
              className={`roadmap-category tone-${colors[t.index % colors.length]}`}
            >
              <RoadmapConnections count={t.items.length + (more ? 1 : 0)} />
              <h2 className="roadmap-center">
                <span className="roadmap-node">
                  <span className="roadmap-number">{String(t.index + 1).padStart(2, '0')}</span>
                  <span className="roadmap-title">{t.title}</span>
                  <span className="roadmap-count">
                    {t.items.length} {t.items.length === 1 ? 'article' : 'articles'}
                  </span>
                </span>
              </h2>
              <div id={`topic-${t.id}`} className="roadmap-branches">
                {t.items.map((a, i) => (
                  <div
                    key={a.slug}
                    className={`topic-article roadmap-item ${i % 2 ? 'branch-right' : 'branch-left'}`}
                    style={{ gridRow: Math.floor(i / 2) + 1 }}
                  >
                    <ArticleCard article={a} skill={skill} number={articleNumber(articles, a)} />
                  </div>
                ))}
                {more && (
                  <div
                    className={`topic-article roadmap-item roadmap-more ${t.items.length % 2 ? 'branch-right' : 'branch-left'}`}
                    style={{ gridRow: Math.floor(t.items.length / 2) + 1 }}
                  >
                    <div className="roadmap-more-card">
                      <span className="roadmap-more-title">More coming soon</span>
                      <p>New lessons for this step are on the way.</p>
                    </div>
                  </div>
                )}
                {!t.items.length && !more && <p className="roadmap-empty">Coming soon.</p>}
              </div>
            </section>
          );
        })}
      </div>
      {!topics.length && (
        <p className="roadmap-no-results">
          No matching articles. Try a different topic or clear your search.
        </p>
      )}
    </div>
  );
}
