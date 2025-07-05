import typography from '@/components/typography';

import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return Object.assign({}, components, typography);
}
