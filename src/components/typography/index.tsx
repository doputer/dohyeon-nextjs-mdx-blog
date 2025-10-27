import type { ImageProps } from 'next/image';

import Blockquote from '@/components/typography/blockquote';
import Callout from '@/components/typography/callout';
import Code from '@/components/typography/code';
import * as format from '@/components/typography/format';
import Img from '@/components/typography/img';
import Table from '@/components/typography/table';

import type { MDXComponents } from 'mdx/types';

const components: MDXComponents = {
  h2: (props) => <h2 className={format.h2} {...props} />,
  h3: (props) => <h3 className={format.h3} {...props} />,
  h4: (props) => <h4 className={format.h4} {...props} />,
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
  Callout: (props) => <Callout className={format.blockquote} {...props} />,
  Code: (props) => <Code className={format.pre} {...props} />,
};

export default components;
