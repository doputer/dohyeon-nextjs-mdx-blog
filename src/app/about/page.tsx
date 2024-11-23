import type { Metadata } from 'next';

import Counter from '@/components/Counter';
import config from '@/configs/config.json';

const Page = async () => {
  return (
    <>
      <Counter label="me" />
      <p>
        안녕하세요.
        <br />
        프론트엔드 개발자 김도현 입니다.
      </p>
    </>
  );
};

export const metadata: Metadata = {
  title: [config.title, 'About'].join(' | '),
  openGraph: {
    title: [config.title, 'About'].join(' | '),
  },
};

export default Page;
