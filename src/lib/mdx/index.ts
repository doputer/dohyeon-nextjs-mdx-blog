import { cache } from 'react';

import type { Mdx } from '@/lib/mdx/types';

type MdxExports = Pick<Mdx, 'frontmatter' | 'toc'> & { default: Mdx['Content'] };
type MdxLoader = () => Promise<MdxExports>;
type MdxLoaders = Record<string, MdxLoader>;

const glob = import.meta.glob('*/index.mdx', { base: '../../../contents' }) as MdxLoaders;

const toSlug = (file: string) => file.split('/').at(-2)!;
const toEntry = ([file, load]: [string, MdxLoader]) => [toSlug(file), load] as const;

const toTime = (mdx: Mdx) => new Date(mdx.frontmatter.date).getTime();
const byLatest = (a: Mdx, b: Mdx) => toTime(b) - toTime(a);

const loaders = new Map(Object.entries(glob).map(toEntry));

const getMdx = cache(async (slug: string) => {
  const load = loaders.get(slug);

  if (!load) throw new Error(`Mdx not found: ${slug}`);

  const { frontmatter, toc, default: Content } = await load();

  return { frontmatter, toc, slug, Content } satisfies Mdx;
});

const getMdxs = cache(async () => {
  const items = await Promise.all([...loaders.keys()].map(getMdx));

  return items.toSorted(byLatest);
});

export { getMdx, getMdxs };
