import fs from 'node:fs';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import { getProfile } from '@/lib/content';

// The social share image, built once into /og-image.png (a real .png file, so static hosts
// serve it with the right type). Pages point to it from src/app/layout.tsx and src/lib/seo.ts.
export const dynamic = 'force-static';

const size = { width: 1200, height: 630 };

export function GET() {
  const p = getProfile();
  const photo = p.photo
    ? `data:image/png;base64,${fs.readFileSync(path.join(process.cwd(), 'public', p.photo)).toString('base64')}`
    : null;
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        background: '#030712',
        color: '#f9fafb',
        padding: 80,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flex: 1,
        }}
      >
        <div style={{ display: 'flex', fontSize: 25, color: '#35e0f1', letterSpacing: 4 }}>
          {p.name.toUpperCase()}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'flex', fontSize: 68, maxWidth: 720, lineHeight: 1.1 }}>
            {p.headline}
          </div>
          <div style={{ display: 'flex', fontSize: 30, color: '#9ca3af' }}>
            {p.seoTitle || 'AI engineering and system design'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          {['#35e0f1', '#60a5fa', '#ff5a3c', '#ff5ca8', '#ffd23f'].map((c) => (
            <div key={c} style={{ width: 110, height: 4, background: c }} />
          ))}
        </div>
      </div>
      {photo && (
        <img
          src={photo}
          alt=""
          width={340}
          height={340}
          style={{ alignSelf: 'flex-end', marginLeft: 40 }}
        />
      )}
    </div>,
    size,
  );
}
