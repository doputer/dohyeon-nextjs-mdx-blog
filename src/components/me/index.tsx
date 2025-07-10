import config from '@/configs/config.json';

const Me = () => {
  return (
    <section className="space-y-4 sm:text-lg">
      <p>
        안녕하세요, 프론트엔드 개발자{' '}
        <a href={config.social.github} className="underline underline-offset-6">
          김도현
        </a>{' '}
        입니다.
      </p>
      <p>
        사용자가 경험하는 모든 순간 뒤에는 보이지 않는 고민이 있습니다. 이곳에는 그런 화면 너머의
        고민과 선택을 기록합니다. 작고 구체적인 기록들이 더 나은 방향을 만든다고 믿습니다.
      </p>
    </section>
  );
};

export default Me;
