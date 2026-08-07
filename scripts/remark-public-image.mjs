import { visit } from 'unist-util-visit';

const isAbsolute = (url) => /^([a-z][a-z\d+\-.]*:|\/\/|\/)/i.test(url);

const remarkPublicImage = () => {
  return (tree, file) => {
    const path = file.history.at(0).split(/[/\\]/).at(-2);

    visit(tree, 'image', (node) => {
      if (isAbsolute(node.url)) return;

      node.url = `/images/${path}/${node.url}`;
    });
  };
};

export default remarkPublicImage;
