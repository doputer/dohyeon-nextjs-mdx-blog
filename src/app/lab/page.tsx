import type { Metadata } from 'next';

import Gallery from '@/components/gallery';
import Tabs from '@/components/tabs';
import { getLabs } from '@/lib/lab';

const Page = async () => {
  const labs = await getLabs();

  return (
    <>
      <h1 className="sr-only">실험실</h1>
      <Tabs active="lab" />
      <Gallery labs={labs} />
    </>
  );
};

export const metadata: Metadata = {
  title: '실험실',
  alternates: { canonical: '/lab' },
};

export default Page;
