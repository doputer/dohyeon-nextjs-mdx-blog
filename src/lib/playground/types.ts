import type { ComponentType } from 'react';

import type { run } from '@mdx-js/mdx';

type MDXModule = Awaited<ReturnType<typeof run>>;
type MDXContent = MDXModule['default'];

export interface PlaygroundFrontmatter {
  title: string;
  description: string;
  date: string;
}

export interface Playground {
  frontmatter: PlaygroundFrontmatter;
  slug: string;
  MDX: MDXContent;
  thumbnail: ComponentType;
}
