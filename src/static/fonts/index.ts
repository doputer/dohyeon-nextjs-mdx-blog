import { IBM_Plex_Sans_KR, JetBrains_Mono } from 'next/font/google';

const ibm = IBM_Plex_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-mono',
});

export { ibm, jetbrains };
