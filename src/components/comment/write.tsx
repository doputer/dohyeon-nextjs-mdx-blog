import { useEffect, useState } from 'react';

import type { Comment } from '@/lib/supabase/comment.client';

interface Props {
  disabled: boolean;
  onSubmit: (data: Comment) => void;
}

const fruits = [
  { emoji: '🍎', label: '사과' },
  { emoji: '🍌', label: '바나나' },
  { emoji: '🍊', label: '오렌지' },
  { emoji: '🍇', label: '포도' },
  { emoji: '🍓', label: '딸기' },
  { emoji: '🍑', label: '복숭아' },
  { emoji: '🍍', label: '파인애플' },
  { emoji: '🥝', label: '키위' },
  { emoji: '🍒', label: '체리' },
  { emoji: '🍉', label: '수박' },
  { emoji: '🥭', label: '망고' },
  { emoji: '🍐', label: '배' },
  { emoji: '🍈', label: '멜론' },
  { emoji: '🍋', label: '레몬' },
  { emoji: '🫐', label: '블루베리' },
  { emoji: '🍋‍🟩', label: '라임' },
  { emoji: '🥥', label: '코코넛' },
  { emoji: '🥑', label: '아보카도' },
  { emoji: '🥔', label: '감자' },
];

const Write = ({ disabled, onSubmit }: Props) => {
  const [comment, setComment] = useState({ id: '', emoji: '', label: '', value: '' });

  const reroll = () => {
    setComment((prev) => ({ ...prev, ...fruits[Math.floor(Math.random() * fruits.length)] }));
  };

  const handleWrite = () => {
    if (!comment.value.trim()) return;

    onSubmit(comment);
    setComment((prev) => ({ ...prev, value: '' }));
  };

  useEffect(() => {
    reroll();
  }, []);

  return (
    <div className="space-y-4 text-right">
      <textarea
        name="comment"
        id="comment"
        className="block w-full resize-none rounded border border-line p-4 text-subtle outline-0 placeholder:text-subtle/50 disabled:cursor-not-allowed"
        placeholder="댓글을 남겨주세요."
        value={comment.value}
        onChange={(e) => setComment((prev) => ({ ...prev, value: e.target.value }))}
        disabled={disabled}
      ></textarea>
      <button
        className="rounded bg-surface p-2 text-sm text-subtle transition-colors duration-300 ease-out not-disabled:hover:bg-subtle/20 disabled:cursor-not-allowed"
        onClick={handleWrite}
        disabled={disabled}
      >
        남기기
      </button>
    </div>
  );
};

export default Write;
