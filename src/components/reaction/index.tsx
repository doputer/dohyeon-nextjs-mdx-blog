'use client';

import useLike from '@/hooks/use-like';

interface Props {
  slug: string;
}

const Reaction = ({ slug }: Props) => {
  const { like, liked, addLike } = useLike(slug);

  return (
    <section className="flex flex-col items-center gap-8">
      <div aria-hidden className="flex gap-3 text-muted select-none">
        <span>·</span>
        <span>·</span>
        <span>·</span>
      </div>
      <button
        type="button"
        aria-label={`좋아요 ${like ?? 0}개`}
        aria-pressed={liked}
        onClick={addLike}
        className="mx-auto flex items-center gap-2 rounded px-4 py-2 text-main hover:bg-surface"
      >
        <span className="text-base leading-none" aria-hidden>
          {liked ? '♥' : '♡'}
        </span>
        <span className="text-sm font-medium tabular-nums">{like ?? 0}</span>
      </button>
    </section>
  );
};

export default Reaction;
