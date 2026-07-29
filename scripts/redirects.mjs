const pairs = [
  ['42 서울에 지원하며', 'applying-to-42-seoul'],
  ['Color Picker 프로젝트', 'color-picker-project'],
  ['Full Text Search를 활용한 검색 기능 개발기', 'building-search-with-full-text-search'],
  ['GitHub Actions로 AWS S3 배포 자동화 하기', 'automate-aws-s3-deployment-with-github-actions'],
  ['GitHub Actions로 CI/CD 자동화하기', 'automate-ci-cd-with-github-actions'],
  ['GitHub 프로필 꾸미기', 'customize-github-profile'],
  ['ICT 학점연계 프로젝트 인턴십에 지원하며', 'applying-to-ict-internship'],
  ['NestJS에서 FTP 사용하기', 'using-ftp-in-nestjs'],
  ['OAuth 2.0이란?', 'what-is-oauth-2'],
  ['ORM과 Native Query', 'orm-vs-native-query'],
  ['PM2로 서비스 운영하기', 'running-services-with-pm2'],
  ['Snake 게임', 'snake-game'],
  ['Tailwind CSS 사용기', 'using-tailwind-css'],
  ['Victim cache에 관하여', 'about-victim-cache'],
  ['WYSIWYG 에디터 draft.js의 기록', 'draftjs-wysiwyg-editor'],
  ['printf와 scanf에도 반환 값이 있을까?', 'printf-and-scanf-return-values'],
  ['거품 정렬', 'bubble-sort'],
  ['선택 정렬', 'selection-sort'],
  ['선택 정렬과 삽입 정렬 비교', 'selection-sort-vs-insertion-sort'],
  ['시간 복잡도 가시적으로 확인해보기', 'visualizing-time-complexity'],
  ['데몬 프로세스에 대한 이해', 'understanding-daemon-processes'],
  ['검색어 강조 알고리즘 개발기', 'search-term-highlighting-algorithm'],
  ['칵테일 셰이커 정렬', 'cocktail-shaker-sort'],
  ['코드로 골프하기', 'code-golfing'],
  ['마크다운 에디터 제작기', 'building-markdown-editor'],
  ['깃허브에 커밋한 파일들 삭제하기', 'delete-committed-files-on-github'],
  ['구조체와 클래스의 차이', 'struct-vs-class'],
  ['메모이제이션이란?', 'what-is-memoization'],
];

const slugify = (slug) => slug.replace(/[^가-힣\w\s-.~]/g, '').replace(/ /g, '-');

export const redirects = async () => {
  return pairs.map(([origin, target]) => ({
    source: '/' + encodeURI(slugify(origin)),
    destination: '/' + target,
    permanent: true,
  }));
};
