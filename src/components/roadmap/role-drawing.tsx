import type { CSSProperties, ReactNode } from 'react';
import type { RoleDrawingKind } from '@/lib/types';

// The picture above each roadmap section: what you can build by the end of it. The same system
// grows from drawing to drawing. Every drawing stands on the line at y = 148, and a section's
// flag (the job title it leads to) stands at its right-hand end.
// Parts rise in one after another (--n is their order); role-roadmap.css has the motion.
const widths: Record<RoleDrawingKind, number> = {
  'web-app': 206,
  'agent-app': 264,
  services: 264,
  platform: 264,
  beyond: 202,
};

// What each drawing shows, for people who cannot see it.
const labels: Record<RoleDrawingKind, string> = {
  'web-app': 'A screen, an API and a database.',
  'agent-app': 'The same app with one agent, its knowledge and its tools.',
  services: 'The app split into services behind a gateway, with several agents.',
  platform: 'One agent platform with many teams building on it.',
  beyond: "Two places the work goes next: a customer's building and a whole organization.",
};

const order = (n: number) => ({ '--n': n }) as CSSProperties;

function Part({ n, children }: { n: number; children: ReactNode }) {
  return (
    <g className="rm-part" style={order(n)}>
      {children}
    </g>
  );
}

// A browser window: the screen people use.
function Screen({ x }: { x: number }) {
  return (
    <>
      <rect className="rm-fs" x={x} y="112" width="44" height="36" rx="4" />
      <path d={`M${x} 121h44`} />
      <circle className="rm-dt" cx={x + 5.5} cy="116.5" r="1.2" />
      <circle className="rm-dt" cx={x + 10.5} cy="116.5" r="1.2" />
    </>
  );
}

function Box({ x, y, w, h, label }: { x: number; y: number; w: number; h: number; label: string }) {
  return (
    <>
      <rect className="rm-fs" x={x} y={y} width={w} height={h} rx="4" />
      <text className="rm-tx" x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle">
        {label}
      </text>
    </>
  );
}

// A database cylinder whose top edge is at `y` and whose base sits on the line.
function Data({ x, y }: { x: number; y: number }) {
  return (
    <>
      <path className="rm-fs" d={`M${x} ${y}v${143 - y}a18 5 0 0 0 36 0v-${143 - y}`} />
      <ellipse className="rm-fs" cx={x + 18} cy={y} rx="18" ry="5" />
    </>
  );
}

// The four-point spark that marks an agent.
function Spark({ x, y, r = 5, delay = 0 }: { x: number; y: number; r?: number; delay?: number }) {
  const c = r / 10;
  return (
    <path
      className="rm-spark"
      style={{ animationDelay: `${delay}s` }}
      d={`M${x} ${y - r}q${c} ${r - c} ${r} ${r}-${r - c} ${c}-${r} ${r}-${c}-${r - c}-${r}-${r} ${r - c}-${c} ${r}-${r}z`}
    />
  );
}

function Agent({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <>
      <rect className="rm-ai" x={x} y={y} width="50" height="26" rx="5" />
      <Spark x={x + 10} y={y + 13} delay={delay} />
      <text className="rm-ai-t" x={x + 18} y={y + 17}>
        agent
      </text>
    </>
  );
}

// Two people and their agent, standing on the platform.
function Team({ x, delay }: { x: number; delay: number }) {
  return (
    <>
      <circle className="rm-fs" cx={x + 9} cy="92" r="5" />
      <path className="rm-fs" d={`M${x + 1} 117a8 10 0 0 1 16 0`} />
      <circle className="rm-fs" cx={x + 27} cy="92" r="5" />
      <path className="rm-fs" d={`M${x + 19} 117a8 10 0 0 1 16 0`} />
      <rect className="rm-ai" x={x + 39} y="99" width="18" height="18" rx="4" />
      <Spark x={x + 48} y={108} delay={delay} />
    </>
  );
}

// A dot that travels along the wires, showing work moving through the system.
function Pulse({ path, dur, begin = 0 }: { path: string; dur: number; begin?: number }) {
  return (
    <circle className="rm-pulse" r="2.6">
      <animateMotion dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" path={path} />
    </circle>
  );
}

function Flag({ x, y, text }: { x: number; y: number; text: string }) {
  const w = Math.round(text.length * 6.9 + 26);
  return (
    <g className="rm-flag">
      <path className="rm-pole" d={`M${x} 148V${y}`} />
      <g className="rm-pennant">
        <path className="rm-flag-fill" d={`M${x} ${y}h-${w}l8 9-8 9h${w}z`} />
        <text className="rm-flag-t" x={x - (w - 8) / 2} y={y + 13} textAnchor="middle">
          {text}
        </text>
      </g>
    </g>
  );
}

function WebApp() {
  return (
    <>
      <Part n={0}>
        <Screen x={22} />
        <text x="44" y="104" textAnchor="middle">
          screen
        </text>
      </Part>
      <path className="rm-wire" pathLength={1} d="M66 134h18M126 134h20" />
      <Part n={1}>
        <Box x={84} y={120} w={42} h={28} label="API" />
      </Part>
      <Part n={2}>
        <Data x={146} y={118} />
        <text x="164" y="104" textAnchor="middle">
          data
        </text>
      </Part>
      <Pulse path="M66 134H146" dur={2.4} />
    </>
  );
}

function AgentApp() {
  return (
    <>
      <Part n={0}>
        <Screen x={10} />
      </Part>
      <path
        className="rm-wire"
        pathLength={1}
        d="M54 134h16M112 134h18M192 134h20M135 78l15 30M209 78l-33 30"
      />
      <Part n={1}>
        <Box x={70} y={120} w={42} h={28} label="API" />
      </Part>
      <Part n={2}>
        <rect className="rm-ai" x="130" y="108" width="62" height="40" rx="6" />
        <Spark x={143} y={128} r={7} />
        <text className="rm-ai-t" x="154" y="132">
          agent
        </text>
      </Part>
      <Part n={3}>
        <rect className="rm-fs" x="96" y="56" width="78" height="22" rx="11" />
        <text className="rm-tx" x="135" y="71" textAnchor="middle">
          knowledge
        </text>
        <rect className="rm-fs" x="184" y="56" width="50" height="22" rx="11" />
        <text className="rm-tx" x="209" y="71" textAnchor="middle">
          tools
        </text>
      </Part>
      <Part n={4}>
        <Data x={212} y={118} />
        <text x="230" y="104" textAnchor="middle">
          data
        </text>
      </Part>
      <Pulse path="M54 134H212" dur={3} />
      <Pulse path="M135 78L150 108" dur={1.8} begin={0.6} />
      <Pulse path="M209 78L176 108" dur={1.8} begin={1.5} />
    </>
  );
}

function Services() {
  return (
    <>
      <Part n={0}>
        <Screen x={6} />
      </Part>
      <path
        className="rm-wire"
        pathLength={1}
        d="M50 134h12M78 104h178M123 92v12M179 92v12M233 92v12M118 120v-16M171 120v-16M222 119v-15"
      />
      <Part n={1}>
        <rect className="rm-fs" x="62" y="84" width="16" height="64" rx="4" />
        <text x="70" y="76" textAnchor="middle">
          gateway
        </text>
      </Part>
      <Part n={2}>
        <Agent x={98} y={66} delay={0} />
      </Part>
      <Part n={3}>
        <Agent x={154} y={66} delay={0.5} />
      </Part>
      <Part n={4}>
        <Agent x={208} y={66} delay={1} />
      </Part>
      <Part n={5}>
        <Box x={98} y={120} w={40} h={28} label="API" />
        <Box x={148} y={120} w={46} h={28} label="tools" />
        <Data x={204} y={124} />
      </Part>
      <Pulse path="M78 104H256" dur={2.6} />
      <Pulse path="M256 104H78" dur={2.6} begin={1.3} />
    </>
  );
}

function Platform() {
  return (
    <>
      <text x="10" y="74">
        many teams
      </text>
      <Part n={0}>
        <rect className="rm-ai" x="6" y="118" width="250" height="30" rx="6" />
        <text className="rm-ai-t rm-big" x="131" y="138" textAnchor="middle">
          agent platform
        </text>
      </Part>
      {[10, 72, 134, 196].map((x, i) => (
        <Part key={x} n={i + 1}>
          <Team x={x} delay={i * 0.45} />
        </Part>
      ))}
    </>
  );
}

function Beyond() {
  return (
    <>
      <Part n={0}>
        <text x="47" y="76" textAnchor="middle">
          customer
        </text>
        <rect className="rm-fs" x="16" y="84" width="62" height="64" />
        <path d="M24 92h8v8h-8zM43 92h8v8h-8zM62 92h8v8h-8zM24 106h8v8h-8zM43 106h8v8h-8zM62 106h8v8h-8zM24 124h8v8h-8zM62 124h8v8h-8z" />
        <rect className="rm-ai rm-glow" x="41" y="128" width="12" height="20" />
      </Part>
      <Part n={1}>
        <text x="148" y="68" textAnchor="middle">
          organization
        </text>
        <rect className="rm-fs" x="104" y="76" width="88" height="72" rx="4" />
        <path className="rm-wire" pathLength={1} d="M148 98v12M125 122v-12h46v12" />
        <rect className="rm-ai rm-glow" x="137" y="86" width="22" height="12" rx="2" />
        <rect className="rm-ai rm-glow" x="114" y="122" width="22" height="12" rx="2" />
        <rect className="rm-ai rm-glow" x="160" y="122" width="22" height="12" rx="2" />
      </Part>
      <Pulse path="M148 98V110H125V122" dur={2.2} />
      <Pulse path="M148 98V110H171V122" dur={2.2} begin={1.1} />
    </>
  );
}

const drawings: Record<RoleDrawingKind, () => ReactNode> = {
  'web-app': WebApp,
  'agent-app': AgentApp,
  services: Services,
  platform: Platform,
  beyond: Beyond,
};

export function RoleDrawing({ kind, flag }: { kind: RoleDrawingKind; flag?: string }) {
  const w = widths[kind];
  const label = labels[kind];
  const Drawing = drawings[kind];
  return (
    <svg
      className="rm-drawing"
      viewBox={`0 0 ${w} 150`}
      preserveAspectRatio="xMidYMax meet"
      role="img"
      aria-label={flag ? `${label} A flag at the end says ${flag}.` : label}
    >
      {flag && <Flag x={w - 2} y={kind === 'web-app' ? 30 : 16} text={flag} />}
      <Drawing />
    </svg>
  );
}
