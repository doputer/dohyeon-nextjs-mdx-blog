'use client';

import { useEffect, useState } from 'react';

import Giscus from '@giscus/react';

import config from '@/configs/config.json';

const Comment = () => {
  const [theme, setTheme] = useState(global.window?.__theme || 'light');

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          setTheme(global.window?.__theme);
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => {
      observer.disconnect();
    };
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
        theme={theme === 'light' ? 'noborder_light' : 'noborder_dark'}
        lang="ko"
        loading="lazy"
      />
    </div>
  );
};

export default Comment;
