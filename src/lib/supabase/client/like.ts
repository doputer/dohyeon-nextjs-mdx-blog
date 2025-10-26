import { supabase } from '@/lib/supabase/client';

export const postLike = async (user_id: string, slug: string) => {
  const { error } = await supabase.rpc('increment_like', {
    _user_id: user_id,
    _slug: slug,
  });

  if (error) throw error;
};
