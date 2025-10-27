import { type HighlightedCode, Pre } from 'codehike/code';

import collapse from '@/components/typography/code/handlers/collapse';
import fold from '@/components/typography/code/handlers/fold';
import mark from '@/components/typography/code/handlers/mark';
import Mermaid from '@/components/typography/code/mermaid';
import { cn } from '@/utils/cn';

interface Props {
  codeblock: HighlightedCode;
  className?: string;
}

const Code = ({ codeblock, className }: Props) => {
  const handlers = [mark, fold, collapse];

  if (codeblock.lang === 'mermaid') return <Mermaid code={codeblock.code} />;

  return (
    <div className="relative rounded border border-line bg-background">
      {codeblock.meta && (
        <span className="absolute right-0 bottom-full -translate-x-3 translate-y-1/2 bg-background px-1 font-mono text-xs tracking-tight text-mute">
          {codeblock.meta}
        </span>
      )}
      <Pre code={codeblock} handlers={handlers} className={cn('overflow-auto py-4', className)} />
    </div>
  );
};

export default Code;
