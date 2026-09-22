import type { ImageProps } from 'next/image';
import Link from 'next/link';

import type { MDXComponents } from 'mdx/types';

import Blockquote from '@/components/typography/blockquote';
import Callout from '@/components/typography/callout';
import Code from '@/components/typography/code';
import * as format from '@/components/typography/format';
import Img from '@/components/typography/img';
import Mermaid from '@/components/typography/mermaid';
import Table from '@/components/typography/table';
import { cn } from '@/utils/cn';

const components: MDXComponents = {
  h2: ({ className, ...props }) => <h2 className={cn(format.h2, className)} {...props} />,
  h3: (props) => <h3 className={format.h3} {...props} />,
  h4: (props) => <h4 className={format.h4} {...props} />,
  code: (props) => <code className={format.code} {...props} />,
  ol: (props) => <ol className={format.ol} {...props} />,
  ul: ({ className, ...props }) => <ul className={cn(format.ul, className)} {...props} />,
  p: (props) => <p className={format.p} {...props} />,
  hr: (props) => <hr className={format.hr} {...props} />,
  input: (props) => <input className={format.input} {...props} />,
  table: (props) => <Table className={format.table} {...props} />,
  th: (props) => <th scope="col" className={format.th} {...props} />,
  td: (props) => <td className={format.td} {...props} />,
  a: ({ href, className, ...props }) => {
    const isInternal = !!href && href.startsWith('/');
    const isExternal = !!href && !href.startsWith('/') && !href.startsWith('#');

    if (isInternal) return <Link href={href} className={cn(format.a, className)} {...props} />;

    return (
      <a
        href={href}
        className={cn(format.a, isExternal && format.external, className)}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noreferrer' : undefined}
        {...props}
      />
    );
  },
  strong: (props) => <strong className={format.strong} {...props} />,
  img: (props) => <Img className={format.img} {...(props as ImageProps)} />,
  blockquote: (props) => <Blockquote className={format.blockquote} {...props} />,
  Code: (props) => <Code className={format.pre} {...props} />,
  Mermaid: (props) => <Mermaid {...props} />,
  Callout: (props) => <Callout className={format.callout} {...props} />,
};

export default components;
