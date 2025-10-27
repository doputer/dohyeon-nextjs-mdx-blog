import { valueToEstree } from 'estree-util-value-to-estree';
import GithubSlugger from 'github-slugger';
import { visit } from 'unist-util-visit';

const slugs = new GithubSlugger();
const AvailableDepth = new Set([2, 3]);

const remarkToc = () => {
  return (tree) => {
    const toc = [];

    visit(tree, 'heading', (node) => {
      if (!AvailableDepth.has(node.depth)) return;

      slugs.reset();

      const text = node.children
        .filter((child) => child.type === 'text')
        .map((child) => child.value)
        .join('');
      const id = slugs.slug(text);
      const depth = node.depth;

      toc.push({ id, text, depth });
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

export default remarkToc;
