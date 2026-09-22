import type { Metadata } from 'next';

import Header from '@/components/content-header';
import Prose from '@/components/prose';
import { getLab, getLabs } from '@/lib/lab';

const Page = async (props: PageProps<'/lab/[slug]'>) => {
  const params = await props.params;

  const { frontmatter, MDX } = await getLab(params.slug);
  const { title, description, date } = frontmatter;

  return (
    <article className="flex flex-col gap-12">
      <Header title={title} description={description} date={date} />
      <Prose MDX={MDX} />
    </article>
  );
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const labs = await getLabs();

  return labs.map((lab) => ({ slug: lab.slug }));
}

export async function generateMetadata(props: PageProps<'/lab/[slug]'>): Promise<Metadata> {
  const params = await props.params;

  const { frontmatter } = await getLab(params.slug);
  const { title, description } = frontmatter;

  return {
    title: { absolute: title },
    description: description,
    alternates: { canonical: `/lab/${params.slug}` },
  };
}

export default Page;
