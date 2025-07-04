import { IBM_Plex_Mono, IBM_Plex_Sans_KR } from 'next/font/google';

const sans = IBM_Plex_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-mono',
});

export { sans, mono };
