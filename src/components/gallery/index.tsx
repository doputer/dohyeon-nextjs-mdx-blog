import Link from 'next/link';

import type { Playground } from '@/lib/playground/types';

interface GalleryProps {
  playgrounds: Pick<Playground, 'slug' | 'frontmatter' | 'thumbnail'>[];
}

const Gallery = ({ playgrounds }: GalleryProps) => {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-6 py-3.5 sm:grid-cols-3">
      {playgrounds.map(({ slug, frontmatter, thumbnail: Thumbnail }) => (
        <li key={slug} className="group/li">
          <Link href={`/playground/${slug}`} className="flex flex-col gap-2">
            <div className="flex aspect-video items-center justify-center overflow-hidden rounded bg-surface">
              <div className="flex h-full w-full items-center justify-center transition-transform duration-200 ease-out group-hover/li:scale-110">
                <Thumbnail />
              </div>
            </div>
            <h2 className="text-sm break-keep">
              <span className="underline-offset-4 group-hover/li:underline">
                {frontmatter.title}
              </span>
            </h2>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Gallery;
