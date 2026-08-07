'use client';

import Giscus from '@giscus/react';

import config from '@/configs/config.json';
import useTheme from '@/hooks/use-theme';

const Comment = () => {
  const { theme } = useTheme();

  return (
    <section aria-label="댓글">
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
        theme={`${config.siteUrl}/giscus/${theme}.css`}
        lang="ko"
        loading="lazy"
      />
    </section>
  );
};

export default Comment;
