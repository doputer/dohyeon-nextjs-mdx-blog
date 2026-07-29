import { cache } from 'react';

import type { Post } from '@/lib/MDX/types';

import { readdir } from 'fs/promises';
import path from 'path';

const DIR = path.join(process.cwd(), 'contents');

const getPost = cache(async (slug: string) => {
  const MDXModule = await import(`../../../contents/${slug}/index.mdx`);
  const { frontmatter, toc, default: MDX } = MDXModule;

  return { frontmatter, toc, slug, MDX } as Post;
});

const getPosts = cache(async () => {
  const entries = await readdir(DIR, { withFileTypes: true });
  const dirs = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);

  const posts = await Promise.all(dirs.map(getPost));
  const sortedPosts = posts.toSorted(
    (a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
  );

  return sortedPosts;
});

export { getPost, getPosts };
