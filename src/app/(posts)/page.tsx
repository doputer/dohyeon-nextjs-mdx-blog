import List from '@/components/list';
import config from '@/configs/config.json';
import { getMdxs } from '@/lib/mdx';

const Page = async () => {
  const posts = await getMdxs();

  return (
    <>
      <h1 className="sr-only">{config.title}</h1>
      <List posts={posts} />
    </>
  );
};

export default Page;
