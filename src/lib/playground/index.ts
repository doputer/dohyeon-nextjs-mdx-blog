import { cache } from 'react';
import type { ComponentType } from 'react';

import type { Playground } from '@/lib/playground/types';

type PlaygroundModule = Pick<Playground, 'frontmatter'> & { default: Playground['MDX'] };
type PlaygroundLoader = () => Promise<PlaygroundModule>;
type PlaygroundModules = Record<string, PlaygroundLoader>;
type ThumbnailModules = Record<string, { default: ComponentType }>;

const modules = import.meta.glob('*/index.mdx', {
  base: '../../../playground',
}) as PlaygroundModules;
const thumbnailModules = import.meta.glob('*/thumbnail.tsx', {
  base: '../../../playground',
  eager: true,
}) as ThumbnailModules;

const toSlug = (file: string) => file.split('/').at(-2)!;
const toEntry = ([file, load]: [string, PlaygroundLoader]) => [toSlug(file), load] as const;
const toThumbnailEntry = ([file, mod]: [string, { default: ComponentType }]) =>
  [toSlug(file), mod.default] as const;

const toTime = (playground: Playground) => new Date(playground.frontmatter.date).getTime();
const byLatest = (a: Playground, b: Playground) => toTime(b) - toTime(a);

const loaders = new Map(Object.entries(modules).map(toEntry));
const thumbnails = new Map(Object.entries(thumbnailModules).map(toThumbnailEntry));

const getPlayground = cache(async (slug: string) => {
  const load = loaders.get(slug);
  const thumbnail = thumbnails.get(slug);

  if (!load || !thumbnail) throw new Error(`Playground not found: ${slug}`);

  const { frontmatter, default: MDX } = await load();

  return { frontmatter, slug, MDX, thumbnail } satisfies Playground;
});

const getPlaygrounds = cache(async () => {
  const playgrounds = await Promise.all([...loaders.keys()].map(getPlayground));

  return playgrounds.toSorted(byLatest);
});

export { getPlayground, getPlaygrounds };
