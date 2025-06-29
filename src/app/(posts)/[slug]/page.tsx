import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

import Comment from '@/components/comment';
import Post from '@/components/post';
import Header from '@/components/post/header';
import { Skeleton } from '@/components/reaction';
import config from '@/configs/config.json';
import { accessPost, getPost, getPosts } from '@/lib/MDX';

const Reaction = dynamic(() => import('@/components/reaction'), {
  ssr: false,
  loading: () => <Skeleton />,
});

interface PageProps {
  params: { slug: string };
}

const Page = async ({ params }: PageProps) => {
  if (!(await accessPost(params.slug))) notFound();

  const { frontmatter, toc, MDX } = await getPost(params.slug);
  const { title, date, tags } = frontmatter;

  return (
    <>
      <Header title={title} date={date} tags={tags} />
      <Post toc={toc} MDX={MDX} />
      <Reaction slug={params.slug} />
      <Comment />
    </>
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
