import type { MetadataRoute } from 'next';

import config from '@/configs/config.json';
import { getMdxs } from '@/lib/mdx';

const { siteUrl } = config;

const generatePostSitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const posts = await getMdxs();

  return posts.map((post) => ({
    url: siteUrl + '/' + post.slug,
    lastModified: new Date(post.frontmatter.date),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));
};

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const postSitemap = await generatePostSitemap();

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...postSitemap,
  ];
};

export default sitemap;
