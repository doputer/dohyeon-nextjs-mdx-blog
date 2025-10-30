/**
 * @import {} from 'mdast-util-directive'
 * @import {} from 'mdast-util-to-hast'
 * @import {Root} from 'mdast'
 */

import { visit } from 'unist-util-visit';

const remarkTypography = () => {
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  return (tree) => {
    visit(tree, (node) => {
      callout(node);
      mermaid(node);
    });
  };
};

/**
 * :::containerDirective
 * ::leafDirective
 * :textDirective
 */

const callout = (node) => {
  if (node.type !== 'containerDirective') return;
  if (node.name !== 'callout') return;

  const data = node.data || (node.data = {});
  const props = node.attributes || {};

  data.hName = 'Callout';
  data.hProperties = props;
};

const mermaid = (node) => {
  if (node.type !== 'containerDirective') return;
  if (node.name !== 'mermaid') return;

  const data = node.data || (node.data = {});
  const props = node.attributes || {};
  const code = node.children?.map((child) => child?.children?.[0].value || '').join('\n');

  data.hName = 'Mermaid';
  data.hProperties = { ...props, code };
};

export default remarkTypography;
