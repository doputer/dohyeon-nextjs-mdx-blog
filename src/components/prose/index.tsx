import type { ComponentType } from 'react';

interface Props {
  Content: ComponentType;
}

const Prose = ({ Content }: Props) => {
  return (
    <div className="space-y-6 wrap-break-word break-keep *:first:mt-0 *:last:mb-0">
      <Content />
    </div>
  );
};

export default Prose;
