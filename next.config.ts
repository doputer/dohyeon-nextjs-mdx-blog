import createMDX from '@next/mdx';
import type { NextConfig } from 'next';

import type { CodeHikeConfig } from 'codehike/mdx';

import path from 'node:path';

import { redirects } from './scripts/redirects.mjs';

const local = (script: string) => path.join(__dirname, 'scripts', script);

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/giscus/:path*.css',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://giscus.app' },
          { key: 'Cache-Control', value: 'public, max-age=86400, s-maxage=86400' },
        ],
      },
    ];
  },
  redirects,
  pageExtensions: ['ts', 'tsx', 'mdx'],
};

const codehikeConfig: CodeHikeConfig = {
  components: { code: 'Code' },
  syntaxHighlighting: { theme: 'github-from-css' },
};

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
    rehypePlugins: ['rehype-slug', local('rehype-toc.mjs')],
  },
});

export default withMDX(nextConfig);
