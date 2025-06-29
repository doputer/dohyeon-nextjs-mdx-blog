import { createClient } from '@/lib/supabase/client-ssr';

export const getCommentBySlug = async (slug: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('comments')
    .select('id,emoji,label,value')
    .eq('slug', slug);

  if (error) throw error;

  return data;
};
