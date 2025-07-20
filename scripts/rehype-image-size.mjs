import { readFile } from 'fs/promises';
import path from 'node:path';

import sizeOf from 'image-size';
import { visit } from 'unist-util-visit';

const dir = path.join(process.cwd(), 'public');

const rehypeImageSize = () => {
  return async (tree) => {
    const promises = [];

    visit(tree, 'element', (node) => {
      if (node.tagName !== 'img') return;

      const { src, width, height } = node.properties;

      if (src && !(width && height)) {
        const filePath = path.join(dir, src);

        const promise = (async () => {
          const buffer = await readFile(filePath);

          const dimensions = sizeOf(buffer);

          if (dimensions.width && dimensions.height) {
            node.properties.width = dimensions.width;
            node.properties.height = dimensions.height;
          }
        })();

        promises.push(promise);
      }
    });

    await Promise.all(promises);
  };
};

export default rehypeImageSize;
