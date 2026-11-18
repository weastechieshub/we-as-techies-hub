'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import {
  BookOpen,
  Box,
  ChartColumn,
  CircleCheck,
  Cloud,
  Code,
  Compass,
  Database,
  FlaskConical,
  Layers,
  Link2,
  MapPin,
  Network,
  RefreshCw,
  Shield,
  Sparkles,
  User,
  X,
  type LucideIcon,
} from 'lucide-react';
import { ChannelIcon, channelNames } from '@/components/channel-icon';
import type { RoleIcon, RoleLesson, RoleSection, RoleSkill } from '@/lib/types';

const icons: Record<RoleIcon, LucideIcon> = {
  code: Code,
  layers: Layers,
  cloud: Cloud,
  database: Database,
  user: User,
  network: Network,
  check: CircleCheck,
  shield: Shield,
  sparkles: Sparkles,
  book: BookOpen,
  box: Box,
  refresh: RefreshCw,
  link: Link2,
  pin: MapPin,
  compass: Compass,
  chart: ChartColumn,
};

type Shape = 'block' | 'pill' | 'rail-left' | 'rail-right' | 'tab' | 'slab';

// The skills of one roadmap section, drawn as the parts of the system you build there: the
// platform at the base, the building skills stacked on it, testing and security up the sides,
// system design framing it all, and the engineer on top. A skill with lessons glows and opens
// its lesson list; sections without parts are plain or grouped blocks.
export function SkillStack({ section, delay }: { section: RoleSection; delay: number }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const triggers = useRef<Record<string, HTMLButtonElement | null>>({});
  const open = section.skills.find((k) => k.id === openId);
  const panelId = `${section.id}-lessons`;

  const close = (refocus = true) => {
    const id = openId;
    setOpenId(null);
    if (refocus && id) requestAnimationFrame(() => triggers.current[id]?.focus());
  };

  // A click anywhere else closes the lesson list.
  useEffect(() => {
    if (!openId) return;
    const away = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpenId(null);
    };
    document.addEventListener('pointerdown', away);
    return () => document.removeEventListener('pointerdown', away);
  }, [openId]);

  const block = (skill: RoleSkill, shape: Shape = 'block') => (
    <SkillBlock
      key={skill.id}
      skill={skill}
      shape={shape}
      order={section.skills.indexOf(skill)}
      open={openId === skill.id}
      panelId={panelId}
      onToggle={() => setOpenId(openId === skill.id ? null : skill.id)}
      register={(el) => {
        triggers.current[skill.id] = el;
      }}
    />
  );
  const part = (name: RoleSkill['part']) => section.skills.find((k) => k.part === name);
  const stacked = section.skills.some((k) => k.part);
  const groups = [...new Set(section.skills.flatMap((k) => (k.group ? [k.group] : [])))];
  const [role, design, testing, security, operations, platform] = (
    ['role', 'design', 'testing', 'security', 'operations', 'platform'] as const
  ).map(part);

  return (
    <div className="rm-stk" ref={root} data-fx style={{ '--d': delay } as CSSProperties}>
      {stacked ? (
        <>
          {role && block(role, 'pill')}
          <div
            className="rm-frame"
            style={{
              gridTemplateColumns: `${testing ? '30px ' : ''}minmax(0, 1fr)${security ? ' 30px' : ''}`,
            }}
          >
            {design && block(design, 'tab')}
            {testing && block(testing, 'rail-left')}
            <div className="rm-mid">
              {section.skills.filter((k) => k.part === 'layer').map((k) => block(k))}
            </div>
            {security && block(security, 'rail-right')}
          </div>
          {operations && block(operations)}
          {platform && block(platform, 'slab')}
        </>
      ) : (
        <>
          {section.skills.filter((k) => !k.group).map((k) => block(k))}
          {groups.map((g) => (
            <div key={g} className="rm-frame">
              <div className="rm-tab">{g}</div>
              {section.skills.filter((k) => k.group === g).map((k) => block(k))}
            </div>
          ))}
        </>
      )}
      {open && <Lessons id={panelId} section={section} skill={open} onClose={close} />}
    </div>
  );
}

function SkillBlock({
  skill,
  shape,
  order,
  open,
  panelId,
  onToggle,
  register,
}: {
  skill: RoleSkill;
  shape: Shape;
  // The block's place in its section: blocks arrive one after another in this order.
  order: number;
  open: boolean;
  panelId: string;
  onToggle: () => void;
  register: (el: HTMLButtonElement | null) => void;
}) {
  const Icon = icons[skill.icon];
  const count = skill.lessons.length;
  const lessons = `${count} ${count === 1 ? 'lesson' : 'lessons'}`;
  const rail = shape === 'rail-left' || shape === 'rail-right';
  // lx-tilt makes a block lean toward the pointer, with a spotlight (see learn-effects.tsx).
  const cls = {
    block: 'rm-blk lx-tilt',
    pill: 'rm-blk rm-pill lx-tilt',
    'rail-left': 'rm-blk rm-rail lx-tilt',
    'rail-right': 'rm-blk rm-rail lx-tilt',
    tab: 'rm-tab',
    slab: 'rm-blk rm-slab lx-tilt',
  }[shape];
  const place = { '--k': order } as CSSProperties;
  const body = (
    <>
      <Icon className="rm-ic" size={16} aria-hidden />
      {rail ? (
        <span className={`rm-vt ${shape === 'rail-left' ? 'is-up' : ''}`}>{skill.title}</span>
      ) : count && shape === 'block' ? (
        <span className="rm-name">
          <span>{skill.title}</span>
          <span className="rm-dots">
            {skill.lessons.slice(0, 12).map((_, i) => (
              <i key={i} className="rm-d" style={{ '--k': i } as CSSProperties} />
            ))}
            <span className="rm-cnt">{lessons}</span>
          </span>
        </span>
      ) : (
        <span>{skill.title}</span>
      )}
      {count > 0 && shape !== 'block' && (
        <span className="rm-badge">
          {count}
          <span className="sr-only"> {count === 1 ? 'lesson' : 'lessons'}</span>
        </span>
      )}
    </>
  );
  if (!count)
    return (
      <div className={cls} style={place}>
        {body}
      </div>
    );
  return (
    <button
      type="button"
      ref={register}
      className={`${cls} is-live`}
      style={place}
      aria-expanded={open}
      aria-controls={open ? panelId : undefined}
      onClick={onToggle}
    >
      {body}
    </button>
  );
}

// The lesson list of one skill: each lesson's title, its three channel links, and its lab.
function Lessons({
  id,
  section,
  skill,
  onClose,
}: {
  id: string;
  section: RoleSection;
  skill: RoleSkill;
  onClose: (refocus?: boolean) => void;
}) {
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    panel.current?.focus();
  }, [skill.id]);
  const count = skill.lessons.length;
  return (
    <div
      id={id}
      ref={panel}
      className="rm-pop"
      role="dialog"
      aria-label={`${skill.title} lessons`}
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
    >
      <div className="rm-pop-head">
        <div>
          <p className="lx-eyebrow">
            {section.title.split(':')[0]} · {count} {count === 1 ? 'lesson' : 'lessons'}
          </p>
          <h3>{skill.title}</h3>
        </div>
        <button type="button" className="rm-x" onClick={() => onClose()} aria-label="Close lessons">
          <X size={18} aria-hidden />
        </button>
      </div>
      <ol className="rm-rows">
        {skill.lessons.map((lesson, i) => (
          <li key={i} className="rm-row" style={{ '--i': i } as CSSProperties}>
            <span className="rm-num">{i + 1}</span>
            <span className="rm-lt">{lesson.title}</span>
            <span className="rm-acts">
              {/* The lab comes first: practising here is what the site is for. */}
              {lesson.labUrl ? (
                <a className="rm-lab is-live" href={lesson.labUrl}>
                  <FlaskConical size={13} aria-hidden />
                  Open lab
                </a>
              ) : (
                <span className="rm-lab">
                  <FlaskConical size={13} aria-hidden />
                  Lab soon
                </span>
              )}
              <ChannelLink platform="youtube" verb="Watch on" lesson={lesson} />
              <ChannelLink platform="facebook" verb="Watch on" lesson={lesson} />
              <ChannelLink platform="linkedin" verb="Read the PDF on" lesson={lesson} />
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

// An icon-only link to the lesson on one channel, or a greyed icon while that link is not up.
function ChannelLink({
  platform,
  verb,
  lesson,
}: {
  platform: 'youtube' | 'facebook' | 'linkedin';
  verb: string;
  lesson: RoleLesson;
}) {
  const url = lesson[`${platform}Url`];
  const name = channelNames[platform];
  if (!url) {
    const label = `${name}: coming soon`;
    return (
      <span className="rm-lk is-off" role="img" aria-label={label} title={label}>
        <ChannelIcon platform={platform} size={20} />
      </span>
    );
  }
  const label = `${verb} ${name}: ${lesson.title}`;
  return (
    <a
      className="rm-lk"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={`${verb} ${name}`}
    >
      <ChannelIcon platform={platform} size={20} />
    </a>
  );
}
