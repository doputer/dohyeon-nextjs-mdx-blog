import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Comment from '@/components/comment';
import Post from '@/components/post';
import Actions from '@/components/post/actions';
import Header from '@/components/post/header';
import Reaction from '@/components/reaction';
import config from '@/configs/config.json';
import { accessPost, getPost, getPosts } from '@/lib/MDX';
import { getCommentBySlug } from '@/lib/supabase/comment.server';
import { getReactionBySlug } from '@/lib/supabase/reaction.server';

interface PageProps {
  params: { slug: string };
}

const Page = async ({ params }: PageProps) => {
  if (!(await accessPost(params.slug))) notFound();

  const { frontmatter, toc, MDX } = await getPost(params.slug);
  const { title, date, tags } = frontmatter;

  const reactions = await getReactionBySlug(params.slug);
  const comments = await getCommentBySlug(params.slug);

  return (
    <Actions>
      <Header title={title} date={date} tags={tags} />
      <Post toc={toc} MDX={MDX} />
      <Reaction data={reactions} slug={params.slug} />
      <Comment data={comments} slug={params.slug} />
    </Actions>
  );
};

export async function generateStaticParams() {
  const posts = await getPosts();

  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
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
