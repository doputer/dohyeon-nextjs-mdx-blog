import { cache } from 'react';
import type { ComponentType } from 'react';

import type { Lab } from '@/lib/lab/types';

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

const toSlug = (file: string) => file.split('/').at(-2)!;
const toEntry = ([file, load]: [string, LabLoader]) => [toSlug(file), load] as const;
const toThumbnailEntry = ([file, mod]: [string, { default: ComponentType }]) =>
  [toSlug(file), mod.default] as const;

const toTime = (lab: Lab) => new Date(lab.frontmatter.date).getTime();
const byLatest = (a: Lab, b: Lab) => toTime(b) - toTime(a);

const loaders = new Map(Object.entries(modules).map(toEntry));
const thumbnails = new Map(Object.entries(thumbnailModules).map(toThumbnailEntry));

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
