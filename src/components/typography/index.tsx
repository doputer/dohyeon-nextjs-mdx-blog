import type { ImageProps } from 'next/image';

import type { MDXComponents } from 'mdx/types';

import Blockquote from '@/components/typography/blockquote';
import Callout from '@/components/typography/callout';
import Code from '@/components/typography/code';
import * as format from '@/components/typography/format';
import Heading from '@/components/typography/heading';
import Img from '@/components/typography/img';
import Mermaid from '@/components/typography/mermaid';
import Table from '@/components/typography/table';
import { cn } from '@/utils/cn';

const components: MDXComponents = {
  h2: ({ className, ...props }) => (
    <Heading as="h2" className={cn(format.h2, className)} {...props} />
  ),
  h3: ({ className, ...props }) => (
    <Heading as="h3" className={cn(format.h3, className)} {...props} />
  ),
  h4: ({ className, ...props }) => (
    <Heading as="h4" className={cn(format.h4, className)} {...props} />
  ),
  code: ({ className, ...props }) => <code className={cn(format.code, className)} {...props} />,
  ol: ({ className, ...props }) => <ol className={cn(format.ol, className)} {...props} />,
  ul: ({ className, ...props }) => <ul className={cn(format.ul, className)} {...props} />,
  p: ({ className, ...props }) => <p className={cn(format.p, className)} {...props} />,
  hr: ({ className, ...props }) => <hr className={cn(format.hr, className)} {...props} />,
  sup: ({ className, ...props }) => <sup className={cn(format.sup, className)} {...props} />,
  input: ({ className, ...props }) => (
    <input className={cn(format.checkbox, className)} {...props} />
  ),
  section: ({ className, ...props }) => (
    <section className={cn('data-footnotes' in props && format.footnotes, className)} {...props} />
  ),
  table: ({ className, ...props }) => <Table className={cn(format.table, className)} {...props} />,
  th: ({ className, ...props }) => (
    <th scope="col" className={cn(format.th, className)} {...props} />
  ),
  td: ({ className, ...props }) => <td className={cn(format.td, className)} {...props} />,
  a: ({ href, className, ...props }) => {
    const isExternal = !!href && !href.startsWith('/') && !href.startsWith('#');

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
  strong: ({ className, ...props }) => (
    <strong className={cn(format.strong, className)} {...props} />
  ),
  img: ({ className, ...props }) => (
    <Img className={cn(format.img, className)} {...(props as ImageProps)} />
  ),
  blockquote: ({ className, ...props }) => (
    <Blockquote className={cn(format.blockquote, className)} {...props} />
  ),
  Code: (props) => <Code className={format.pre} {...props} />,
  Mermaid: (props) => <Mermaid {...props} />,
  Callout: (props) => <Callout className={format.callout} {...props} />,
};

export default components;
