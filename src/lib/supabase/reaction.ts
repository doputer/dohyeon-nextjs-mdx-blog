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

  if (!data || error) throw new Error('error');

  return data;
};
