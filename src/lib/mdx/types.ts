import type { MDXContent } from 'mdx/types';

export interface Frontmatter {
  emoji: string;
  title: string;
  description: string;
  tags: string[];
  date: string;
  category?: 'visualization';
}

interface TOC {
  id: string;
  text: string;
  depth: number;
}

export interface Mdx {
  frontmatter: Frontmatter;
  toc: TOC[];
  slug: string;
  Content: MDXContent;
}
