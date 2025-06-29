'use client';

import { useCallback, useState } from 'react';

import Read from '@/components/comment/read';
import Write from '@/components/comment/write';
import useActions from '@/hooks/use-actions';
import { postComment } from '@/lib/supabase/comment.client';
import { getItem } from '@/utils/local-storage';
import { burst } from '@/utils/particle';

interface Props {
  data: Comment[];
  slug: string;
}

export type Comment = { id: string; emoji: string; label: string; value: string };

const Comment = ({ data, slug }: Props) => {
  const [comments, setComments] = useState(data);
  const { hasActions, setActions } = useActions();

  const handleWrite = useCallback(
    async (newComment: Comment) => {
      burst();

      try {
        const user_id = getItem('UNIQUE_USER_ID');

        if (!user_id) return;
        if (hasActions(slug, 'comment')) return;

        await postComment(user_id, slug, newComment);

        setComments((prev) => [newComment, ...prev]);
        setActions(slug, 'comment');
      } catch (error) {
        throw error;
      }
    },
    [hasActions, setActions, slug]
  );

  return (
    <div className="space-y-4">
      <div>댓글 {comments.length}</div>

      <Write disabled={hasActions(slug, 'comment')} onSubmit={handleWrite} />

      {comments.map((data) => (
        <Read key={data.id} {...data} />
      ))}
    </div>
  );
};

export default Comment;
