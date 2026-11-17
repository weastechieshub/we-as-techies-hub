import { ArrowUpRight } from 'lucide-react';
import { categoryColors } from '@/lib/article-presentation';
import { groups, type Article, type Skill } from '@/lib/types';
import { ArticleSketch } from './article-sketch';
import { ChannelIcon, channelNames } from './channel-icon';

// Where a lesson is published, in the order the card lists them. A URL is a link,
// 'coming-soon' is a muted label, and an omitted field is not shown.
const destinations = [
  { key: 'linkedinUrl', platform: 'linkedin', action: 'Read on LinkedIn', size: 15 },
  { key: 'youtubeUrl', platform: 'youtube', action: 'Watch on YouTube', size: 16 },
  { key: 'facebookUrl', platform: 'facebook', action: 'Watch on Facebook', size: 15 },
] as const;

// A lesson on a roadmap page: number, title, summary, picture, and its destinations.
export function ArticleCard({
  article,
  skill,
  number,
}: {
  article: Article;
  skill?: Skill;
  number?: number;
}) {
  const group = groups.find((g) => g.id === skill?.group) || groups[0];
  const categoryIndex = skill?.topics.findIndex((t) => t.id === article.topic) ?? -1;
  const color =
    categoryIndex < 0 ? group.color : categoryColors[categoryIndex % categoryColors.length];
  const links = destinations.filter((d) => article[d.key]);
  return (
    <article className={`article-card category-article tone-${color}`}>
      <div className="article-card-body">
        <div className="article-card-copy">
          <h3>
            <span className="article-number" aria-hidden="true">
              {String(number ?? article.order).padStart(2, '0')}
            </span>
            <span className="article-title" title={article.title}>
              {article.title}
            </span>
          </h3>
          <p title={article.description}>{article.description}</p>
        </div>
        <div className="article-illustration">
          {article.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={article.image}
              alt={article.imageAlt || ''}
              loading="lazy"
              width={100}
              height={80}
            />
          ) : (
            <ArticleSketch article={article} />
          )}
        </div>
      </div>
      {links.length > 0 && (
        <div className="article-actions">
          {links.map((d) =>
            article[d.key] === 'coming-soon' ? (
              <span key={d.key} className="article-coming-soon">
                <ChannelIcon platform={d.platform} size={d.size} />
                {channelNames[d.platform]} · Coming soon
              </span>
            ) : (
              <a
                key={d.key}
                href={article[d.key]}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${d.action}: ${article.title}`}
              >
                <ChannelIcon platform={d.platform} size={d.size} />
                <span>{d.action}</span>
                <ArrowUpRight size={12} aria-hidden="true" />
              </a>
            ),
          )}
        </div>
      )}
    </article>
  );
}
