import createMDX from '@next/mdx';

import { remarkCodeHike } from 'codehike/mdx';
import rehypeSlug from 'rehype-slug';
import rehypeUnwrapImages from 'rehype-unwrap-images';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';

import { redirects } from './scripts/redirects.mjs';
import remarkPublicImage from './scripts/remark-public-image.mjs';
import remarkToc from './scripts/remark-toc.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
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

/** @type {import('codehike/mdx').CodeHikeConfig} */
const codehikeConfig = {
  components: { code: 'Code' },
  syntaxHighlighting: { theme: 'github-from-css' },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      remarkFrontmatter,
      remarkMdxFrontmatter,
      remarkGfm,
      remarkToc,
      remarkPublicImage,
      [remarkCodeHike, codehikeConfig],
    ],
    rehypePlugins: [rehypeSlug, rehypeUnwrapImages],
  },
});

export default withMDX(nextConfig);
