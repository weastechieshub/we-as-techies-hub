'use client';
import { useLayoutEffect, useRef, useState } from 'react';
import { MascotHead } from './mascot-head';

// A winding road through every .lx-node inside it. The road draws itself in when it first
// appears, its centre line keeps moving, and the head mascot runs along it on its own loop.
export function LearningRoad({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const glow = useRef<SVGPathElement>(null);
  const [d, setD] = useState('');
  const [len, setLen] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const box = el.getBoundingClientRect();
      const pts = [...el.querySelectorAll<HTMLElement>('.lx-node')].map((n) => {
        const r = n.getBoundingClientRect();
        return [r.left + r.width / 2 - box.left, r.top + r.height / 2 - box.top] as const;
      });
      if (!pts.length) return;
      const [fx, fy] = pts[0];
      const [lx, ly] = pts[pts.length - 1];
      let path = `M ${fx} ${Math.max(0, fy - 90)} L ${fx} ${fy}`;
      for (let i = 1; i < pts.length; i++) {
        const [x1, y1] = pts[i - 1];
        const [x2, y2] = pts[i];
        const half = (y2 - y1) / 2;
        path += ` C ${x1} ${y1 + half}, ${x2} ${y2 - half}, ${x2} ${y2}`;
      }
      path += ` L ${lx} ${ly + 90}`;
      setD(path);
    };
    const ro = new ResizeObserver(update);
    ro.observe(el);
    update();
    return () => ro.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (glow.current && d) setLen(Math.ceil(glow.current.getTotalLength()));
  }, [d]);

  return (
    <div
      ref={ref}
      className="lx-road"
      data-fx-trigger
      style={{ '--road-len': len } as React.CSSProperties}
    >
      <svg className="lx-road-svg" aria-hidden="true">
        <path className="lx-road-base" d={d} />
        <path className="lx-road-dash" d={d} />
        <path ref={glow} className="lx-road-glow" d={d} />
      </svg>
      {d && (
        <div className="lx-runner" style={{ offsetPath: `path('${d}')` }} aria-hidden="true">
          <MascotHead size={62} />
        </div>
      )}
      {children}
    </div>
  );
}
