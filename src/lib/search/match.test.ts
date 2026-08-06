import { compile, findMatches, findRanges, matches, snippet, tokenize } from '@/lib/search/match';
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

const TITLE = '한국어 검색 엔진';
const BODY = '본문에서 형태소를 다루지 않고 글자 단위로 맞춘다. 검색 품질은 가중치로 조절한다.';

const find = (text: string, token: string) => [...findMatches(text, compile(token))];
const source = (token: string) => compile(token).regex.source;

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

describe('compile — 토큰이 어떤 정규식이 되는가', () => {
  test('마지막 완성 음절은 접두사 문자 클래스 — 종성이 붙는 방향', () => {
    assert.equal(source('한구'), '한[구-귛]');
    assert.equal(source('아이언매'), '아이언[매-맿]');
  });

  test('겹모음·겹받침도 구성 자모 순서대로 자란다 — 클래스가 그만큼 넓다', () => {
    assert.match(source('고'), /^\[고/, "'고'는 과·괘·괴까지 받는 범위로 열린다");
    assert.equal(matches('과자', ['고']), true, 'ㅗ → ㅗㅏ');
    assert.equal(matches('괴물', ['고']), true, 'ㅗ → ㅗㅣ');
    assert.equal(matches('값', ['갑']), true, 'ㅂ → ㅂㅅ');
    assert.equal(matches('값', ['가']), true, '종성이 아직 없는 상태');
  });

  test('접두사 후보가 이어지지 않으면 구간을 나눠 담는다 — ㄲ이 ㄱ과 ㄱㅅ 사이에 끼므로', () => {
    assert.equal(source('각'), '(?:[각갃]|가[ㄱ가-깋])');
  });

  test('초성 자모는 위치와 무관하게 초성 문자 클래스', () => {
    assert.equal(source('ㄱㅅ'), '[ㄱ가-깋][ㅅ사-싷]');
    assert.equal(source('ㄱ색어'), '[ㄱ가-깋]색[어-엏]');
  });

  test('종성이 있는 마지막 글자는 넘어간 해석을 alternation 으로 함께 담는다', () => {
    assert.equal(source('늚'), '(?:늚|늘[ㅁ마-밓])');
    assert.equal(source('국'), '(?:[국굯]|구[ㄱ가-깋])');
    assert.equal(source('값'), '(?:값|갑[ㅅ사-싷])');
  });

  test('초성으로 쓰이지 않는 자모와 그 밖의 글자는 그대로', () => {
    assert.equal(source('ㅏㅑ'), 'ㅏㅑ', '모음은 초성 순번이 없다');
    assert.equal(source('abc'), 'abc');
  });

  test('정규식 문법 글자는 이스케이프한다', () => {
    assert.equal(source('c++'), 'c\\+\\+');
    assert.equal(matches('a.b 표기', ['a.b']), true);
    assert.equal(matches('axb 표기', ['a.b']), false, "'.'이 아무 글자나 받으면 안 된다");
  });
});

describe('findMatches', () => {
  test('겹치지 않게 전부 찾는다', () => {
    assert.deepEqual(find('한국어 한국', '한국'), [
      { index: 0, length: 2, kind: 'exact' },
      { index: 4, length: 2, kind: 'exact' },
    ]);
  });

  test('느슨하게 맞은 자리는 partial 로 표시한다', () => {
    assert.deepEqual(find('한국', '한구'), [{ index: 0, length: 2, kind: 'partial' }]);
  });

  test('글자가 결과적으로 똑같으면 느슨한 경로로 왔어도 exact', () => {
    assert.deepEqual(find('한국', '한국'), [{ index: 0, length: 2, kind: 'exact' }]);
  });

  test('자모는 초성으로 맞고, 글자 그대로도 맞는다', () => {
    assert.deepEqual(
      find('검색 엔진', 'ㄱㅅ'),
      [{ index: 0, length: 2, kind: 'partial' }],
      '초성 일치'
    );
    assert.deepEqual(
      find('ㄱㅅ 표기', 'ㄱㅅ'),
      [{ index: 0, length: 2, kind: 'exact' }],
      '자모 그 자체'
    );
  });

  test('자모 뒤에 완성 음절이 와도 자리를 놓치지 않는다', () => {
    assert.deepEqual(find('검색어', 'ㄱ색어'), [{ index: 0, length: 3, kind: 'partial' }]);
    assert.deepEqual(find('가나다 검색어', 'ㄱ색어'), [{ index: 4, length: 3, kind: 'partial' }]);
  });

  test('종성은 다음 글자 초성으로도 맞는다 — 글자 하나를 더 먹는다', () => {
    assert.deepEqual(find('구경', '국'), [{ index: 0, length: 2, kind: 'partial' }], '단일 종성');
    assert.deepEqual(find('늘면', '늚'), [{ index: 0, length: 2, kind: 'partial' }], '겹종성 ㄹㅁ');
    assert.deepEqual(
      find('갑상선', '값'),
      [{ index: 0, length: 2, kind: 'partial' }],
      '겹종성 ㅂㅅ'
    );
    assert.deepEqual(find('까꾸', '깎'), [{ index: 0, length: 2, kind: 'partial' }], '쌍자음 종성');
  });

  test('넘기지 않은 해석도 그대로 살아 있다', () => {
    assert.deepEqual(find('국밥', '국'), [{ index: 0, length: 1, kind: 'exact' }]);
    assert.deepEqual(find('늚', '늚'), [{ index: 0, length: 1, kind: 'exact' }]);
  });

  test('넘긴 자음의 초성이 다르면 안 맞는다', () => {
    assert.deepEqual(find('늘다', '늚'), [], "'다'의 초성은 ㄷ");
    assert.deepEqual(find('구름', '국'), [], "'름'의 초성은 ㄹ");
  });

  test('앞이 맞아도 뒷글자가 틀리면 그 자리는 버린다', () => {
    assert.deepEqual(find('검색대상', '검색어'), []);
  });

  test('빈 토큰은 아무것도 내지 않는다', () => {
    assert.deepEqual(find('한국어', ''), []);
  });

  test('토큰이 텍스트보다 길면 빈 결과', () => {
    assert.deepEqual(find('한', '한국'), []);
    assert.deepEqual(find('a', 'abc'), []);
    assert.deepEqual(find('한국어 검', '검색'), [], '텍스트 끝에 앞글자만 걸린 경우');
  });

  test('영문도 같은 결과를 낸다', () => {
    assert.deepEqual(find('abcabc', 'abc'), [
      { index: 0, length: 3, kind: 'exact' },
      { index: 3, length: 3, kind: 'exact' },
    ]);
  });

  test('같은 패턴을 다른 텍스트에 다시 써도 상태가 남지 않는다 — lastIndex 초기화', () => {
    const pattern = compile('검색');

    assert.equal([...findMatches('검색 문서', pattern)].length, 1);
    assert.equal([...findMatches('검색 문서', pattern)].length, 1, '두 번째 순회도 같은 결과');

    for (const first of findMatches('검색 검색', pattern)) {
      void first;
      break; // 순회를 중간에 버려도
    }

    assert.equal([...findMatches('검색 문서', pattern)].length, 1, '다음 순회는 처음부터');
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

  test('matches 도 넘어간 종성을 받는다', () => {
    assert.equal(matches('갑상선 가격', ['값']), true);
    assert.equal(matches('갑상선 가격', ['갔']), false, '넘긴 초성이 ㅅ 이 아니다');
  });

  test('findRanges 는 매치가 먹은 길이만큼 구간을 낸다', () => {
    assert.deepEqual(findRanges('한국어 검색', ['검색']), [[4, 6]]);
    assert.deepEqual(
      findRanges('한국어 검색', ['한구']),
      [[0, 2]],
      '느슨하게 맞은 구간도 같은 길이'
    );
    assert.deepEqual(findRanges('한국어 검색', ['없음']), []);
    assert.deepEqual(findRanges('한국어 검색', ['ㄱㅅ']), [[4, 6]], '초성 일치도 같은 길이');
    assert.deepEqual(
      findRanges('늘면 줄면', ['늚']),
      [[0, 2]],
      '종성이 넘어간 해석은 토큰보다 한 글자 넓다'
    );
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
