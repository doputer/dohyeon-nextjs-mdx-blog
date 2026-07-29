import localFont from 'next/font/local';

const sans = localFont({
  src: [
    { path: './SUIT-Regular.woff2', weight: '400' },
    { path: './SUIT-Medium.woff2', weight: '500' },
    { path: './SUIT-Bold.woff2', weight: '700' },
  ],
  variable: '--font-sans',
});

export { sans };
