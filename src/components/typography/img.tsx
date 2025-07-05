import Image, { type ImageProps } from 'next/image';

const Img = (props: ImageProps) => {
  const caption = props?.title;
  const isUnoptimized = /.gif$/.test(props.src as string);

  return (
    <figure className="space-y-4">
      <Image
        {...props}
        width={props.width || 0}
        height={props.height || 0}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
        priority
        alt=""
        unoptimized={isUnoptimized}
        className="h-auto w-full"
      />
      {caption && <figcaption className="text-center text-sm text-mute">{caption}</figcaption>}
    </figure>
  );
};

export default Img;
