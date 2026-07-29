'use client';

interface AnchorProps {
  id?: string;
}

const Anchor = ({ id }: AnchorProps) => {
  if (!id) return null;

  const handleClick = () => {
    const url = `${location.origin}${location.pathname}#${id}`;
    navigator.clipboard?.writeText(url).catch(() => {});
  };

  return (
    <a
      href={`#${id}`}
      aria-label="섹션 링크 복사"
      className="ml-2 text-sm font-normal text-soft opacity-0 transition-opacity duration-200 group-hover:opacity-70"
      onClick={handleClick}
    >
      #
    </a>
  );
};

export default Anchor;
