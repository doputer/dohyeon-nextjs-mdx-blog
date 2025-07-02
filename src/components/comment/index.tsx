'use client';

import { useCallback, useEffect, useState } from 'react';

import Read from '@/components/comment/read';
import Write from '@/components/comment/write';
import useActions from '@/hooks/use-actions';
import { getCommentBySlug, postComment } from '@/lib/supabase/comment.client';
import type { Comment } from '@/lib/supabase/comment.client';
import { getItem } from '@/utils/local-storage';
import { burst } from '@/utils/particle';

interface Props {
  slug: string;
}

const Comment = ({ slug }: Props) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const { hasActions, setActions } = useActions();

  const handleWrite = useCallback(
    async (newComment: Comment) => {
      burst();

      try {
        const id = getItem('UNIQUE_USER_ID');

        if (!id) return;
        if (hasActions(slug, 'comment')) return;

        await postComment(id, slug, newComment);

        setComments((prev) => [{ ...newComment, id }, ...prev]);
        setActions(slug, 'comment');
      } catch (error) {
        throw error;
      }
    },
    [hasActions, setActions, slug]
  );

  useEffect(() => {
    getCommentBySlug(slug).then((data) => setComments(data));
  }, [slug]);

  return (
    <section className="space-y-4">
      <div>댓글 {comments.length}</div>

      <Write disabled={hasActions(slug, 'comment')} onSubmit={handleWrite} />

      {comments.map((data) => (
        <Read key={data.id} {...data} />
      ))}
    </section>
  );
};

export default Comment;
