import type { MDXComponents } from 'mdx/types';

import typography from '@/components/typography';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return Object.assign({}, components, typography);
}
