import type { ComponentType } from 'react';

import type { run } from '@mdx-js/mdx';

type MDXModule = Awaited<ReturnType<typeof run>>;
type MDXContent = MDXModule['default'];

export interface LabFrontmatter {
  title: string;
  description: string;
  date: string;
}

export interface Lab {
  frontmatter: LabFrontmatter;
  slug: string;
  MDX: MDXContent;
  thumbnail: ComponentType;
}
