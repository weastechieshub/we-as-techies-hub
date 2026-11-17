import type { Metadata, Viewport } from 'next';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource-variable/fraunces/soft.css';
import '@fontsource-variable/space-grotesk';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './globals.css';
import './mascot.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Header, Footer } from '@/components/chrome';
import { MascotGuide } from '@/components/learn/mascot-guide';
import { getProfile, siteUrl } from '@/lib/content';
import { shareImage } from '@/lib/seo';

export function generateMetadata(): Metadata {
  const p = getProfile();
  const title = `${p.name} — ${p.seoTitle || p.headline}`;
  const description = p.seoDescription || p.description;
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: title, template: `%s · ${p.name}` },
    description,
    applicationName: p.name,
    referrer: 'strict-origin-when-cross-origin',
    robots: p.preview ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: 'website',
      siteName: p.name,
      locale: 'en_US',
      title,
      description,
      url: '/',
      images: [shareImage],
    },
    twitter: { card: 'summary_large_image', title, description, images: [shareImage] },
  };
}
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'dark light',
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const p = getProfile();
  return (
    <html lang="en" suppressHydrationWarning>
      <body id="top">
        <ThemeProvider>
          <div className="site-frame">
            <a href="#main" className="skip-link">
              Skip to content
            </a>
            {p.preview && (
              <div className="preview-banner">
                <span className="dot" />
                Preview <span>· Not public yet</span>
              </div>
            )}
            <Header />
            {children}
            <Footer />
            <MascotGuide />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
