import { NextResponse } from 'next/server';

import config from '@/configs/config.json';
import { getMdxs } from '@/lib/mdx';

export const dynamic = 'force-static';

const escapeXml = (value: string) => {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
};

export async function GET() {
  const posts = await getMdxs();

  const items = posts
    .map(
      ({ frontmatter, slug }) => `
  <item>
    <title>${escapeXml(frontmatter.title)}</title>
    <link>${config.siteUrl}/${slug}</link>
    <guid>${config.siteUrl}/${slug}</guid>
    <pubDate>${new Date(frontmatter.date).toUTCString()}</pubDate>
    <description>${escapeXml(frontmatter.description)}</description>
  </item>`
    )
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(config.name)}</title>
    <link>${config.siteUrl}</link>
    <atom:link href="${config.siteUrl}/api/rss" rel="self" type="application/rss+xml" />
    <description>${escapeXml(config.description)}</description>
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
