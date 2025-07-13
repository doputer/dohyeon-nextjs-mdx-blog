import '@/static/styles/globals.css';

import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from 'next';

import type { PropsWithChildren } from 'react';

import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import Footer from '@/components/footer';
import Header from '@/components/header';
import ThemeScript from '@/components/theme-switch/theme-script';
import config from '@/configs/config.json';
import { sans } from '@/static/fonts';

const RootLayout = ({ children }: Readonly<PropsWithChildren>) => {
  return (
    <html lang="ko-KR" className={sans.variable} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col gap-12 px-6 py-12 sm:py-12">
          <Header />
          <main className="flex flex-1 flex-col gap-12">{children}</main>
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
  title: config.title,
  description: config.description,
  openGraph: {
    images: '/api/og',
    siteName: config.title,
    title: config.title,
    description: config.description,
    url: config.siteUrl,
  },
};

export default RootLayout;
