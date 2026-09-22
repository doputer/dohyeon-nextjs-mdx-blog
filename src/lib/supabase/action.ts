import { supabase } from '@/lib/supabase/client';

export const getActionBySlug = async (user_id: string, slug: string) => {
  const { data, error } = await supabase
    .from('actions')
    .select('action')
    .eq('user_id', user_id)
    .eq('slug', slug);

  if (error) throw error;

  return data;
};
