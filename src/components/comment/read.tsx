import type { Comment } from '@/lib/supabase/comment';

interface Props {
  comments: Comment[];
}

const Read = ({ comments }: Props) => {
  return (
    <ul className="space-y-4">
      {comments.map((comment) => (
        <li key={comment.id} className="space-y-2 rounded bg-surface p-4">
          <div className="flex items-center gap-2">
            <div className="text-base">{comment.emoji}</div>
            <b className="text-sm font-semibold">{comment.label}</b>
          </div>
          <p className="text-sm whitespace-pre-line text-mute">{comment.value}</p>
        </li>
      ))}
    </ul>
  );
};

export default Read;
