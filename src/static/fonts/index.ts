import localFont from 'next/font/local';

const ibm = localFont({
  src: [
    { path: './IBMPlexSansKR-Light.woff2', weight: '300' },
    { path: './IBMPlexSansKR-Regular.woff2', weight: '400' },
    { path: './IBMPlexSansKR-Medium.woff2', weight: '500' },
  ],
  display: 'swap',
  variable: '--font-sans',
});

const jetbrains = localFont({
  src: [
    { path: './JetBrainsMono-Regular.woff2', weight: '400' },
    { path: './JetBrainsMono-Bold.woff2', weight: '700' },
  ],
  display: 'swap',
  variable: '--font-mono',
});

export { ibm, jetbrains };
