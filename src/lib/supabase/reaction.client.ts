import { supabase } from '@/lib/supabase/client-csr';
import type { Type } from '@/lib/supabase/reaction.server';

export const postReaction = async (slug: string, type: Type) => {
  const { error } = await supabase.rpc('increment_reaction', {
    _post_slug: slug,
    _reaction_type: type,
  });

  if (error) throw error;
};
