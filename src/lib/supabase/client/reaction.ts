import { supabase } from '@/lib/supabase/client';

export type Reaction = Record<string, number>;

export const getReactionBySlug = async (slug: string) => {
  const { data, error } = await supabase.from('reactions').select('type,count').eq('slug', slug);

  if (error) throw error;

  return data.reduce((acc, { type, count }) => {
    acc[type] = count;
    return acc;
  }, {} as Reaction);
};

export const postReaction = async (user_id: string, slug: string, type: string) => {
  const { error } = await supabase.rpc('increment_reaction', {
    _user_id: user_id,
    _slug: slug,
    _type: type,
  });

  if (error) throw error;
};
