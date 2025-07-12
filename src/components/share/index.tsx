'use client';

import { LinkIcon } from '@heroicons/react/24/solid';

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
    <section>
      <button
        className="mx-auto flex items-center gap-2"
        onClick={handleShareClick}
        aria-label="Share Button"
      >
        공유하기
        <LinkIcon className="size-5" />
      </button>
    </section>
  );
};

export default Share;
