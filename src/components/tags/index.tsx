import Link from 'next/link';

import type { Frontmatter } from '@/lib/MDX/types';

import { cn } from '@/utils/cn';
import { encode } from '@/utils/uri';

interface TagsProps {
  tags: Frontmatter['tags'];
  className?: string;
}

const Tags = ({ tags, className }: TagsProps) => {
  if (tags.length === 0) return null;

  return (
    <ul className={cn('flex flex-wrap gap-x-2', className)}>
      {tags.map((tag) => (
        <li key={tag}>
          <Link
            href={`/tags/${encode(tag)}`}
            className="text-base text-muted transition-colors duration-200 ease-out hover:text-accent"
          >
            <span className="text-[0.85em] text-accent/50 select-none" aria-hidden>
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
