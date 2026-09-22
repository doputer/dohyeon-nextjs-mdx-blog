import Group from '@/components/group';
import config from '@/configs/config.json';
import { getMdxs } from '@/lib/mdx';

const Page = async () => {
  const posts = await getMdxs();

  const writings = posts.filter((post) => post.frontmatter.category !== 'visualization');
  const visualizations = posts.filter((post) => post.frontmatter.category === 'visualization');

  return (
    <div className="flex flex-col gap-8">
      <h1 className="sr-only">{config.title}</h1>
      <Group title="글" posts={writings} />
      <Group title="시각화" posts={visualizations} />
    </div>
  );
};

export default Page;
