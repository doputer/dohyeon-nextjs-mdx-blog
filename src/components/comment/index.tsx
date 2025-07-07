'use client';

import { use, useCallback, useState } from 'react';

import Read from '@/components/comment/read';
import Write from '@/components/comment/write';
import { useAction } from '@/contexts/action/use-action';
import { type Comment, postComment } from '@/lib/supabase/client/comment';
import { getItem } from '@/utils/local-storage';
import { burst } from '@/utils/particle';

interface Props {
  initial: Promise<Comment[]>;
  slug: string;
}

const Comment = ({ initial, slug }: Props) => {
  const [comments, setComments] = useState<Comment[]>(use(initial));
  const { hasAction, setAction } = useAction();

  const handleWrite = useCallback(
    async (newComment: Comment) => {
      if (process.env.NODE_ENV === 'development') return;

      const id = getItem('UNIQUE_USER_ID');
      if (!id) return;
      if (hasAction(slug, 'comment')) return;

      burst();

      setComments((state) => [newComment, ...state]);

      await postComment(id, slug, newComment);

      setAction(slug, 'comment');
    },
    [hasAction, setAction, slug]
  );

  return (
    <section className="space-y-4">
      <div>댓글 {comments.length}</div>
      <Write disabled={hasAction(slug, 'comment')} onSubmit={handleWrite} />
      <Read comments={comments} />
    </section>
  );
};

export default Comment;
