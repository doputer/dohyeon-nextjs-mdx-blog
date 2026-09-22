import { cache, type ComponentType } from 'react';

import type { Lab } from '@/lib/lab/types';
import { byLatest, toEntry } from '@/utils/mdx';

type LabModule = Pick<Lab, 'frontmatter'> & { default: Lab['MDX'] };
type LabLoader = () => Promise<LabModule>;
type LabModules = Record<string, LabLoader>;
type ThumbnailModules = Record<string, { default: ComponentType }>;

const modules = import.meta.glob('*/index.mdx', {
  base: '../../../contents/lab',
}) as LabModules;
const thumbnailModules = import.meta.glob('*/thumbnail.tsx', {
  base: '../../../contents/lab',
  eager: true,
}) as ThumbnailModules;

const loaders = new Map(Object.entries(modules).map(toEntry));
const thumbnails = new Map(
  Object.entries(thumbnailModules).map(([file, mod]) => toEntry([file, mod.default]))
);

const getLab = cache(async (slug: string) => {
  const load = loaders.get(slug);
  const thumbnail = thumbnails.get(slug);

  if (!load || !thumbnail) throw new Error(`Lab not found: ${slug}`);

  const { frontmatter, default: MDX } = await load();

  return { frontmatter, slug, MDX, thumbnail } satisfies Lab;
});

const getLabs = cache(async () => {
  const labs = await Promise.all([...loaders.keys()].map(getLab));

  return labs.toSorted(byLatest);
});

export { getLab, getLabs };
