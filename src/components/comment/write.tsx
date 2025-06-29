import { useEffect, useState } from 'react';

import type { Comment } from '@/components/comment';

interface Props {
  onSubmit: (data: Comment) => void;
}

const emojis = ['🚀', '🐱', '🧠', '🍕', '🌈', '👾', '🔥', '🎩'];
const labels = ['이상한', '똑똑한', '멋진', '졸린', '슬픈', '기쁜', '차가운'];
const getRandom = (array: string[]) => array[Math.floor(Math.random() * array.length)];

const Write = ({ onSubmit }: Props) => {
  const [comment, setComment] = useState({ emoji: '', label: '', value: '' });

  const reroll = () => {
    setComment((prev) => ({ ...prev, emoji: getRandom(emojis), label: getRandom(labels) }));
  };

  const handleWrite = () => {
    if (!comment.value.trim()) return;

    onSubmit({ id: crypto.randomUUID(), ...comment });
    setComment((prev) => ({ ...prev, value: '' }));
  };

  useEffect(() => {
    reroll();
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <button className="flex items-center gap-2" onClick={reroll}>
          <div className="w-6 text-2xl">{comment.emoji}</div>
          <b className="text-sm">{comment.label} 개발자</b>
        </button>
        <button
          className="bg-surface p-2 text-sm text-subtle transition-colors duration-300 ease-out hover:bg-subtle/20"
          onClick={handleWrite}
        >
          남기기
        </button>
      </div>
      <textarea
        name="comment"
        id="comment"
        className="block w-full resize-none border border-line p-4 text-sm text-subtle outline-0 placeholder:text-subtle/50"
        placeholder="댓글을 남겨주세요."
        value={comment.value}
        onChange={(e) => setComment((prev) => ({ ...prev, value: e.target.value }))}
      ></textarea>
    </div>
  );
};

export default Write;
