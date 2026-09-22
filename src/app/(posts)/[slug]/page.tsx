import type { Metadata } from 'next';

import Comment from '@/components/comment';
import Header from '@/components/content-header';
import Prose from '@/components/prose';
import Reaction from '@/components/reaction';
import Related from '@/components/related';
import TOC from '@/components/toc';
import config from '@/configs/config.json';
import { getMdx, getMdxs } from '@/lib/mdx';

const Page = async (props: PageProps<'/[slug]'>) => {
  const params = await props.params;

  const { frontmatter, toc, Content } = await getMdx(params.slug);
  const { title, description, date, tags } = frontmatter;

  return (
    <>
      <article className="flex flex-col gap-12">
        <Header title={title} description={description} date={date} />
        <TOC toc={toc} />
        <Prose Content={Content} />
      </article>
      <Reaction slug={params.slug} />
      <Related slug={params.slug} tags={tags} />
      <Comment />
    </>
  );
};

export const dynamicParams = false;

export const generateStaticParams = async () => {
  const posts = await getMdxs();

  return posts.map((post) => ({ slug: post.slug }));
};

export const generateMetadata = async (props: PageProps<'/[slug]'>): Promise<Metadata> => {
  const params = await props.params;

  const { frontmatter } = await getMdx(params.slug);
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
};

export default Page;
