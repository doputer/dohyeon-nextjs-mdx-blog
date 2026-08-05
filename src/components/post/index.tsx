import type { Post } from '@/lib/MDX/types';

interface PostProps {
  MDX: Post['MDX'];
}

const Post = ({ MDX }: PostProps) => {
  return (
    <section>
      <article className="space-y-6 wrap-break-word break-keep *:first:mt-0 *:last:mb-0">
        <MDX />
      </article>
    </section>
  );
};

export default Post;
