'use client';

import { PropsWithChildren, useState } from 'react';

const InlineFold = ({ children }: PropsWithChildren) => {
  const [folded, setFolded] = useState(true);

  if (!folded) return children;

  return (
    <button
      onClick={() => setFolded(false)}
      className="bg-light-ellipsis dark:bg-dark-ellipsis rounded"
      aria-label="Expand"
    >
      ...
    </button>
  );
};

export default InlineFold;
