import Chips from '@/components/chips';
import Timeline from '@/components/timeline';
import config from '@/configs/config.json';
import { getMdxs } from '@/lib/mdx';

const Page = async () => {
  const posts = await getMdxs();

  const writings = posts.filter((post) => post.frontmatter.category !== 'visualization');
  const visualizations = posts.filter((post) => post.frontmatter.category === 'visualization');

  return (
    <>
      <h1 className="sr-only">{config.title}</h1>
      <Timeline posts={writings} />
      <Chips posts={visualizations} />
    </>
  );
};

export default Page;
