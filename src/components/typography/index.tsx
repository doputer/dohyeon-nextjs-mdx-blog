import type { ImageProps } from 'next/image';

import type { MDXComponents } from 'mdx/types';

import Anchor from '@/components/typography/anchor';
import Blockquote from '@/components/typography/blockquote';
import Callout from '@/components/typography/callout';
import Code from '@/components/typography/code';
import * as format from '@/components/typography/format';
import Img from '@/components/typography/img';
import Mermaid from '@/components/typography/mermaid';
import Table from '@/components/typography/table';
import { cn } from '@/utils/cn';

const components: MDXComponents = {
  h2: ({ children, ...props }) => (
    <h2 className={cn(format.h2, 'group')} {...props}>
      {children}
      <Anchor id={props.id} />
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className={cn(format.h3, 'group')} {...props}>
      {children}
      <Anchor id={props.id} />
    </h3>
  ),
  h4: (props) => <h4 className={format.h4} {...props} />,
  hr: () => (
    <div role="separator" className="flex justify-center gap-3 text-accent select-none">
      <span>·</span>
      <span>·</span>
      <span>·</span>
    </div>
  ),
  code: (props) => <code className={format.code} {...props} />,
  ol: (props) => <ol className={format.ol} {...props} />,
  ul: (props) => <ul className={format.ul} {...props} />,
  p: (props) => <p className={format.p} {...props} />,
  table: (props) => <Table className={format.table} {...props} />,
  th: (props) => <th className={format.th} {...props} />,
  td: (props) => <td className={format.td} {...props} />,
  a: (props) => <a className={format.a} target="_blank" {...props} />,
  strong: (props) => <strong className={format.strong} {...props} />,
  img: (props) => <Img className={format.img} {...(props as ImageProps)} />,
  blockquote: (props) => <Blockquote className={format.blockquote} {...props} />,
  Code: (props) => <Code className={format.pre} {...props} />,
  Callout: (props) => <Callout className={format.callout} {...props} />,
  Mermaid: (props) => <Mermaid {...props} />,
};

export default components;
