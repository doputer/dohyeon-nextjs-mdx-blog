import type { Comment } from '@/lib/supabase/comment';

const Read = (props: Comment) => {
  return (
    <div className="space-y-2 rounded bg-surface p-4">
      <div className="flex items-center gap-2">
        <div className="text-base">{props.emoji}</div>
        <b className="text-sm font-semibold">{props.label}</b>
      </div>
      <div className="text-sm whitespace-pre-line text-mute">{props.value}</div>
    </div>
  );
};

export default Read;
