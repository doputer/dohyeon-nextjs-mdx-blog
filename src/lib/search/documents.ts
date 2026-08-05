import type { SearchDocument } from '@/lib/search/types';

import { getPosts } from '@/lib/MDX';
import { readFile } from 'fs/promises';
import path from 'path';

const CONTENTS_DIR = path.join(process.cwd(), 'contents');

/** 초성 치환과 부분 일치가 성립하려면 인덱스 전체가 NFC 조합형이어야 한다. */
const nfc = (value: string) => value.normalize('NFC');

/**
 * MDX 원문에서 검색 대상 평문만 남긴다.
 * 코드 블록은 제외한다 — 토큰이 흔해서 매칭 잡음만 늘리고 인덱스도 커진다.
 */
const toPlainText = (mdx: string) =>
  mdx
    .replace(/^---\r?\n[\s\S]*?\r?\n---/, ' ') // 프론트매터
    .replace(/```[\s\S]*?```/g, ' ') // 코드 블록
    .replace(/^import\s.*$/gm, ' ') // 컴포넌트 import 문
    .replace(/^\s*:::.*$/gm, ' ') // remark-directive 울타리 (내용은 남긴다)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // 이미지
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // 링크 → 텍스트만
    .replace(/<\/?[A-Za-z][^>]*>/g, ' ') // JSX·HTML 태그
    .replace(/`([^`]*)`/g, '$1') // 인라인 코드
    .replace(/^\s{0,3}#{1,6}\s+/gm, ' ') // 헤딩 마커
    .replace(/^\s{0,3}>\s?/gm, ' ') // 인용
    .replace(/^\s{0,3}([-*+]|\d+\.)\s+/gm, ' ') // 리스트 마커
    .replace(/[|*_~]/g, ' ') // 강조·표 구분자
    .replace(/\s+/g, ' ')
    .trim();

export const getSearchDocuments = async (): Promise<SearchDocument[]> => {
  const posts = await getPosts();

  return Promise.all(
    posts.map(async ({ frontmatter, toc, slug }) => {
      const raw = await readFile(path.join(CONTENTS_DIR, slug, 'index.mdx'), 'utf-8');

      return {
        slug,
        title: nfc(frontmatter.title),
        description: nfc(frontmatter.description),
        tags: frontmatter.tags.map(nfc),
        date: new Date(frontmatter.date).toISOString(),
        headings: toc.map(({ text }) => nfc(text)),
        body: toPlainText(nfc(raw)),
      };
    })
  );
};
