import type { Metadata } from 'next';
import Link from 'next/link';

import Counter from '@/components/Counter';
import config from '@/configs/config.json';
import { getPosts } from '@/lib/MDX';
import { encode } from '@/utils/uri';

const Page = async () => {
  const posts = await getPosts();
  const tagsObject = posts.reduce(
    (object, post) => {
      post.frontmatter.tags.forEach((tag) => {
        object[tag] = (object[tag] || 0) + 1;
      });
      return object;
    },
    {} as Record<string, number>
  );
  const sortedTagsArray = Object.entries(tagsObject).sort(([a], [b]) => a.localeCompare(b));

  return (
    <>
      <Counter label="tags" count={Object.keys(tagsObject).length} />
      <div className="flex flex-wrap gap-4">
        {sortedTagsArray.map(([tag, totalCount]) => (
          <Link key={tag} href={`/tags/${encode(tag)}`} className="space-x-1 text-sm">
            <span className="text-secondary uppercase">{tag}</span>
            <span>{totalCount}</span>
          </Link>
        ))}
      </div>
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
