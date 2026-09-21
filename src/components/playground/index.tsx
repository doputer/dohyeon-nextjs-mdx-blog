import type { Playground } from '@/lib/playground/types';

interface Props {
  MDX: Playground['MDX'];
}

const Playground = ({ MDX }: Props) => {
  return (
    <div className="space-y-6 wrap-break-word break-keep *:first:mt-0 *:last:mb-0">
      <MDX />
    </div>
  );
};

export default Playground;
