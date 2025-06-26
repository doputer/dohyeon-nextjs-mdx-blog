import Counter from '@/components/counter';
import List from '@/components/list';
import { getPosts } from '@/lib/MDX';

const Page = async () => {
  const posts = await getPosts();

  return (
    <>
      <Counter label="글" count={posts.length} />
      <List posts={posts} />
    </>
  );
};

export default Page;
