import type { PropsWithChildren } from 'react';

import { type HighlightedCode, Pre } from 'codehike/code';

import collapse from '@/components/typography/code/handlers/collapse';
import fold from '@/components/typography/code/handlers/fold';
import mark from '@/components/typography/code/handlers/mark';

interface CodeProps {
  codeblock: HighlightedCode;
}

const Code = (props: CodeProps) => {
  const meta = props.codeblock.meta;
  const handlers = [mark, fold, collapse];

  return (
    <Wrapper title={meta}>
      <Pre code={props.codeblock} handlers={handlers} />
    </Wrapper>
  );
};

interface WrapperProps {
  title: string;
}

const Wrapper = ({ title, children }: PropsWithChildren<WrapperProps>) => {
  return (
    <div className="border-line bg-background divide-line my-4 divide-y rounded-lg border text-sm leading-6">
      {title && <div className="px-4 py-2 font-mono tracking-tight">{title}</div>}
      <div className="overflow-auto py-4">{children}</div>
    </div>
  );
};

export default Code;
