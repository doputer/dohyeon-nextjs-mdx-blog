import type { Post } from '@/lib/MDX/types';

import TOC from '@/components/toc';

interface PostProps {
  toc: Post['toc'];
  MDX: Post['MDX'];
}

const Post = ({ toc, MDX }: PostProps) => {
  return (
    <section>
      <article className="space-y-6 wrap-break-word break-keep *:first:mt-0 *:last:mb-0">
        <MDX />
      </article>
      {toc.length > 0 && <TOC toc={toc} />}
    </section>
  );
};

export default Post;
