import type { MetadataRoute } from 'next';

import config from '@/configs/config.json';

const robots = (): MetadataRoute.Robots => {
  const { siteUrl } = config;

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    host: siteUrl,
    sitemap: siteUrl + '/sitemap.xml',
  };
};

export default robots;
