import { type HighlightedCode, Pre } from 'codehike/code';

import collapse from '@/components/typography/code/handlers/collapse';
import fold from '@/components/typography/code/handlers/fold';
import mark from '@/components/typography/code/handlers/mark';

interface Props {
  codeblock: HighlightedCode;
}

const Code = ({ codeblock }: Props) => {
  const handlers = [mark, fold, collapse];

  return (
    <div className="my-4 divide-y divide-line rounded-lg border border-line bg-background text-sm leading-6">
      {codeblock.meta && <div className="px-4 py-2 font-mono tracking-tight">{codeblock.meta}</div>}
      <Pre code={codeblock} handlers={handlers} className="overflow-auto py-4" />
    </div>
  );
};

export default Code;
