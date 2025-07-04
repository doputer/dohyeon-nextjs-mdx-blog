import '@/static/styles/globals.css';
import 'katex/dist/katex.min.css';

import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from 'next';

import type { PropsWithChildren } from 'react';

import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import Footer from '@/components/footer';
import Header from '@/components/header';
import ThemeScript from '@/components/theme-switch/theme-script';
import config from '@/configs/config.json';
import { mono, sans } from '@/static/fonts';
import { cn } from '@/utils/cn';

const RootLayout = ({ children }: Readonly<PropsWithChildren>) => {
  return (
    <html lang="ko-KR" className={cn(sans.variable, mono.variable)}>
      <head>
        <ThemeScript />
      </head>
      <body>
        <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col gap-6 px-6 py-8 sm:gap-8 sm:py-12">
          <Header />
          <main className="flex flex-1 flex-col gap-6 sm:gap-8">{children}</main>
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
