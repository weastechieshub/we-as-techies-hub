import type { Article } from '@/lib/types';

function Box({ x, y, width = 46, label }: { x: number; y: number; width?: number; label: string }) {
  return (
    <g>
      <rect x={x} y={y} width={width} height={26} rx={4} />
      <text x={x + width / 2} y={y + 16} textAnchor="middle">
        {label}
      </text>
    </g>
  );
}

function Flow({ d, x, y, down = false }: { d: string; x: number; y: number; down?: boolean }) {
  return (
    <g>
      <path d={d} />
      <path d="M-4 -3 L0 0 L-4 3" transform={`translate(${x} ${y}) rotate(${down ? 90 : 0})`} />
    </g>
  );
}

/** Decorative, topic-specific notes. A Markdown image always takes precedence. */
export function ArticleSketch({ article }: { article: Article }) {
  const subject = `${article.slug} ${article.title} ${article.topic}`.toLowerCase();
  let drawing;
  if (/context|prompt/.test(subject)) {
    drawing = (
      <>
        <text x="16" y="20">
          CONTEXT
        </text>
        <rect x="14" y="29" width="88" height="58" rx="5" />
        <path className="sketch-detail" d="M25 42h65M25 54h50M25 66h60M25 78h34" />
        <Flow d="M103 58H120" x={120} y={58} />
        <rect x="123" y="44" width="25" height="28" rx="5" />
        <circle cx="135" cy="58" r="5" />
      </>
    );
  } else if (/retriev|ground|source|vector/.test(subject)) {
    drawing = (
      <>
        <path className="sketch-detail" d="M12 50V14h31M19 56V21h31" />
        <rect x="26" y="28" width="35" height="42" rx="4" />
        <path d="M34 39h19M34 47h19M34 55h12" />
        <Flow d="M63 50H84" x={84} y={50} />
        <Box x={88} y={37} width={61} label="ANSWER" />
        <path className="sketch-detail" d="M39 81h94" />
        <text x="40" y="99">
          SOURCE → USE
        </text>
      </>
    );
  } else if (/evaluat|observab|latency|quality/.test(subject)) {
    drawing = (
      <>
        <path d="M20 18V85H146" />
        <rect x="33" y="57" width="18" height="28" rx="2" />
        <rect x="65" y="40" width="18" height="45" rx="2" />
        <rect x="97" y="24" width="18" height="61" rx="2" />
        <path className="sketch-detail" strokeDasharray="3 5" d="M21 33h125" />
        <path d="M127 57l5 5 13-16" />
        <text x="30" y="103">
          MEASURE · REFINE
        </text>
      </>
    );
  } else if (/agent|tool|api|contract/.test(subject)) {
    drawing = (
      <>
        <Box x={10} y={42} width={58} label="AGENT" />
        <Box x={108} y={7} width={42} label="API" />
        <Box x={108} y={43} width={42} label="DATA" />
        <Box x={108} y={79} width={42} label="TOOL" />
        <Flow d="M70 54C89 54 87 20 105 20" x={105} y={20} />
        <Flow d="M70 55H105" x={105} y={55} />
        <Flow d="M70 57C88 57 87 92 105 92" x={105} y={92} />
      </>
    );
  } else if (/model|inference|llm/.test(subject)) {
    drawing = (
      <>
        <Box x={45} y={9} width={70} label="PROMPT" />
        <Box x={7} y={73} width={64} label="MODEL A" />
        <Box x={89} y={73} width={64} label="MODEL B" />
        <Flow d="M80 38V51H39V68" x={39} y={68} down />
        <Flow d="M80 51H121V68" x={121} y={68} down />
      </>
    );
  } else if (/deploy|delivery|endpoint|pipeline|release|azure/.test(subject)) {
    drawing = (
      <>
        <Box x={9} y={11} width={64} label="BUILD" />
        <Box x={87} y={74} width={66} label="SHIP" />
        <Flow d="M75 24H120V68" x={120} y={68} down />
        <path className="sketch-detail" d="M22 49h42M22 61h29M22 73h35" />
        <circle cx="42" cy="94" r="9" />
        <path d="M38 94l3 3 5-6" />
      </>
    );
  } else {
    drawing = (
      <>
        <rect x={13} y={16} width={134} height={80} rx={6} />
        <path d="M13 34h134M58 34v62" />
        <circle cx={23} cy={25} r={2} />
        <circle cx={32} cy={25} r={2} />
        <path className="sketch-detail" d="M24 48h23M24 59h17M24 70h22" />
        <rect x={70} y={47} width={64} height={34} rx={4} />
        <path d="M79 66l10-8 13 12 21-15" />
      </>
    );
  }
  return (
    <svg
      className="article-sketch"
      viewBox="0 0 160 112"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {drawing}
    </svg>
  );
}
