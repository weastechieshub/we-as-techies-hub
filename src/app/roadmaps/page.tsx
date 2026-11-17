import { permanentRedirect } from 'next/navigation';
import { roadmapSlugs } from '@/lib/roadmaps';
export default function RoadmapsPage() {
  const [first] = roadmapSlugs();
  permanentRedirect(first ? `/roadmaps/${first}` : '/#path');
}
