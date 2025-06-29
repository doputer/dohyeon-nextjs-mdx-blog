import type { Comment } from '@/components/comment';

const Read = (props: Comment) => {
  return (
    <div className="space-y-2 bg-surface p-4">
      <div className="flex items-center gap-2">
        <div className="text-2xl">{props.emoji}</div>
        <b className="text-sm">{props.label} 개발자</b>
      </div>
      <div className="text-sm whitespace-pre-line text-subtle">{props.value}</div>
    </div>
  );
};

export default Read;
