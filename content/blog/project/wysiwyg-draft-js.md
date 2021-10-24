---
title: 'WYSIWYG 에디터 draft.js의 기록 👀'
date: 2021-09-03
category: '프로젝트'
tags: ['ReactJS', 'WYSIWYG']
draft: false
---

## 위지윅(WYSIWYG)이란?

> 위지위그(WYSIWYG: What You See Is What You Get, "보는 대로 얻는다")는 문서 편집 과정에서 화면에 포맷된 낱말, 문장이 출력물과 동일하게 나오는 방식을 말한다.

쉽게 말해서 우리가 티스토리에서 글쓰기를 눌렀을 때 나오는 에디터가 WYSIWYG 에디터이다.

![tistory-editor](images/tistory-editor.png)

HTML `<textarea>` 태그에서 bold, italic 등을 적용할 수 있고, 적용되자마자 보인다고 생각하면 편하다.

## 위지윅 에디터를 이용하기에 앞서

처음 개발 프로젝트에서 위지윅 에디터가 필요해서 직접 구현하려고 했다. 보통 웹에서 에디터를 개발할 때는 [contentEditable](https://developer.mozilla.org/ko/docs/Web/HTML/Global_attributes/contenteditable)과 [document.execCommand()](https://developer.mozilla.org/ko/docs/Web/API/Document/execCommand)를 이용한다.

```html
<div contenteditable="true"></div>
<!-- <div> 태그를 <textarea> 태그처럼 사용할 수 있게 해준다. -->
```

```js
document.execCommand('bold')
/* 선택영역(텍스트를 드래그 한 영역)의 양쪽에 <b> 태그 혹은 <strong> 태그를 삽입한다. */
```

그런데 contentEditable은 표준이 아니기 때문에 브라우저마다 다르게 동작한다. 예를 들어 브라우저마다 bold를 표시할 때 `<b>` 태그를 사용하기도 하고, `<strong>` 태그를 사용하기도 한다. 그뿐만 아니라 줄 바꿈 또한 `<br>`와 `<div>`를 사용하는 등 마찬가지이다. 심지어 document.execCommand()의 명령어 동작도 브라우저마다 다르다고 한다.

그리고 document.execCommand()의 동작 방식은 선택영역의 양쪽에 태그를 삽입하는 식이기 때문에 아래와 같은 불상사가 발생했을 때 대처하기 힘들다. 태그끼리 꼬이는 현상이다.

```html
가나<b>다<i>라</b>마</i>사아자카타파하
```

물론 이런 부분들을 직접 해결할 수 있었지만, 시간적인 제약도 있고, 요즘에는 잘 구현되어있는 WYSIWYG 에디터들이 많아서 이것 중에 하나를 이용하기로 했다.

- Quill
- Draft.js
- Summernote
- TinyMCE

이 포스팅에서는 각 에디터를 비교하지 않기로 한다. 직접 조금씩 사용해본 결과 **Draft.js**가 가장 마음에 들어서 활용해보기로 했다.

## 직접 이용한 Draft.js

![draft-js](images/draft-js.gif)

[문서](https://draftjs.org/)도 잘 되어있고, 막히는 부분은 개발 커뮤니티를 통해서 충분히 해결 가능했다. 블록 스타일과 선택 영역 스타일을 제공하는데, 기본적으로 블록 스타일에서는 `<h1>~<h6>` , `<ul>` , `<ol>` , `<blockquote>` , `<code>` 등을 제공하고, 선택 영역 스타일에서는 **bold**, _italic_, <u>underline</u>, <del>strikethrough</del> 를 제공한다. 나는 추가적 text-align이 필요했기 때문에 커스텀 블록 스타일로 left, center, right를 추가했다. 필요에 따라서 첨부 파일, 링크, 주석, 테이블 스타일을 추가할 수 있다. 문서화가 잘 되어있기 때문에 손쉽게 추가할 수 있다.

작성한 내용을 추출하거나(html 혹은 markdown), 추출된 내용을 다시 에디터로 불러오는 부분은 외부 패키지를 이용하면 된다. 나는 [draftjs-to-html](https://www.npmjs.com/package/draftjs-to-html)과 [html-to-draftjs](https://www.npmjs.com/package/html-to-draftjs)를 이용해서 추출한 내용을 DB에 저장하고, 불러왔다.

## 소스코드

개발 스택은 React, TypeScript이다.

[https://github.com/doputer/draft-react-ts](https://github.com/doputer/draft-react-ts)
