'use client';

import { Children, useState } from 'react';

import type { AnnotationHandler } from 'codehike/code';

import { cn } from '@/utils/cn';

const Collapse: AnnotationHandler['Block'] = ({ annotation, children }) => {
  const [expanded, setExpanded] = useState(annotation.query !== 'collapsed');
  const firstLine = Children.toArray(children)[0];

  return (
    <div className="relative">
      <button
        type="button"
        className="absolute left-0.5 h-6 w-4"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
        aria-label={expanded ? '코드 블록 접기' : '코드 블록 펼치기'}
      >
        <span
          className={cn(
            'list-item list-inside text-xs',
            expanded ? 'list-[disclosure-open]' : 'list-[disclosure-closed]'
          )}
        />
      </button>
      {expanded ? children : <div>{firstLine}</div>}
    </div>
  );
};

export default Collapse;
