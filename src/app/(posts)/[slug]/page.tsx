import type { Metadata } from 'next';

import Comment from '@/components/comment';
import Post from '@/components/post';
import Header from '@/components/post/header';
import Progress from '@/components/post/progress';
import Reaction from '@/components/reaction';
import config from '@/configs/config.json';
import { getPost, getPosts } from '@/lib/MDX';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const Page = async (props: PageProps) => {
  const params = await props.params;

  const { frontmatter, toc, MDX } = await getPost(params.slug);
  const { title, date } = frontmatter;

  return (
    <>
      <Progress />
      <Header title={title} date={date} />
      <Post toc={toc} MDX={MDX} />
      <Reaction slug={params.slug} />
      <Comment />
    </>
  );
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getPosts();

  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;

  const { frontmatter } = await getPost(params.slug);
  const { emoji, title, description } = frontmatter;

  return {
    title,
    description,
    openGraph: {
      images: `/api/og?emoji=${emoji}`,
      title,
      url: [config.siteUrl, params.slug].join('/'),
    },
  };
}

export default Page;
