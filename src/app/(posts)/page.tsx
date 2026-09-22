import List from '@/components/list';
import Tabs from '@/components/tabs';
import config from '@/configs/config.json';
import { getPosts } from '@/lib/MDX';

const Page = async () => {
  const posts = await getPosts();

  return (
    <>
      <h1 className="sr-only">{config.title}</h1>
      <Tabs active="posts" />
      <List posts={posts} />
    </>
  );
};

export default Page;
