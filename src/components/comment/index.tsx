'use client';

import { use, useCallback, useState } from 'react';

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
  const [comments, setComments] = useState<Comment[]>(use(initial));
  const { hasActions, setActions } = useActions();

  const handleWrite = useCallback(
    async (newComment: Comment) => {
      const id = getItem('UNIQUE_USER_ID');

      if (!id) return;
      if (hasActions(slug, 'comment')) return;
      if (process.env.NODE_ENV === 'development') return;

      burst();

      setComments((state) => [newComment, ...state]);

      await postComment(id, slug, newComment);

      setActions(slug, 'comment');
    },
    [hasActions, setActions, slug]
  );

  return (
    <section className="space-y-4">
      <div>댓글 {comments.length}</div>
      <Write disabled={hasActions(slug, 'comment')} onSubmit={handleWrite} />
      <Read comments={comments} />
    </section>
  );
};

export default Comment;
