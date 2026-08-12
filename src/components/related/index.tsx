import Link from 'next/link';

import { getPosts } from '@/lib/MDX';
import type { Frontmatter } from '@/lib/MDX/types';
import { toYearMonth } from '@/utils/date';

interface RelatedProps {
  slug: string;
  tags: Frontmatter['tags'];
}

const MAX = 3;

const Related = async ({ slug, tags }: RelatedProps) => {
  const posts = await getPosts();
  const tagSet = new Set(tags);

  const related = posts
    .filter((post) => post.slug !== slug)
    .map((post) => ({ post, shared: post.frontmatter.tags.filter((tag) => tagSet.has(tag)) }))
    .filter(({ shared }) => shared.length > 0)
    .toSorted(
      (a, b) =>
        b.shared.length - a.shared.length ||
        new Date(b.post.frontmatter.date).getTime() - new Date(a.post.frontmatter.date).getTime()
    )
    .slice(0, MAX);

  if (related.length === 0) return null;

  return (
    <section className="space-y-5">
      <h2 className="text-sm font-medium tracking-wide text-muted uppercase select-none">
        관련 글
      </h2>
      <ul className="divide-y divide-line">
        {related.map(({ post }) => (
          <li key={post.slug} className="group/li">
            <Link href={`/${post.slug}`} className="flex items-baseline justify-between gap-4 py-3">
              <h3 className="break-keep text-muted transition-colors duration-200 ease-out group-hover/li:text-main">
                {post.frontmatter.title}
              </h3>
              <time
                dateTime={post.frontmatter.date}
                className="shrink-0 text-sm/6 text-muted tabular-nums"
              >
                {toYearMonth(post.frontmatter.date)}
              </time>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Related;
