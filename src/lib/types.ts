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

export interface Post {
  frontmatter: Frontmatter;
  MDX: MDXContent;
}
