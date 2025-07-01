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

    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  })();

  return (
    <>
      <Counter label="태그" count={tags.length} />
      <section className="flex flex-wrap gap-4">
        {tags.map(([tag, totalCount]) => (
          <Link key={tag} href={`/tags/${encode(tag)}`} className="space-x-1 text-sm">
            <span className="text-link uppercase">{tag}</span>
            <span>{totalCount}</span>
          </Link>
        ))}
      </section>
    </>
  );
};

export const metadata: Metadata = {
  title: [config.title, 'Tags'].join(' | '),
  openGraph: {
    title: [config.title, 'Tags'].join(' | '),
  },
};

export default Page;
