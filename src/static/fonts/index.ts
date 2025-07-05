import { Fira_Code, IBM_Plex_Sans_KR } from 'next/font/google';

const sans = IBM_Plex_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
});

const mono = Fira_Code({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-mono',
});

export { sans, mono };
