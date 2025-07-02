import { JetBrains_Mono } from 'next/font/google';
import localFont from 'next/font/local';

const pretendard = localFont({
  src: [
    { path: './Pretendard-Light.subset.woff2', weight: '300' },
    { path: './Pretendard-Regular.subset.woff2', weight: '400' },
    { path: './Pretendard-Medium.subset.woff2', weight: '500' },
    { path: './Pretendard-Semibold.subset.woff2', weight: '600' },
  ],
  display: 'swap',
  variable: '--font-sans',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
});

export { pretendard, jetbrains };
