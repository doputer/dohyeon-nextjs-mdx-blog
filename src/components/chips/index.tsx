import Link from 'next/link';

import type { Mdx } from '@/lib/mdx/types';

interface Props {
  posts: Mdx[];
}

const Chips = ({ posts }: Props) => {
  if (posts.length === 0) return null;

  return (
    <ul aria-label="시각화" className="flex flex-wrap gap-2">
      {posts.map(({ frontmatter, slug }) => (
        <li key={slug}>
          <Link
            href={`/${slug}`}
            title={frontmatter.description}
            className="group/chip flex items-center gap-2 rounded border border-line py-2 pr-4 pl-3 hover:border-soft"
          >
            <span
              aria-hidden
              className="text-sm transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] will-change-transform group-hover/chip:scale-125"
            >
              {frontmatter.emoji}
            </span>
            <span className="text-sm break-keep text-muted transition-colors duration-200 ease-out group-hover/chip:text-main sm:text-base">
              {frontmatter.title}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Chips;
