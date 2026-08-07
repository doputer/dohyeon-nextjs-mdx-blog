import collapse from '@/components/typography/code/handlers/collapse';
import fold from '@/components/typography/code/handlers/fold';
import mark from '@/components/typography/code/handlers/mark';
import { cn } from '@/utils/cn';
import { type HighlightedCode, Pre } from 'codehike/code';

interface Props {
  codeblock: HighlightedCode;
  className?: string;
}

const Code = ({ codeblock, className }: Props) => {
  const handlers = [mark, fold, collapse];

  return (
    <div className="relative rounded border border-line bg-background">
      {codeblock.meta && (
        <span className="absolute right-0 bottom-full -translate-x-3 translate-y-1/2 rounded bg-background px-1 font-mono text-xs tracking-tight text-muted">
          {codeblock.meta}
        </span>
      )}
      <Pre
        code={codeblock}
        handlers={handlers}
        role="region"
        aria-label={codeblock.meta || `${codeblock.lang} 코드`}
        tabIndex={0}
        className={cn('overflow-auto py-4', className)}
      />
    </div>
  );
};

export default Code;
