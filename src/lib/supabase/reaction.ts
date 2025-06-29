import { supabase } from '@/lib/supabase';

export type Type = 'partying-face' | 'party-popper' | 'rocket';

export interface ReactionCount {
  reaction_type: Type;
  count: number;
}

export const getReactionBySlug = async (slug: string): Promise<ReactionCount[]> => {
  const { data, error } = await supabase
    .from('reactions')
    .select('reaction_type,count')
    .eq('post_slug', slug);

  if (error) throw error;

  return data;
};

export const postReaction = async (slug: string, type: Type) => {
  const { error } = await supabase.rpc('increment_reaction', {
    _post_slug: slug,
    _reaction_type: type,
  });

  if (error) throw error;
};
