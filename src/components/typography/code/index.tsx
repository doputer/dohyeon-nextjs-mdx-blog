import { type HighlightedCode, Pre } from 'codehike/code';

import collapse from '@/components/typography/code/handlers/collapse';
import fold from '@/components/typography/code/handlers/fold';
import mark from '@/components/typography/code/handlers/mark';
import { cn } from '@/utils/cn';

interface Props {
  codeblock: HighlightedCode;
  className?: string;
}

const Code = ({ codeblock, className }: Props) => {
  const handlers = [mark, fold, collapse];

  return (
    <div className={cn('divide-y divide-line rounded border border-line bg-background', className)}>
      {codeblock.meta && <div className="px-4 py-2 font-mono tracking-tight">{codeblock.meta}</div>}
      <Pre code={codeblock} handlers={handlers} className="overflow-auto py-4" />
    </div>
  );
};

export default Code;
