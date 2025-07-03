import { JetBrains_Mono } from 'next/font/google';
import localFont from 'next/font/local';

const pretendard = localFont({
  src: [
    { path: './Pretendard-Regular.subset.woff2', weight: '400' },
    { path: './Pretendard-Medium.subset.woff2', weight: '500' },
    { path: './Pretendard-SemiBold.subset.woff2', weight: '600' },
    { path: './Pretendard-Bold.subset.woff2', weight: '700' },
  ],
  variable: '--font-sans',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-mono',
});

export { pretendard, jetbrains };
