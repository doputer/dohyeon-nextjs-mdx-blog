import '@/static/styles/index.css';
import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';

import Footer from '@/components/footer';
import Header from '@/components/header';
import ThemeScript from '@/components/theme-switch/theme-script';
import config from '@/configs/config.json';
import { sans } from '@/static/fonts';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

const RootLayout = ({ children }: Readonly<PropsWithChildren>) => {
  return (
    <html lang="ko-KR" className={sans.variable} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:border focus:border-line focus:bg-background focus:px-3 focus:py-2 focus:text-sm"
        >
          본문으로 건너뛰기
        </a>
        <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col gap-12 px-6 py-12">
          <Header />
          <main id="content" className="flex flex-1 flex-col gap-12">
            {children}
          </main>
          <Footer />
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
      <GoogleAnalytics gaId={config.gtag} />
    </html>
  );
};

export const metadata: Metadata = {
  metadataBase: new URL(config.siteUrl),
  title: {
    default: config.title,
    template: `%s | ${config.title}`,
  },
  description: config.description,
  alternates: {
    canonical: '/',
    types: { 'application/rss+xml': '/api/rss' },
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    images: '/api/og',
    siteName: config.title,
    title: {
      default: config.title,
      template: `%s | ${config.title}`,
    },
    description: config.description,
    url: config.siteUrl,
  },
};

export default RootLayout;
