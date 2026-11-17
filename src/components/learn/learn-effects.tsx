'use client';
import { useEffect } from 'react';

// Entrance effects for the learning page: elements with [data-fx] rise in (staggered by --d) the
// first time they appear, [data-fx-trigger] only gets the class (for its own animation), and
// .lx-tilt cards tilt toward the pointer with a spotlight that follows it.
export function LearnEffects() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('.lx');
    if (!root) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    root.classList.add('fx-ready');
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('fx-in');
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12, rootMargin: '0px 0px -30px 0px' },
    );
    root.querySelectorAll('[data-fx], [data-fx-trigger]').forEach((el) => io.observe(el));

    const cleanups: (() => void)[] = [];
    if (!reduce && window.matchMedia('(pointer: fine)').matches) {
      root.querySelectorAll<HTMLElement>('.lx-tilt').forEach((el) => {
        const move = (ev: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const x = (ev.clientX - r.left) / r.width;
          const y = (ev.clientY - r.top) / r.height;
          el.style.setProperty('--mx', `${x * 100}%`);
          el.style.setProperty('--my', `${y * 100}%`);
          el.style.setProperty('--rx', `${(0.5 - y) * 7}deg`);
          el.style.setProperty('--ry', `${(x - 0.5) * 9}deg`);
        };
        const leave = () => {
          el.style.setProperty('--rx', '0deg');
          el.style.setProperty('--ry', '0deg');
        };
        el.addEventListener('pointermove', move);
        el.addEventListener('pointerleave', leave);
        cleanups.push(() => {
          el.removeEventListener('pointermove', move);
          el.removeEventListener('pointerleave', leave);
        });
      });
    }
    return () => {
      io.disconnect();
      cleanups.forEach((f) => f());
    };
  }, []);
  return null;
}
