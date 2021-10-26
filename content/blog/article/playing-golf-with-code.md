---
title: '코드로 골프하기 ⛳'
date: 2020-10-08
category: '아티클'
tags: ['Golf']
draft: false
---

## Code golf란

Golf scripting이라고도 부른다. 알고리즘이 주어졌을 때 가장 짧은 코드로 구현하는 방법이다. 이름은 가장 낮은 점수를 획득해야 하는 골프와 비슷하다고 하여 지어졌다. 숏 코딩이라고도 부르는데 대부분 실용적으로 사용하지는 않고, 알고리즘의 이해나 재미로 해보는 경우가 많다.

## 골프 쳐보기

C 언어에서 두 정수의 값을 입력받아서 합을 출력하는 코드는 다음과 같다.

```c
#include <stdio.h>

int main()
{
	int a, b;

	scanf("%d%d", &a, &b);
	printf("%d", a + b);

	return 0;
}
```

116byte

이제 이 코드를 가지고 골프를 쳐보자. 표준처럼 main 함수를 int main()으로 정의했는데 사실 main()으로만 정의해도 동작한다. K&R이라고도 하는 옛날 코딩 스타일이다. 그리고 return 0; 부분도 생략할 수 있다.

```c
#include <stdio.h>

main()
{
	int a, b;

	scanf("%d%d", &a, &b);
	printf("%d", a + b);
}
```

97byte

`#include <stdio.h>` 부분도 지울 수 있다. 컴파일 과정 중 링커가 C 라이브러리를 링크하기 때문이다. 아마 gcc에서만 되는 것 같다.

```c
main()
{
    int a, b;

    scanf("%d%d", &a, &b);
    printf("%d", a + b);
}
```

77byte

main 함수는 두 인수를 받는 함수이다. main(int argc, char \*argv\[\])와 같은 꼴을 본 적이 있을 것이다. 이 코드에서 선언한 변수도 두 개이기 때문에 이를 활용해 지운다.

```c
main(a, b)
{
    scanf("%d%d", &a, &b);
    printf("%d", a + b);
}
```

66byte

이제 가독성을 위해 사용한 공백과, 개행을 지운다.

```c
main(a,b){scanf("%d%d",&a,&b);printf("%d",a+b);}
```

48byte

숏 코딩을 마쳤더니 116byte에서 48byte로 줄었다.

## 정리

간단한 문제를 예로 들었는데 다른 문제에는 더 많은 방법을 적용시킬 수 있다. 나름 프로그래밍을 하는 옛날 기법들도 알게 되고, 어두운 면도 알 수 있게 된다.

가독성, 표준, 유지보수를 포기하면 재미를 얻을 수 있다!

## 출처

[https://www.acmicpc.net/blog/view/11](https://www.acmicpc.net/blog/view/11)