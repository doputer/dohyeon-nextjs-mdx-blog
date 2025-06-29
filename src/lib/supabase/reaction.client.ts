import { supabase } from '@/lib/supabase/client-csr';

export const postReaction = async (user_id: string, slug: string, type: string) => {
  const { error } = await supabase.rpc('increment_reaction', {
    _user_id: user_id,
    _slug: slug,
    _type: type,
  });

  if (error) throw error;
};
