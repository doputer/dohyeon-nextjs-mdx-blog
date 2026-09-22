import { cache } from 'react';

import type { Post } from '@/lib/post/types';
import { byLatest, toEntry } from '@/utils/mdx';

type PostModule = Pick<Post, 'frontmatter' | 'toc'> & { default: Post['MDX'] };
type PostLoader = () => Promise<PostModule>;
type PostModules = Record<string, PostLoader>;

const modules = import.meta.glob('*/index.mdx', {
  base: '../../../contents/post',
}) as PostModules;

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
