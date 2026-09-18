import { valueToEstree } from 'estree-util-value-to-estree';
import { visit } from 'unist-util-visit';

const AvailableDepth = new Set([2, 3]);

const toText = (node) => {
  if (node.type === 'text') return node.value;
  return (node.children ?? []).map(toText).join('');
};

const isFootnotes = (node) => node?.type === 'element' && node.properties?.dataFootnotes;

const rehypeToc = () => {
  return (tree) => {
    const toc = [];

    visit(tree, 'element', (node, _index, parent) => {
      const match = /^h(\d)$/.exec(node.tagName);
      if (!match) return;

      const depth = Number(match[1]);

      if (!AvailableDepth.has(depth)) return;
      if (isFootnotes(parent)) return;

      toc.push({ id: node.properties.id, text: toText(node), depth });
    });

    tree.children.unshift({
      type: 'mdxjsEsm',
      value: '',
      data: {
        estree: {
          type: 'Program',
          sourceType: 'module',
          body: [
            {
              type: 'ExportNamedDeclaration',
              specifiers: [],
              declaration: {
                type: 'VariableDeclaration',
                kind: 'const',
                declarations: [
                  {
                    type: 'VariableDeclarator',
                    id: { type: 'Identifier', name: 'toc' },
                    init: valueToEstree(toc, { preserveReferences: true }),
                  },
                ],
              },
            },
          ],
        },
      },
    });
  };
};

export default rehypeToc;
