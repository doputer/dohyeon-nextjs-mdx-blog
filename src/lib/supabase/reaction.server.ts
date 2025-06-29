import { createClient } from '@/lib/supabase/client-ssr';

export type Type = 'partying-face' | 'party-popper' | 'rocket';

export type Reaction = Record<Type, number>;

export const getReactionBySlug = async (slug: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('reactions')
    .select('reaction_type,count')
    .eq('post_slug', slug);

  if (error) throw error;

  return data.reduce((acc, cur) => {
    acc[cur.reaction_type as Type] = cur.count;
    return acc;
  }, {} as Reaction);
};
