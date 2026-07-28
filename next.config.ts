import path from 'node:path';

import createMDX from '@next/mdx';
import type { NextConfig } from 'next';

import { redirects } from './scripts/redirects.mjs';

import type { CodeHikeConfig } from 'codehike/mdx';

const local = (script: string) => path.join(__dirname, 'scripts', script);

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/lotties/:path*.svg',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, s-maxage=86400' }],
      },
      {
        source: '/lotties/:path*.json',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, s-maxage=86400' }],
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
      local('remark-toc.mjs'),
      local('remark-public-image.mjs'),
      'remark-directive',
      local('remark-typography.mjs'),
      [local('remark-codehike.mjs'), codehikeConfig],
    ],
    rehypePlugins: ['rehype-slug', local('rehype-image-size.mjs'), 'rehype-unwrap-images'],
  },
});

export default withMDX(nextConfig);
