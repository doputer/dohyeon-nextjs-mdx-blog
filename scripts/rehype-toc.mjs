import { visit } from 'unist-util-visit';

const AvailableDepth = new Set([2, 3]);

const toText = (node) => {
  if (node.type === 'text') return node.value;
  return (node.children ?? []).map(toText).join('');
};

const isFootnotes = (node) => node?.type === 'element' && node.properties?.dataFootnotes;

const program = (body) => ({ type: 'Program', sourceType: 'module', body });
const identifier = (name) => ({ type: 'Identifier', name });
const literal = (value) => ({ type: 'Literal', value, raw: JSON.stringify(value) });

const property = (key, value) => ({
  type: 'Property',
  kind: 'init',
  method: false,
  shorthand: false,
  computed: false,
  key: identifier(key),
  value: literal(value),
});

const object = (value) => ({
  type: 'ObjectExpression',
  properties: Object.entries(value).map(([key, item]) => property(key, item)),
});

const array = (value) => ({ type: 'ArrayExpression', elements: value.map(object) });

const toExport = (name, value) => ({
  type: 'mdxjsEsm',
  value: '',
  data: {
    estree: program([
      {
        type: 'ExportNamedDeclaration',
        specifiers: [],
        declaration: {
          type: 'VariableDeclaration',
          kind: 'const',
          declarations: [{ type: 'VariableDeclarator', id: identifier(name), init: value }],
        },
      },
    ]),
  },
});

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

    tree.children.unshift(toExport('toc', array(toc)));
  };
};

export default rehypeToc;
