import TOC from '@/components/post/toc';
import type { Post } from '@/lib/MDX/types';

interface PostProps {
  toc: Post['toc'];
  MDX: Post['MDX'];
}

const Post = ({ toc, MDX }: PostProps) => {
  return (
    <>
      <TOC toc={toc} />
      <div className="space-y-6 wrap-break-word break-keep *:first:mt-0 *:last:mb-0">
        <MDX />
      </div>
    </>
  );
};

export default Post;
