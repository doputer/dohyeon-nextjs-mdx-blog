import Link from 'next/link';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

import { cn } from '@/utils/cn';

interface PaginationProps {
  totalCount: number;
  currentPage?: number;
}

const Pagination = ({ totalCount, currentPage = 1 }: PaginationProps) => {
  const itemPerPage = 10;
  const numPages = Math.ceil(totalCount / itemPerPage);
  const startPage = (Math.ceil(currentPage / itemPerPage) - 1) * itemPerPage;
  const endPage = Math.min(startPage + itemPerPage, numPages);

  return (
    <div className="flex items-center justify-center gap-1">
      <Link
        href={`/pages/${startPage}`}
        className={cn(startPage === 0 && 'invisible')}
        aria-label="Prev Page Link"
      >
        <ChevronLeftIcon className="size-5" />
      </Link>
      <div className="space-x-1">
        {Array.from({ length: endPage - startPage }).map((_, i) => (
          <Link
            key={i}
            href={`/pages/${i + 1 + startPage}`}
            className={cn('px-2 text-lg', currentPage === i + 1 + startPage && 'text-link')}
          >
            {i + 1 + startPage}
          </Link>
        ))}
      </div>
      <Link
        href={`/pages/${endPage + 1}`}
        className={cn(endPage === numPages && 'invisible')}
        aria-label="Next Page Link"
      >
        <ChevronRightIcon className="size-5" />
      </Link>
    </div>
  );
};

export default Pagination;
