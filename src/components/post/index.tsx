import TOC from '@/components/toc';
import type { Post } from '@/lib/MDX/types';

interface PostProps {
  toc: Post['toc'];
  MDX: Post['MDX'];
}

const Post = ({ toc, MDX }: PostProps) => {
  return (
    <div className="relative">
      <TOC toc={toc} />
      <article className="[&>*:first-child]:mt-0">
        <MDX />
      </article>
    </div>
  );
};

export default Post;
