import { createClient } from '@/lib/supabase/server';

export const getLikeBySlug = async (slug: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('likes')
    .select('count')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;

  return data?.count ?? 0;
};
