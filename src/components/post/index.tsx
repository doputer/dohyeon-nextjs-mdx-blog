import TOC from '@/components/toc';
import type { Post } from '@/lib/MDX/types';

interface PostProps {
  toc: Post['toc'];
  MDX: Post['MDX'];
}

const Post = ({ toc, MDX }: PostProps) => {
  return (
    <section className="relative space-y-6 md:space-y-8">
      {toc.length > 0 && <TOC toc={toc} />}
      <article className="*:first:mt-0 *:last:mb-0">
        <MDX />
      </article>
    </section>
  );
};

export default Post;
