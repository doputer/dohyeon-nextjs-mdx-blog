'use client';

import { Children, useState } from 'react';

import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/16/solid';
import { AnnotationHandler } from 'codehike/code';

const Collapse: AnnotationHandler['Block'] = ({ annotation, children }) => {
  const [isCollapsed, setCollapsed] = useState(annotation.query !== 'collapsed');
  const firstLine = Children.toArray(children)[0];

  return (
    <div className="relative">
      <button
        className="absolute left-0 m-0 border-none bg-transparent p-0"
        onClick={() => setCollapsed((prev) => !prev)}
        aria-label="Expand Button"
      >
        {isCollapsed ? (
          <ChevronDownIcon className="inline-block size-4 align-middle" />
        ) : (
          <ChevronRightIcon className="inline-block size-4 align-middle" />
        )}
      </button>
      {isCollapsed ? children : <div>{firstLine}</div>}
    </div>
  );
};

export default Collapse;
