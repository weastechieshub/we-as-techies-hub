'use client';
import { useLayoutEffect, useRef, useState } from 'react';

export function RoadmapConnections({ count }: { count: number }) {
  const ref = useRef<SVGSVGElement>(null);
  const [paths, setPaths] = useState<string[]>([]);
  useLayoutEffect(() => {
    const section = ref.current?.parentElement;
    const node = section?.querySelector('.roadmap-node');
    if (!section || !node) return;
    const cards = [...section.querySelectorAll('.roadmap-item')];
    const update = () => {
      const area = section.getBoundingClientRect();
      const source = node.getBoundingClientRect();
      const mobile = window.matchMedia('(max-width:700px)').matches;
      setPaths(
        cards.map((card) => {
          const target = card.getBoundingClientRect();
          const left = target.left < source.left;
          const x1 = (mobile ? source.left : left ? source.left : source.right) - area.left;
          const y1 = (mobile ? source.bottom : source.top + source.height / 2) - area.top;
          const x2 = (mobile || !left ? target.left : target.right) - area.left;
          const y2 = target.top + target.height / 2 - area.top;
          const bend = mobile ? x1 - 22 : (x1 + x2) / 2;
          const arrow = mobile || !left ? -5 : 5;
          return `M ${x1} ${y1} C ${bend} ${y1}, ${bend} ${y2}, ${x2} ${y2} M ${x2 + arrow} ${y2 - 3} L ${x2} ${y2} L ${x2 + arrow} ${y2 + 3}`;
        }),
      );
    };
    const observer = new ResizeObserver(update);
    [section, node, ...cards].forEach((el) => observer.observe(el));
    update();
    return () => observer.disconnect();
  }, [count]);
  return (
    <svg ref={ref} className="roadmap-connections" aria-hidden="true">
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}
