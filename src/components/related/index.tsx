import Link from 'next/link';

import type { Frontmatter } from '@/lib/MDX/types';

import { getPosts } from '@/lib/MDX';
import { cn } from '@/utils/cn';
import { format } from 'date-fns';

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
    <section className="space-y-4">
      <h2 className="text-sm font-medium tracking-wide text-soft uppercase select-none">관련 글</h2>
      <ul>
        {related.map(({ post, shared }) => (
          <li key={post.slug} className="group/li border-t border-line/60 first:border-t-0">
            <Link href={`/${post.slug}`} className="flex items-baseline justify-between gap-4 py-3">
              <div className="space-y-1">
                <h3
                  className={cn(
                    'font-medium break-keep transition-colors duration-300 ease-out',
                    'group-hover/li:text-accent'
                  )}
                >
                  {post.frontmatter.title}
                </h3>
                <p className="space-x-2 text-xs text-soft">
                  {shared.map((tag) => (
                    <span key={tag}>
                      <span className="text-[0.85em] text-accent/50 select-none" aria-hidden>
                        #
                      </span>
                      {tag}
                    </span>
                  ))}
                </p>
              </div>
              <time
                dateTime={post.frontmatter.date}
                className="shrink-0 text-sm text-soft tabular-nums"
              >
                {format(post.frontmatter.date, 'yyyy.MM')}
              </time>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Related;
