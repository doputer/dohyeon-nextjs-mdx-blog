import type { Post } from '@/lib/MDX/types';

import TOC from '@/components/post/toc';

interface PostProps {
  toc: Post['toc'];
  MDX: Post['MDX'];
}

const Post = ({ toc, MDX }: PostProps) => {
  return (
    <section className="space-y-6">
      <TOC toc={toc} />
      <article className="space-y-6 wrap-break-word break-keep *:first:mt-0 *:last:mb-0">
        <MDX />
      </article>
    </section>
  );
};

export default Post;
