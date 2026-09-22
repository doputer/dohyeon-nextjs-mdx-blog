import type { MDXComponents } from 'mdx/types';

import typography from '@/components/typography';

export const useMDXComponents = (components: MDXComponents): MDXComponents => {
  return Object.assign({}, components, typography);
};
