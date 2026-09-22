import type { Metadata } from 'next';

import Comment from '@/components/comment';
import Header from '@/components/content-header';
import Divider from '@/components/divider';
import ErrorBoundary from '@/components/error-boundary';
import Prose from '@/components/prose';
import Reaction from '@/components/reaction';
import Related from '@/components/related';
import TOC from '@/components/toc';
import config from '@/configs/config.json';
import { getPost, getPosts } from '@/lib/post';

const Page = async (props: PageProps<'/[slug]'>) => {
  const params = await props.params;

  const { frontmatter, toc, MDX } = await getPost(params.slug);
  const { title, description, date, tags } = frontmatter;

  return (
    <>
      <article className="flex flex-col gap-12">
        <Header title={title} description={description} date={date} />
        <TOC toc={toc} />
        <Prose MDX={MDX} />
      </article>
      <Divider />
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

export async function generateMetadata(props: PageProps<'/[slug]'>): Promise<Metadata> {
  const params = await props.params;

  const { frontmatter } = await getPost(params.slug);
  const { emoji, title, description, date, tags } = frontmatter;

  return {
    title: { absolute: title },
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
