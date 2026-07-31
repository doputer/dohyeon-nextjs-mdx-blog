import Link from 'next/link';

import type { Frontmatter } from '@/lib/MDX/types';

import { encode } from '@/utils/uri';

interface TagsProps {
  tags: Frontmatter['tags'];
}

const Tags = ({ tags }: TagsProps) => {
  if (tags.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-x-2">
      {tags.map((tag) => (
        <li key={tag}>
          <Link
            href={`/tags/${encode(tag)}`}
            className="text-base text-muted transition-colors duration-200 ease-out hover:text-accent"
          >
            <span className="text-[0.85em] text-soft select-none" aria-hidden>
              #
            </span>
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Tags;
