import { notFound } from 'next/navigation';
import { getSkills, siteUrl } from '@/lib/content';
import { jsonLd, pageMetadata } from '@/lib/seo';
import { groups } from '@/lib/types';
import { RoadmapBrowser } from '@/components/roadmap-browser';
import { getRoadmaps, roadmapSlugs } from '@/lib/roadmaps';
import { ContactSection } from '@/components/chrome';
// Only roadmaps with lessons are built; any other /roadmaps/<slug> is the 404 page.
export const dynamicParams = false;
export function generateStaticParams() {
  return roadmapSlugs().map((slug) => ({ slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = roadmapSlugs().includes(slug) ? getSkills().find((s) => s.slug === slug) : undefined;
  if (!s) return { title: 'Skill not found' };
  return pageMetadata(`${s.title} roadmap`, s.description, `/roadmaps/${slug}`);
}
export default async function SkillPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const skill = getSkills().find((s) => s.slug === slug);
  if (!skill || !roadmapSlugs().includes(slug)) notFound();
  const group = groups.find((g) => g.id === skill.group)!;
  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl() },
            {
              '@type': 'ListItem',
              position: 2,
              name: skill.title,
              item: `${siteUrl()}/roadmaps/${slug}`,
            },
          ],
        })}
      />
      <div
        className={`shell page-content skill-page tone-${group.color}`}
        data-guide="roadmap"
        data-guide-line="Every step here links to its lessons."
      >
        <RoadmapBrowser roadmaps={getRoadmaps(slug)} initialSlug={slug} />
      </div>
      <ContactSection />
    </main>
  );
}
