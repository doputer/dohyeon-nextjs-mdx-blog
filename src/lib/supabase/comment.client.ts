import { supabase } from '@/lib/supabase/client-csr';

export type Comment = { id: string; emoji: string; label: string; value: string };

export const getCommentBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('comments')
    .select('id,emoji,label,value')
    .eq('slug', slug)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data;
};

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
