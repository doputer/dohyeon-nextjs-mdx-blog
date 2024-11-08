import type { MetadataRoute } from 'next';

import meta from '@/configs/metadata.json';
import { getPosts } from '@/lib/mdx';

const generatePostSitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const { siteUrl } = meta;
  const posts = await getPosts();
  const sitemap = posts.map((post) => ({
    url: siteUrl + '/' + encodeURI(post.frontmatter.title),
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  })) satisfies MetadataRoute.Sitemap;

  return sitemap;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { siteUrl } = meta;
  const postSitemap = await generatePostSitemap();

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: siteUrl + '/about',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
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
