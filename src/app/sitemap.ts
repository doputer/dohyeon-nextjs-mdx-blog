import type { MetadataRoute } from 'next';

import config from '@/configs/config.json';
import { getPosts } from '@/lib/MDX';

const generatePostSitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const { siteUrl } = config;
  const posts = await getPosts();
  const sitemap = posts.map((post) => ({
    url: siteUrl + '/' + post.slug,
    lastModified: new Date(post.frontmatter.date),
    changeFrequency: 'weekly',
    priority: 0.7,
  })) satisfies MetadataRoute.Sitemap;

  return sitemap;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { siteUrl } = config;
  const postSitemap = await generatePostSitemap();

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: siteUrl + '/tags',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    ...postSitemap,
  ];
}
