import List from '@/components/list';
import Me from '@/components/me';
import { getPosts } from '@/lib/MDX';

const Page = async () => {
  const posts = await getPosts();

  return (
    <>
      <Me />
      <List posts={posts} />
    </>
  );
};

export default Page;
