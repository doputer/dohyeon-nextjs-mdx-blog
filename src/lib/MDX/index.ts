import { cache } from 'react';

import type { Post } from '@/lib/MDX/types';

type PostModule = Pick<Post, 'frontmatter' | 'toc'> & { default: Post['MDX'] };
type PostLoader = () => Promise<PostModule>;
type PostModules = Record<string, PostLoader>;

const modules = import.meta.glob('*/index.mdx', { base: '../../../contents' }) as PostModules;

const toSlug = (file: string) => file.split('/').at(-2)!;
const toEntry = ([file, load]: [string, PostLoader]) => [toSlug(file), load] as const;

const toTime = (post: Post) => new Date(post.frontmatter.date).getTime();
const byLatest = (a: Post, b: Post) => toTime(b) - toTime(a);

const loaders = new Map(Object.entries(modules).map(toEntry));

const getPost = cache(async (slug: string) => {
  const load = loaders.get(slug);

  if (!load) throw new Error(`Post not found: ${slug}`);

  const { frontmatter, toc, default: MDX } = await load();

  return { frontmatter, toc, slug, MDX } satisfies Post;
});

const getPosts = cache(async () => {
  const posts = await Promise.all([...loaders.keys()].map(getPost));

  return posts.toSorted(byLatest);
});

export { getPost, getPosts };
