import type { MetadataRoute } from 'next';

import config from '@/configs/config.json';
import { getPosts } from '@/lib/MDX';
import { getPlaygrounds } from '@/lib/playground';

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

const generatePlaygroundSitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const { siteUrl } = config;
  const playgrounds = await getPlaygrounds();
  const sitemap = playgrounds.map((playground) => ({
    url: siteUrl + '/playground/' + playground.slug,
    lastModified: new Date(playground.frontmatter.date),
    changeFrequency: 'monthly',
    priority: 0.5,
  })) satisfies MetadataRoute.Sitemap;

  return sitemap;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { siteUrl } = config;
  const [postSitemap, playgroundSitemap] = await Promise.all([
    generatePostSitemap(),
    generatePlaygroundSitemap(),
  ]);

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: siteUrl + '/playground',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    ...postSitemap,
    ...playgroundSitemap,
  ];
}
