import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Comment from '@/components/comment';
import Post from '@/components/post';
import Header from '@/components/post/header';
import Reaction from '@/components/reaction';
import config from '@/configs/config.json';
import { accessPost, getPost, getPosts } from '@/lib/MDX';
import { getReactionBySlug } from '@/lib/supabase/server/reaction';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const Page = async (props: PageProps) => {
  const params = await props.params;
  if (!(await accessPost(params.slug))) notFound();

  const { frontmatter, toc, MDX } = await getPost(params.slug);
  const { title, date } = frontmatter;

  const reactionPromise = getReactionBySlug(params.slug);

  return (
    <>
      <Header title={title} date={date} />
      <Post toc={toc} MDX={MDX} />
      <Reaction initial={reactionPromise} slug={params.slug} />
      <Comment />
    </>
  );
};

export async function generateStaticParams() {
  const posts = await getPosts();

  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  if (!(await accessPost(params.slug))) notFound();

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
