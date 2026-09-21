import type { Metadata } from 'next';

import Gallery from '@/components/gallery';
import { getPlaygrounds } from '@/lib/playground';

const Page = async () => {
  const playgrounds = await getPlaygrounds();

  return (
    <>
      <h1 className="sr-only">플레이그라운드</h1>
      <Gallery playgrounds={playgrounds} />
    </>
  );
};

export const metadata: Metadata = {
  title: 'Playground',
  alternates: { canonical: '/playground' },
};

export default Page;
