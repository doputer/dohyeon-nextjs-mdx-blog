import Floating from '@/components/Floating';
import TOC from '@/components/TOC';
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
