import { NextResponse } from 'next/server';

import config from '@/configs/config.json';
import { getPosts } from '@/lib/MDX';

export const dynamic = 'force-dynamic';

export async function GET() {
  const posts = await getPosts();

  const items = posts
    .map(
      ({ frontmatter, slug }) => `
  <item>
    <title>${frontmatter.title}</title>
    <link>${config.siteUrl}/${slug}</link>
    <guid>${config.siteUrl}/${slug}</guid>
    <pubDate>${new Date(frontmatter.date).toUTCString()}</pubDate>
    <description><![CDATA[${frontmatter.description}]]></description>
  </item>`
    )
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${config.name}</title>
    <link>${config.siteUrl}</link>
    <description>${config.description}</description>
    <language>ko-kr</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    status: 200,
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
