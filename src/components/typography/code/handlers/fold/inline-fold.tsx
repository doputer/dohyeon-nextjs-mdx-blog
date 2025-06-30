'use client';

import { useState } from 'react';

import { AnnotationHandler } from 'codehike/code';

const InlineFold: AnnotationHandler['Inline'] = ({ children }) => {
  const [folded, setFolded] = useState(true);

  if (!folded) return children;

  return (
    <button
      onClick={() => setFolded(false)}
      className="rounded bg-black/10 dark:bg-white/10"
      aria-label="Expand Button"
    >
      ...
    </button>
  );
};

export default InlineFold;
