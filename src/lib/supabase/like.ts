import { supabase } from '@/lib/supabase/client';

export const getLikeBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('likes')
    .select('count')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;

  return data?.count ?? 0;
};

export const postLike = async (user_id: string, slug: string) => {
  const { error } = await supabase.rpc('increment_like', {
    _user_id: user_id,
    _slug: slug,
  });

  if (error) throw error;
};
