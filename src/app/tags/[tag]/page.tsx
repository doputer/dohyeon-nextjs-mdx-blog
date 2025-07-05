import Counter from '@/components/counter';
import List from '@/components/list';
import { getPosts } from '@/lib/MDX';
import { decode } from '@/utils/uri';

interface PageProps {
  params: Promise<{ tag: string }>;
}

const Page = async (props: PageProps) => {
  const params = await props.params;

  const { tag } = params;

  const posts = await getPosts();
  const filteredPosts = posts.filter((post) => post.frontmatter.tags.includes(decode(tag)));

  return (
    <>
      <Counter label={decode(tag)} count={filteredPosts.length} />
      <List posts={filteredPosts} />
    </>
  );
};

export default Page;
