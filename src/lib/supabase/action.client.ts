import { supabase } from '@/lib/supabase/client-csr';

export const getActionByUserId = async (user_id: string) => {
  const { data, error } = await supabase
    .from('actions')
    .select('slug,action')
    .eq('user_id', user_id);

  if (error) throw error;

  return data;
};
