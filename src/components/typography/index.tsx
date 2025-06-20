import type { ImageProps } from 'next/image';

import type { MDXComponents } from 'mdx/types';

import Callout from '@/components/Typography/Callout';
import Code from '@/components/Typography/Code';
import * as Format from '@/components/Typography/format';
import Img from '@/components/Typography/Img';

const components: MDXComponents = {
  h2: (props) => <h2 className={Format.h2} {...props} />,
  h3: (props) => <h3 className={Format.h3} {...props} />,
  blockquote: (props) => <blockquote className={Format.blockquote} {...props} />,
  code: (props) => <code className={Format.code} {...props} />,
  ol: (props) => <ol className={Format.ol} {...props} />,
  ul: (props) => <ul className={Format.ul} {...props} />,
  p: (props) => <p className={Format.p} {...props} />,
  table: (props) => <table className={Format.table} {...props} />,
  th: (props) => <th className={Format.th} {...props} />,
  td: (props) => <td className={Format.td} {...props} />,
  a: (props) => <a className={Format.a} target="_blank" {...props} />,
  strong: (props) => <strong className={Format.strong} {...props} />,

  img: (props) => <Img className={Format.img} {...(props as ImageProps)} />,
  Callout: (props) => <Callout className={Format.blockquote} {...props} />,
  Code: (props) => <Code {...props} />,
};

export default components;
