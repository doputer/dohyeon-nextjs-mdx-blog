import { readFile } from 'fs/promises';
import path from 'path';

import { getPosts } from '@/lib/MDX';
import type { SearchDocument } from '@/lib/search/types';

const CONTENTS_DIR = path.join(process.cwd(), 'contents');

const toComposed = (value: string) => value.normalize('NFC');

const toPlainText = (mdx: string) =>
  mdx
    .replace(/^---\r?\n[\s\S]*?\r?\n---/, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/^import\s.*$/gm, ' ')
    .replace(/^\s*:::.*$/gm, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<\/?[A-Za-z][^>]*>/g, ' ')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/^\s{0,3}#{1,6}\s+/gm, ' ')
    .replace(/^\s{0,3}>\s?/gm, ' ')
    .replace(/^\s{0,3}([-*+]|\d+\.)\s+/gm, ' ')
    .replace(/[|*_~]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const getSearchDocuments = async (): Promise<SearchDocument[]> => {
  const posts = await getPosts();

  return Promise.all(
    posts.map(async ({ frontmatter, toc, slug }) => {
      const source = await readFile(path.join(CONTENTS_DIR, slug, 'index.mdx'), 'utf-8');

      return {
        slug,
        title: toComposed(frontmatter.title),
        description: toComposed(frontmatter.description),
        date: new Date(frontmatter.date).toISOString(),
        headings: toc.map(({ text }) => toComposed(text)),
        body: toPlainText(toComposed(source)),
      };
    })
  );
};
