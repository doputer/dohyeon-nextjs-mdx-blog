import Group from '@/components/list/group';
import type { Post } from '@/lib/mdx/types';

interface Props {
  posts: Post[];
}

const List = ({ posts }: Props) => {
  const writings = posts.filter((post) => post.frontmatter.category !== 'visualization');
  const visualizations = posts.filter((post) => post.frontmatter.category === 'visualization');

  return (
    <div className="flex flex-col gap-10">
      <Group title="글" posts={writings} />
      <Group title="시각화" posts={visualizations} />
    </div>
  );
};

export default List;
