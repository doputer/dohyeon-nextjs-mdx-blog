import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Counter from '@/components/counter';
import List from '@/components/list';
import config from '@/configs/config.json';
import { getPosts } from '@/lib/MDX';
import { encode } from '@/utils/uri';

interface PageProps {
  params: Promise<{ tag: string }>;
}

const findTag = async (param: string) => {
  const posts = await getPosts();
  const tags = new Set(posts.flatMap((post) => post.frontmatter.tags));

  return [...tags].find((tag) => encode(tag) === param);
};

const Page = async (props: PageProps) => {
  const params = await props.params;

  const tag = await findTag(params.tag);
  if (!tag) notFound();

  const posts = await getPosts();
  const filteredPosts = posts.filter((post) => post.frontmatter.tags.includes(tag));

  return (
    <>
      <Counter label={tag} count={filteredPosts.length} />
      <List posts={filteredPosts} />
    </>
  );
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getPosts();
  const tags = new Set(posts.flatMap((post) => post.frontmatter.tags));

  return [...tags].map((tag) => ({ tag: encode(tag) }));
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;

  const tag = await findTag(params.tag);
  if (!tag) notFound();

  const capitalizedTag = tag.charAt(0).toUpperCase() + tag.slice(1);
  const url = `${config.siteUrl}/tags/${encode(tag)}`;

  return {
    title: capitalizedTag,
    description: `${capitalizedTag} 태그가 달린 글 목록`,
    alternates: { canonical: `/tags/${encode(tag)}` },
    openGraph: {
      type: 'website',
      locale: 'ko_KR',
      siteName: config.title,
      images: '/api/og',
      title: capitalizedTag,
      url,
    },
  };
}

export default Page;
