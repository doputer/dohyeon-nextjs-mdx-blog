import type { MetadataRoute } from 'next';

import config from '@/configs/config.json';
import { getLabs } from '@/lib/lab';
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

const generateLabSitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const { siteUrl } = config;
  const labs = await getLabs();
  const sitemap = labs.map((lab) => ({
    url: siteUrl + '/lab/' + lab.slug,
    lastModified: new Date(lab.frontmatter.date),
    changeFrequency: 'monthly',
    priority: 0.5,
  })) satisfies MetadataRoute.Sitemap;

  return sitemap;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { siteUrl } = config;
  const [postSitemap, labSitemap] = await Promise.all([
    generatePostSitemap(),
    generateLabSitemap(),
  ]);

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: siteUrl + '/lab',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    ...postSitemap,
    ...labSitemap,
  ];
}
