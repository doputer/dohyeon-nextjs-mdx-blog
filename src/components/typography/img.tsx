import Image, { type ImageProps } from 'next/image';

const Img = (props: ImageProps) => {
  const caption = props?.title;
  const isUnoptimized = typeof props.src === 'string' && props.src.endsWith('.gif');

  return (
    <figure className="space-y-4">
      <Image
        {...props}
        alt={props.alt ?? ''}
        width={props.width || 0}
        height={props.height || 0}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
        unoptimized={isUnoptimized}
      />
      {caption && <figcaption className="text-center text-sm text-soft">{caption}</figcaption>}
    </figure>
  );
};

export default Img;
