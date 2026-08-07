import type { Metadata } from 'next';

import Comment from '@/components/comment';
import ErrorBoundary from '@/components/error-boundary';
import Post from '@/components/post';
import Header from '@/components/post/header';
import Progress from '@/components/post/progress';
import Reaction from '@/components/reaction';
import Related from '@/components/related';
import config from '@/configs/config.json';
import { getPost, getPosts } from '@/lib/MDX';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const Page = async (props: PageProps) => {
  const params = await props.params;

  const { frontmatter, toc, MDX } = await getPost(params.slug);
  const { title, date, tags } = frontmatter;

  return (
    <>
      <Progress />
      <article className="flex flex-col gap-12">
        <Header title={title} date={date} tags={tags} />
        <Post toc={toc} MDX={MDX} />
      </article>
      <ErrorBoundary message="좋아요를 불러오지 못했습니다.">
        <Reaction slug={params.slug} />
      </ErrorBoundary>
      <Related slug={params.slug} tags={tags} />
      <ErrorBoundary message="댓글을 불러오지 못했습니다.">
        <Comment />
      </ErrorBoundary>
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
  const { emoji, title, description, date, tags } = frontmatter;

  return {
    title,
    description,
    alternates: { canonical: `/${params.slug}` },
    openGraph: {
      type: 'article',
      locale: 'ko_KR',
      siteName: config.title,
      publishedTime: new Date(date).toISOString(),
      tags,
      images: `/api/og?emoji=${encodeURIComponent(emoji)}`,
      title,
      description,
      url: [config.siteUrl, params.slug].join('/'),
    },
  };
}

export default Page;
