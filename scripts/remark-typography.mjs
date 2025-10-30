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
    });
  };
};

// :::containerDirective / ::leafDirective / :textDirective
const callout = (node) => {
  if (node.type !== 'containerDirective') return;
  if (node.name !== 'callout') return;

  const data = node.data || (node.data = {});
  const props = node.attributes || {};

  data.hName = 'Callout';
  data.hProperties = props;
};

export default remarkTypography;
