import { supabase } from '@/lib/supabase/client';

export const postComment = async (
  user_id: string,
  slug: string,
  comment: { emoji: string; label: string; value: string },
  type: string = 'comment'
) => {
  const { error } = await supabase.rpc('insert_comment', {
    _user_id: user_id,
    _slug: slug,
    _emoji: comment.emoji,
    _label: comment.label,
    _value: comment.value,
    _type: type,
  });

  if (error) throw error;
};
