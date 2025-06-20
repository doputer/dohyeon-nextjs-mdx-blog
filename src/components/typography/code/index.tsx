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
    <div className="border-line bg-background my-4 rounded-lg border font-mono text-sm leading-6">
      {title && <div className="border-line border-b px-4 py-2">{title}</div>}
      <div className="overflow-auto py-4">{children}</div>
    </div>
  );
};

export default Code;
