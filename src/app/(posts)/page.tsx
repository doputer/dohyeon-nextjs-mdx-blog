import Chips from '@/components/chips';
import Timeline from '@/components/timeline';
import config from '@/configs/config.json';
import { getMdxs } from '@/lib/mdx';

const Page = async () => {
  const posts = await getMdxs();

  const writings = posts.filter((post) => post.frontmatter.category !== 'visualization');
  const visualizations = posts.filter((post) => post.frontmatter.category === 'visualization');

  return (
    <div className="flex flex-col gap-10">
      <h1 className="sr-only">{config.title}</h1>
      <Timeline title="글" posts={writings} />
      <Chips title="시각화" posts={visualizations} />
    </div>
  );
};

export default Page;
