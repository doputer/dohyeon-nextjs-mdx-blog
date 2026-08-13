import type { NextConfig } from 'next';

import path from 'node:path';

import type { Options as MDXOptions } from '@mdx-js/loader';
import createMDX from '@next/mdx';
import type { CodeHikeConfig } from 'codehike/mdx';

import { redirects } from './scripts/redirects.mjs';

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  redirects,
  headers: async () => [
    {
      source: '/giscus/:path*.css',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: 'https://giscus.app' },
        { key: 'Cache-Control', value: 'public, max-age=86400, s-maxage=86400' },
      ],
    },
  ],
};

const codehikeConfig: CodeHikeConfig = {
  components: { code: 'Code' },
  syntaxHighlighting: { theme: 'github-from-css' },
};

const remarkRehypeOptions: MDXOptions['remarkRehypeOptions'] = {
  footnoteLabel: '각주',
  footnoteBackLabel: '본문으로 돌아가기',
};

const local = (script: string) => path.join(__dirname, 'scripts', script);

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      'remark-frontmatter',
      'remark-mdx-frontmatter',
      'remark-gfm',
      local('remark-image-import.mjs'),
      'remark-directive',
      local('remark-typography.mjs'),
      [local('remark-codehike.mjs'), codehikeConfig],
    ],
    remarkRehypeOptions,
    rehypePlugins: ['rehype-slug', local('rehype-toc.mjs')],
  },
});

export default withMDX(nextConfig);
