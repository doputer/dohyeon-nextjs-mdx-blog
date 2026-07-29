'use client';

import { useEffect, useState } from 'react';

import config from '@/configs/config.json';
import useTheme from '@/hooks/use-theme';
import Giscus from '@giscus/react';

const Comment = () => {
  const { theme } = useTheme();

  const [origin, setOrigin] = useState(config.siteUrl);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  return (
    <div>
      <Giscus
        repo={config.comment.repo as `${string}/${string}`}
        repoId={config.comment.repoId}
        category={config.comment.category}
        categoryId={config.comment.categoryId}
        mapping="title"
        strict="0"
        reactionsEnabled="0"
        emitMetadata="0"
        inputPosition="top"
        theme={`${origin}/giscus/ink-${theme}.css`}
        lang="ko"
        loading="lazy"
      />
    </div>
  );
};

export default Comment;
