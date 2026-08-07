'use client';

import { useState } from 'react';

import { AnnotationHandler } from 'codehike/code';

const InlineFold: AnnotationHandler['Inline'] = ({ children }) => {
  const [folded, setFolded] = useState(true);

  if (!folded) return children;

  return (
    <button
      type="button"
      onClick={() => setFolded(false)}
      className="rounded bg-surface"
      aria-expanded={false}
      aria-label="생략된 코드 펼치기"
    >
      ...
    </button>
  );
};

export default InlineFold;
