import type { Metadata } from 'next';

import Counter from '@/components/counter';
import List from '@/components/list';
import config from '@/configs/config.json';
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

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const { tag } = params;
  const decodedTag = decode(tag);
  const capitalizedTag = decodedTag.charAt(0).toUpperCase() + decodedTag.slice(1);

  return {
    title: [config.title, capitalizedTag].join(' | '),
    openGraph: {
      title: [config.title, capitalizedTag].join(' | '),
    },
  };
}

export default Page;
