import type { Metadata } from 'next';

import Counter from '@/components/counter';
import config from '@/configs/config.json';

const Page = async () => {
  return (
    <>
      <Counter label="소개" />
      <section className="space-y-4">
        <p>
          안녕하세요.
          <br />
          프론트엔드 개발자 김도현 입니다.
        </p>
        <p>
          Email.{' '}
          <a href={`mailto:${config.social.email}`} target="_blank" className="text-link">
            {config.social.email}
          </a>
          <br />
          GitHub.{' '}
          <a href={config.social.github} target="_blank" className="text-link">
            {config.social.github}
          </a>
        </p>
      </section>
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
