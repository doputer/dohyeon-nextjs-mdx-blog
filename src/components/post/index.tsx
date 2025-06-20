import Floating from '@/components/floating';
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
      <Floating toc={toc} />
    </div>
  );
};

export default Post;
