import { createClient } from '@/lib/supabase/client-ssr';

export type Type = 'reaction1' | 'reaction2' | 'reaction3';

export type Reaction = Record<Type, number>;

export const getReactionBySlug = async (slug: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase.from('reactions').select('type,count').eq('slug', slug);

  if (error) throw error;

  return data.reduce((acc, { type, count }) => {
    acc[type as Type] = count;
    return acc;
  }, {} as Reaction);
};
