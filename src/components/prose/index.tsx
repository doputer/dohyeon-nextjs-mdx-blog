import type { ComponentType } from 'react';

interface Props {
  MDX: ComponentType;
}

const Prose = ({ MDX }: Props) => {
  return (
    <div className="space-y-6 wrap-break-word break-keep *:first:mt-0 *:last:mb-0">
      <MDX />
    </div>
  );
};

export default Prose;
