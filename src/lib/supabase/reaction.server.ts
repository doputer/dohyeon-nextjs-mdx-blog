import { createClient } from '@/lib/supabase/client-ssr';

export const getReactionBySlug = async (slug: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase.from('reactions').select('type,count').eq('slug', slug);

  if (error) throw error;

  return data.reduce(
    (acc, { type, count }) => {
      acc[type] = count;
      return acc;
    },
    {} as Record<string, number>
  );
};
