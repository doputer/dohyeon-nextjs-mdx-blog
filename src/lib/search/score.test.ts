import type { SearchDocument } from '@/lib/search/types';

import { prepare, search } from '@/lib/search/score';
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

const DOCS: SearchDocument[] = [
  {
    slug: 'hangul',
    title: '한국어 검색 엔진',
    description: '조합 중인 글자도 받는다',
    date: '2026-03-01T00:00:00.000Z',
    headings: ['자모 분해', '접두사 매칭'],
    body: '본문에서 형태소를 다루지 않고 글자 단위로 맞춘다. 검색 품질은 가중치로 조절한다.',
  },
  {
    slug: 'typescript',
    title: 'TypeScript 타입 좁히기',
    description: '제어 흐름 분석',
    date: '2026-01-15T00:00:00.000Z',
    headings: ['판별 유니온'],
    body: 'TypeScript 컴파일러는 제어 흐름으로 타입을 좁힌다. 검색 대상 본문이다.',
  },
];

const index = () => prepare(DOCS);
const slugs = (results: ReturnType<typeof search>) => results.map(({ document }) => document.slug);

describe('prepare', () => {
  test('FIELDS 순서대로 제목·헤딩·본문 세 개를 만든다', () => {
    const [{ fields }] = index();

    assert.deepEqual(
      fields.map(({ weight }) => weight),
      [10, 3, 1]
    );
  });

  test('소문자화해 둔다 — 런타임에서 다시 하지 않도록', () => {
    const [, { fields }] = index();

    assert.equal(fields[0].lower, 'typescript 타입 좁히기');
  });

  test('헤딩은 줄바꿈으로 이어 붙인다 — 항목이 섞이지 않게', () => {
    const [{ fields }] = index();

    assert.equal(fields[1].lower, '자모 분해\n접두사 매칭');
  });
});

describe('search', () => {
  test('제목 단어 시작 정확 일치가 만점 — weight 10 × 2.5', () => {
    const results = search(index(), ['한국'], 8);

    assert.deepEqual(slugs(results), ['hangul']);
    assert.equal(results[0].score, 25);
  });

  test('단어 중간이면 배수가 낮다 — 10 × 1.5', () => {
    assert.equal(search(index(), ['국어'], 8)[0].score, 15);
  });

  test('느슨하게 맞으면 배수가 낮다 — 10 × 1.5', () => {
    assert.equal(search(index(), ['한구'], 8)[0].score, 15);
  });

  test('헤딩은 weight 3, 본문은 weight 1', () => {
    assert.equal(search(index(), ['자모'], 8)[0].score, 7.5);
    assert.equal(search(index(), ['형태소'], 8)[0].score, 2.5);
  });

  test('필드 중 최고점만 센다 — 같은 토큰이 제목과 본문에 다 있어도', () => {
    const results = search(index(), ['검색'], 8);

    assert.deepEqual(slugs(results), ['hangul', 'typescript']);
    assert.equal(results[0].score, 25, '제목에서 맞은 점수');
    assert.equal(results[1].score, 2.5, '본문에서만 맞은 점수');
  });

  test('토큰 하나라도 못 맞으면 탈락한다 (AND)', () => {
    assert.deepEqual(slugs(search(index(), ['한국', '타입'], 8)), []);
    assert.deepEqual(slugs(search(index(), ['검색', '타입'], 8)), ['typescript']);
  });

  test('토큰별 최고점을 더한다', () => {
    assert.equal(search(index(), ['한국', '자모'], 8)[0].score, 32.5, '25 + 7.5');
  });

  test('동점이면 최신 글이 먼저', () => {
    const results = search(index(), ['본문'], 8);

    assert.deepEqual(
      results.map(({ score }) => score),
      [2.5, 2.5]
    );
    assert.deepEqual(slugs(results), ['hangul', 'typescript'], '2026-03 이 2026-01 보다 먼저');
  });

  test('limit 으로 자른다', () => {
    assert.equal(search(index(), ['검색'], 1).length, 1);
  });

  test('토큰이 없으면 빈 결과', () => {
    assert.deepEqual(search(index(), [], 8), []);
  });

  test('자모 쿼리는 어느 필드에서도 초성으로 맞지 않는다', () => {
    assert.deepEqual(slugs(search(index(), ['ㄱㅅ'], 8)), []);
    assert.deepEqual(slugs(search(index(), ['ㅈㅁ'], 8)), [], "헤딩의 '자모'도 안 맞는다");
  });
});
