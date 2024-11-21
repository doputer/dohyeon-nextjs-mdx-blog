import Image, { type ImageProps } from 'next/image';

const Img = (props: ImageProps) => {
  const caption = props?.title;
  const isUnoptimized = /.gif$/.test(props.src as string);

  return (
    <figure>
      <Image
        width={0}
        height={0}
        sizes="100vw"
        loading="eager"
        {...props}
        alt=""
        unoptimized={isUnoptimized}
      />
      {caption && <figcaption className="text-center text-sm text-muted">{caption}</figcaption>}
    </figure>
  );
};

export default Img;
