'use client';
import { useEffect, useState } from 'react';

// The head-only mascot from the videos: it blinks on its own and "talks" (mouth open/closed)
// while its speech bubble types a line. Purely decorative, so it is hidden from screen readers.
const FRAMES = {
  rest: '/images/mascot/head-rest.webp',
  open: '/images/mascot/head-open.webp',
  blink: '/images/mascot/head-blink.webp',
} as const;
type Frame = keyof typeof FRAMES;

export function MascotHead({
  size = 120,
  lines,
  bubble = 'left',
  className = '',
  once = false,
}: {
  size?: number;
  lines?: string[];
  bubble?: 'left' | 'right';
  className?: string;
  // Say the lines once, then hide the bubble after a few seconds (used by the corner guide).
  once?: boolean;
}) {
  const [frame, setFrame] = useState<Frame>('rest');
  const [text, setText] = useState('');
  const [quiet, setQuiet] = useState(false);
  const script = lines?.join('\n') ?? '';

  useEffect(() => {
    const said = script ? script.split('\n') : [];
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setText(said[0] ?? '');
      return;
    }
    let alive = true;
    const timers: number[] = [];
    const wait = (ms: number) => new Promise((r) => timers.push(window.setTimeout(r, ms)));
    (async () => {
      while (alive) {
        await wait(2400 + Math.random() * 2600);
        if (!alive) return;
        setFrame((f) => (f === 'open' ? f : 'blink'));
        await wait(140);
        setFrame((f) => (f === 'blink' ? 'rest' : f));
      }
    })();
    if (said.length)
      (async () => {
        await wait(1100);
        for (let i = 0; alive; i++) {
          const line = said[i % said.length];
          for (let c = 1; c <= line.length && alive; c++) {
            setText(line.slice(0, c));
            setFrame(c % 3 === 0 ? 'rest' : 'open');
            await wait(42);
          }
          setFrame('rest');
          if (once && i === said.length - 1) {
            await wait(4500);
            if (alive) setQuiet(true);
            return;
          }
          await wait(2800);
        }
      })();
    return () => {
      alive = false;
      timers.forEach(clearTimeout);
    };
  }, [script, once]);

  return (
    <div
      className={`lx-head ${className}`}
      style={{ '--size': `${size}px` } as React.CSSProperties}
      aria-hidden="true"
    >
      {script && !quiet && (
        <p className={`lx-bubble lx-bubble-${bubble}`}>
          <span>{text}</span>
          <span className="lx-caret" />
        </p>
      )}
      <div className="lx-head-img">
        {(Object.keys(FRAMES) as Frame[]).map((f) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={f}
            src={FRAMES[f]}
            alt=""
            width={319}
            height={400}
            className={f === frame ? 'on' : ''}
          />
        ))}
      </div>
    </div>
  );
}
