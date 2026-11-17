// Splits text into words that slide in one after another; `grad` words get the moving gradient.
// Put it inside an element with the `lx-words` class and `data-fx-trigger` (see learn-effects.tsx).
export function Words({
  text,
  grad = [],
  start = 0,
}: {
  text: string;
  grad?: string[];
  start?: number;
}) {
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
