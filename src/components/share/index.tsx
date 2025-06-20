'use client';

import { ShareIcon } from '@heroicons/react/24/solid';

interface ShareProps {
  title: string;
  description: string;
}

const Share = ({ title, description }: ShareProps) => {
  const handleShareClick = () => {
    const shareData = {
      title: title,
      text: description,
      url: decodeURI(window.location.href),
    };

    if (navigator.canShare && navigator.canShare(shareData)) {
      window.navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(decodeURI(window.location.href));
    }
  };

  return (
    <div className="bg-surface flex justify-center rounded-lg py-8">
      <button
        className="hover:text-secondary flex gap-2"
        onClick={handleShareClick}
        aria-label="Share Button"
      >
        공유하기
        <ShareIcon className="size-6" />
      </button>
    </div>
  );
};

export default Share;
