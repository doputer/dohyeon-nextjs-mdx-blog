import Image, { type ImageProps } from 'next/image';

const toURL = (src: ImageProps['src']) => {
  if (typeof src === 'string') return src;
  return 'default' in src ? src.default.src : src.src;
};

const Img = (props: ImageProps) => {
  const caption = props?.title;

  return (
    <figure className="space-y-4">
      <Image
        {...props}
        alt={props.alt ?? ''}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
        unoptimized={toURL(props.src).endsWith('.gif')}
      />
      {caption && <figcaption className="text-center text-sm text-soft">{caption}</figcaption>}
    </figure>
  );
};

export default Img;
