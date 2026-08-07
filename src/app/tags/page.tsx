import type { Metadata } from 'next';
import Link from 'next/link';

import Counter from '@/components/counter';
import config from '@/configs/config.json';
import { getPosts } from '@/lib/MDX';
import { encode } from '@/utils/uri';

const Page = async () => {
  const posts = await getPosts();
  const tags = (() => {
    const map = new Map<string, number>();

    for (const post of posts) {
      for (const tag of post.frontmatter.tags) {
        map.set(tag, (map.get(tag) ?? 0) + 1);
      }
    }

    return [...map.entries()].toSorted(([a], [b]) => a.localeCompare(b));
  })();

  return (
    <>
      <Counter label="태그" count={tags.length} />
      <ul className="flex flex-wrap gap-4">
        {tags.map(([tag, totalCount]) => (
          <li key={tag}>
            <Link href={`/tags/${encode(tag)}`} className="space-x-1 text-sm">
              <span className="uppercase">{tag}</span>
              <span className="font-medium">{totalCount}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export const metadata: Metadata = {
  title: 'Tags',
  description: `${config.title}의 태그 목록`,
  alternates: { canonical: '/tags' },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: config.title,
    images: '/api/og',
    title: 'Tags',
    url: `${config.siteUrl}/tags`,
  },
};

export default Page;
