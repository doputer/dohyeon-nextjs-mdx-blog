import type { Metadata } from 'next';

import Playground from '@/components/playground';
import Header from '@/components/playground/header';
import { getPlayground, getPlaygrounds } from '@/lib/playground';

const Page = async (props: PageProps<'/playground/[slug]'>) => {
  const params = await props.params;

  const { frontmatter, MDX } = await getPlayground(params.slug);

  return (
    <article className="flex flex-col gap-6">
      <Header title={frontmatter.title} description={frontmatter.description} />
      <Playground MDX={MDX} />
    </article>
  );
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const playgrounds = await getPlaygrounds();

  return playgrounds.map((playground) => ({ slug: playground.slug }));
}

export async function generateMetadata(props: PageProps<'/playground/[slug]'>): Promise<Metadata> {
  const params = await props.params;

  const { frontmatter } = await getPlayground(params.slug);

  return {
    title: { absolute: frontmatter.title },
    description: frontmatter.description,
    alternates: { canonical: `/playground/${params.slug}` },
  };
}

export default Page;
