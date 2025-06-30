import createMDX from '@next/mdx';

import { remarkCodeHike } from 'codehike/mdx';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeUnwrapImages from 'rehype-unwrap-images';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';

import { redirects } from './scripts/redirects.mjs';
import remarkPublicImage from './scripts/remark-public-image.mjs';
import remarkToc from './scripts/remark-toc.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/lotties/:path*.json',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, s-maxage=86400' }],
      },
    ];
  },
  redirects,
  pageExtensions: ['ts', 'tsx', 'mdx'],
};

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
      remarkMath,
      remarkToc,
      remarkPublicImage,
      [remarkCodeHike, codehikeConfig],
    ],
    rehypePlugins: [rehypeSlug, rehypeKatex, rehypeUnwrapImages],
  },
});

export default withMDX(nextConfig);
