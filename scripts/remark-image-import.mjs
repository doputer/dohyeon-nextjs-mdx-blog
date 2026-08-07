import { visit } from 'unist-util-visit';

const isRelative = (url) => !/^([a-z][a-z\d+\-.]*:|\/\/|\/|#)/i.test(url);
const toSpecifier = (url) => (url.startsWith('.') ? url : `./${url}`);

const program = (body) => ({ type: 'Program', sourceType: 'module', body });
const identifier = (name) => ({ type: 'Identifier', name });
const literal = (value) => ({ type: 'Literal', value, raw: JSON.stringify(value) });

const toImport = (name, source) => ({
  type: 'mdxjsEsm',
  value: `import ${name} from ${JSON.stringify(source)}`,
  data: {
    estree: program([
      {
        type: 'ImportDeclaration',
        specifiers: [{ type: 'ImportDefaultSpecifier', local: identifier(name) }],
        source: literal(source),
        attributes: [],
      },
    ]),
  },
});

const toSource = (name) => ({
  type: 'mdxJsxAttributeValueExpression',
  value: name,
  data: { estree: program([{ type: 'ExpressionStatement', expression: identifier(name) }]) },
});

const toAttributes = (name, node) => [
  { type: 'mdxJsxAttribute', name: 'src', value: toSource(name) },
  { type: 'mdxJsxAttribute', name: 'alt', value: node.alt ?? '' },
  ...(node.title ? [{ type: 'mdxJsxAttribute', name: 'title', value: node.title }] : []),
];

const remarkImageImport = () => {
  return (tree) => {
    const imports = [];

    const toElement = (type, node) => {
      const name = `_image${imports.length}`;

      imports.push(toImport(name, toSpecifier(node.url)));

      return { type, name: 'img', attributes: toAttributes(name, node), children: [] };
    };

    visit(tree, 'paragraph', (node, index, parent) => {
      if (node.children.length !== 1) return;

      const [image] = node.children;

      if (image.type !== 'image' || !isRelative(image.url)) return;

      parent.children[index] = toElement('mdxJsxFlowElement', image);
    });

    visit(tree, 'image', (node, index, parent) => {
      if (!isRelative(node.url)) return;

      parent.children[index] = toElement('mdxJsxTextElement', node);
    });

    tree.children.unshift(...imports);
  };
};

export default remarkImageImport;
