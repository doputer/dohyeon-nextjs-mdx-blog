import Link from 'next/link';

import Counter from '@/components/counter';
import List from '@/components/list';
import { getPosts } from '@/lib/MDX';

const Page = async () => {
  const posts = await getPosts();
  const slicedPosts = posts.slice(0, 5);

  return (
    <>
      <Counter label="Latest" count={slicedPosts.length} />
      <List posts={slicedPosts} />
      <div className="text-right text-lg">
        <Link href="/pages/1" className="text-link max-mobile:text-sm">
          All Posts →
        </Link>
      </div>
    </>
  );
};

export default Page;
