import type { MetadataRoute } from 'next';

import config from '@/configs/config.json';

export default function robots(): MetadataRoute.Robots {
  const { siteUrl } = config;

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/api/og/*'],
    },
    host: siteUrl,
    sitemap: siteUrl + '/sitemap.xml',
  };
}
