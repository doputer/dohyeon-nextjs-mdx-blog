import type { run } from '@mdx-js/mdx';

type AwaitType<T> = T extends Promise<infer U> ? U : T;
type MDXModule = AwaitType<ReturnType<typeof run>>;
type MDXContent = MDXModule['default'];

export interface Frontmatter {
  emoji: string;
  title: string;
  description: string;
  tags: string[];
  date: string;
}

export interface TOC {
  id: string;
  text: string;
  depth: number;
}

export interface Post {
  frontmatter: Frontmatter;
  toc: TOC[];
  slug: string;
  MDX: MDXContent;
}
