import { supabase } from '@/lib/supabase/client-csr';
import type { Type } from '@/lib/supabase/reaction.server';
import { getItem } from '@/utils/local-storage';

export const postReaction = async (slug: string, type: Type) => {
  const id = getItem('UNIQUE_USER_ID');
  if (!id) return;

  const { error } = await supabase.rpc('increment_reaction', {
    _user_id: id,
    _slug: slug,
    _type: type,
  });

  if (error) throw error;
};
