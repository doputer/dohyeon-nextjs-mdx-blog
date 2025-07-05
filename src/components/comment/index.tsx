'use client';

import { use, useCallback, useOptimistic } from 'react';

import Read from '@/components/comment/read';
import Write from '@/components/comment/write';
import useActions from '@/hooks/use-actions';
import { type Comment, postComment } from '@/lib/supabase/comment';
import { getItem } from '@/utils/local-storage';
import { burst } from '@/utils/particle';

interface Props {
  initial: Promise<Comment[]>;
  slug: string;
}

const Comment = ({ initial, slug }: Props) => {
  const [comments, addComments] = useOptimistic<Comment[], Comment>(
    use(initial),
    (state, newComment) => [newComment, ...state]
  );
  const { hasActions, setActions } = useActions();

  const handleWrite = useCallback(
    async (newComment: Comment) => {
      burst();

      const id = getItem('UNIQUE_USER_ID');

      if (!id) return;
      if (hasActions(slug, 'comment')) return;

      await postComment(id, slug, newComment);

      addComments({ ...newComment, id });
      setActions(slug, 'comment');
    },
    [addComments, hasActions, setActions, slug]
  );

  return (
    <section className="space-y-4">
      <div>댓글 {comments.length}</div>

      <Write disabled={hasActions(slug, 'comment')} onSubmit={handleWrite} />

      <ul className="space-y-4">
        {comments.map((data) => (
          <Read key={data.id} {...data} />
        ))}
      </ul>
    </section>
  );
};

export default Comment;
