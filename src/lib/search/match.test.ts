import {
  compile,
  findMatches,
  findRanges,
  matches,
  snippet,
  toCharTest,
  tokenize,
} from '@/lib/search/match';
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

const code = (character: string) => character.charCodeAt(0);

const TITLE = '한국어 검색 엔진';
const BODY = '본문에서 형태소를 다루지 않고 글자 단위로 맞춘다. 검색 품질은 가중치로 조절한다.';

const find = (text: string, token: string) => [...findMatches(text, compile(token))];

describe('tokenize', () => {
  test('공백으로 자르고 빈 토큰은 버린다', () => {
    assert.deepEqual(tokenize('  한국   검색 '), ['한국', '검색']);
    assert.deepEqual(tokenize(''), []);
    assert.deepEqual(tokenize('   '), []);
  });

  test('공백은 종류를 가리지 않는다 — 붙여넣기와 한글 입력기가 흘리는 것들', () => {
    assert.deepEqual(tokenize('한국\t검색'), ['한국', '검색'], '탭');
    assert.deepEqual(tokenize('한국\n검색'), ['한국', '검색'], '줄바꿈');
    assert.deepEqual(tokenize('한국　검색'), ['한국', '검색'], '전각 공백 U+3000');
  });

  test('소문자화한다 — 인덱스도 소문자로 맞춰 두므로', () => {
    assert.deepEqual(tokenize('TypeScript'), ['typescript']);
  });

  test('NFC 로 정규화한다 — 인덱스가 조합형이라 자모가 흩어지면 안 맞는다', () => {
    // 'ㅎ' + 'ㅏ' + 'ㄴ' 분해형(NFD)이 '한' 한 글자로 합쳐져야 한다.
    assert.deepEqual(tokenize('한'), ['한']);
  });
});

describe('toCharTest', () => {
  test('마지막이 아닌 완성 음절은 그 글자만 그대로 받는다', () => {
    const { exact, test: accepts } = toCharTest('한국', 0);

    assert.equal(exact, true);
    assert.equal(accepts(code('한')), true);
    assert.equal(accepts(code('하')), false);
  });

  test('마지막 완성 음절은 접두사로 느슨하게 받는다 — 종성이 붙는 방향', () => {
    const { exact, test: accepts } = toCharTest('한구', 1);

    assert.equal(exact, false);
    assert.equal(accepts(code('구')), true, '자기 자신');
    assert.equal(accepts(code('국')), true, "'구'는 '국'의 조합 중 상태");
    assert.equal(accepts(code('가')), false, '중성이 다르다');
    assert.equal(accepts(code('과')), false, "'ㅜ'에서 'ㅗㅏ'로는 자라지 않는다");
  });

  test('겹모음·겹받침도 구성 자모 순서대로 자란다', () => {
    assert.equal(toCharTest('고', 0).test(code('과')), true, 'ㅗ → ㅗㅏ');
    assert.equal(toCharTest('갑', 0).test(code('값')), true, 'ㅂ → ㅂㅅ');
    assert.equal(toCharTest('가', 0).test(code('값')), true, '종성이 아직 없는 상태');
  });

  test('자모는 초성이 같은 음절을 받는다', () => {
    const { exact, test: accepts } = toCharTest('ㄱㅅ', 0);

    assert.equal(exact, false);
    assert.equal(accepts(code('ㄱ')), true, '자모 그 자체');
    assert.equal(accepts(code('가')), true, '초성 블록의 처음');
    assert.equal(accepts(code('깋')), true, '초성 블록의 끝');
    assert.equal(accepts(code('나')), false, '초성이 다르다');
  });

  test('초성은 위치를 가리지 않는다 — 마지막이 아닌 자리도 느슨하다', () => {
    const { exact, test: accepts } = toCharTest('ㄱ색', 0);

    assert.equal(exact, false);
    assert.equal(accepts(code('검')), true);
  });

  test('초성으로 쓰이지 않는 자모는 정확 일치', () => {
    const { exact, test: accepts } = toCharTest('ㅏㅑ', 0);

    assert.equal(exact, true, '모음은 초성 순번이 없다');
    assert.equal(accepts(code('ㅏ')), true);
    assert.equal(accepts(code('아')), false);
  });

  test('그 밖의 글자는 정확 일치', () => {
    const { exact, test: accepts } = toCharTest('abc', 1);

    assert.equal(exact, true);
    assert.equal(accepts(code('b')), true);
    assert.equal(accepts(code('c')), false);
  });
});

describe('compile', () => {
  test('anchor 는 앞에서부터 정확 일치만으로 이루어진 구간', () => {
    assert.equal(compile('한국').anchor, '한', '마지막 글자는 느슨하므로 빠진다');
    assert.equal(compile('검색어').anchor, '검색');
    assert.equal(compile('abc').anchor, 'abc', '영문은 전부 정확 일치');
    assert.equal(compile('ㄱㅅ').anchor, '', '자모는 느슨하므로 anchor 가 없다');
  });

  test('느슨한 글자를 만나면 끊는다 — 그 뒤의 정확 일치는 담지 않는다', () => {
    assert.equal(
      compile('ㄱ색어').anchor,
      '',
      "'색'을 담으면 anchor 가 매치 시작보다 뒤를 가리킨다"
    );
    assert.equal(compile('한ㄱ어').anchor, '한', '끊기기 전까지는 담는다');
  });

  test('한 글자 한글 토큰은 anchor 가 없다 — 그 한 글자가 곧 마지막이라', () => {
    assert.equal(compile('한').anchor, '');
    assert.equal(compile('a').anchor, 'a', '영문 한 글자는 느슨할 게 없다');
  });

  test('글자 수만큼 판정 함수를 만든다', () => {
    assert.equal(compile('검색어').tests.length, 3);
  });
});

describe('findMatches', () => {
  test('겹치지 않게 전부 찾는다', () => {
    assert.deepEqual(find('한국어 한국', '한국'), [
      { index: 0, kind: 'exact' },
      { index: 4, kind: 'exact' },
    ]);
  });

  test('느슨하게 맞은 자리는 partial 로 표시한다', () => {
    assert.deepEqual(find('한국', '한구'), [{ index: 0, kind: 'partial' }]);
  });

  test('글자가 결과적으로 똑같으면 느슨한 경로로 왔어도 exact', () => {
    assert.deepEqual(find('한국', '한국'), [{ index: 0, kind: 'exact' }]);
  });

  test('자모는 초성으로 맞고, 글자 그대로도 맞는다', () => {
    assert.deepEqual(find('검색 엔진', 'ㄱㅅ'), [{ index: 0, kind: 'partial' }], '초성 일치');
    assert.deepEqual(find('ㄱㅅ 표기', 'ㄱㅅ'), [{ index: 0, kind: 'exact' }], '자모 그 자체');
  });

  test('자모 뒤에 완성 음절이 와도 자리를 놓치지 않는다 — anchor 가 끊긴 경로', () => {
    assert.deepEqual(find('검색어', 'ㄱ색어'), [{ index: 0, kind: 'partial' }]);
    assert.deepEqual(find('가나다 검색어', 'ㄱ색어'), [{ index: 4, kind: 'partial' }]);
  });

  test('빈 토큰은 아무것도 내지 않는다', () => {
    assert.deepEqual(find('한국어', ''), []);
  });

  test('토큰이 텍스트보다 길면 빈 결과 — 끝을 넘어가는 자리는 시도하지 않는다', () => {
    assert.deepEqual(find('한', '한국'), [], 'anchor 경로');
    assert.deepEqual(find('a', 'abc'), [], 'indexOf 경로');
    assert.deepEqual(find('한국어 검', '검색'), [], '텍스트 끝에 anchor 만 걸린 경우');
  });

  test('영문도 같은 결과를 낸다', () => {
    assert.deepEqual(find('abcabc', 'abc'), [
      { index: 0, kind: 'exact' },
      { index: 3, kind: 'exact' },
    ]);
  });
});

describe('findMatches — anchor 경로가 결과를 바꾸지 않는다', () => {
  const text = '검색어 처리와 검색어 색인';

  test('anchor 로 후보를 좁혀도 위치·kind 가 그대로다', () => {
    assert.deepEqual(find(text, '검색어'), [
      { index: 0, kind: 'exact' },
      { index: 8, kind: 'exact' },
    ]);
  });

  test('anchor 가 없는 한 글자 토큰도 같은 자리를 가리킨다 — 전수 스캔 경로', () => {
    assert.deepEqual(find(text, '검'), [
      { index: 0, kind: 'exact' },
      { index: 8, kind: 'exact' },
    ]);
  });

  test('anchor 가 맞아도 뒷글자가 틀리면 그 자리는 버린다', () => {
    assert.deepEqual(find('검색대상', '검색어'), []);
  });

  test('anchor 가 토큰 전체면 indexOf 만으로 끝난다 — 결과는 동일', () => {
    assert.deepEqual(find('abcabc', 'abc'), [
      { index: 0, kind: 'exact' },
      { index: 3, kind: 'exact' },
    ]);
  });
});

describe('matches · findRanges', () => {
  test('matches 는 모든 토큰이 있는지만 본다', () => {
    assert.equal(matches('접두사 매칭', ['접두', '매칭']), true);
    assert.equal(matches('접두사 매칭', ['접두사']), true);
    assert.equal(matches('접두사 매칭', ['접두', '없음']), false, 'AND');
    assert.equal(matches('접두사 매칭', ['ㅈㄷ']), true, '초성으로도 맞는다');
    assert.equal(matches('접두사 매칭', ['ㄷㅈ']), false, '초성 순서가 다르면 안 맞는다');
  });

  test('matches 도 조합 중 글자는 받는다', () => {
    assert.equal(matches('접두사 매칭', ['매']), true, "'매'가 '매칭'의 첫 글자");
    assert.equal(matches('접두사 매칭', ['매치']), true, "'치'는 '칭'의 조합 중 상태");
    assert.equal(matches('접두사 매칭', ['매타']), false, '중성·초성이 다르면 안 받는다');
  });

  test('findRanges 는 매치 길이가 토큰 길이와 같다는 성질을 쓴다', () => {
    assert.deepEqual(findRanges('한국어 검색', ['검색']), [[4, 6]]);
    assert.deepEqual(
      findRanges('한국어 검색', ['한구']),
      [[0, 2]],
      '느슨하게 맞은 구간도 같은 길이'
    );
    assert.deepEqual(findRanges('한국어 검색', ['없음']), []);
    assert.deepEqual(findRanges('한국어 검색', ['ㄱㅅ']), [[4, 6]], '초성 일치도 같은 길이');
  });

  test('겹치거나 붙은 구간은 하나로 합친다', () => {
    assert.deepEqual(findRanges('한국어 검색', ['한', '국']), [[0, 2]]);
  });

  test('여러 토큰의 구간을 위치 순서로 정렬해 낸다', () => {
    assert.deepEqual(findRanges('한국어 검색', ['검색', '한국']), [
      [0, 2],
      [4, 6],
    ]);
  });
});

describe('snippet', () => {
  test('매치 주변을 잘라 낸다', () => {
    assert.match(snippet(BODY, ['가중치']), /가중치/);
  });

  test('covered 에 이미 드러난 토큰은 기준에서 뺀다', () => {
    // '검색'은 제목에 보이므로, 제목에 없는 '가중치' 쪽으로 잘라야 한다.
    assert.match(snippet(BODY, ['검색', '가중치'], TITLE), /가중치/);
  });

  test('covered 가 토큰을 다 덮으면 어쩔 수 없이 전부를 기준으로 삼는다', () => {
    assert.match(snippet(BODY, ['검색'], TITLE), /검색/);
  });

  test('초성으로도 자리를 잡는다', () => {
    assert.match(snippet(BODY, ['ㄱㅈㅊ']), /가중치/);
  });

  test('잡을 자리가 없으면 빈 문자열 — 호출부가 설명글로 되돌린다', () => {
    assert.equal(snippet(BODY, ['없는토큰']), '');
    assert.equal(snippet(BODY, ['ㅋㅋㅋ']), '', '초성이 이어지는 자리가 없다');
  });

  test('radius 로 잘라낼 폭을 정하고, 잘린 쪽에 말줄임을 붙인다', () => {
    const excerpt = snippet(BODY, ['가중치'], '', 5);

    assert.match(excerpt, /^…/);
    assert.match(excerpt, /…$/);
    assert.ok(excerpt.length < 20, `너무 길다: ${excerpt}`);
  });
});
