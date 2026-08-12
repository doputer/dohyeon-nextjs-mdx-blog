import config from '@/configs/config.json';

const Me = () => {
  return (
    <section className="text-sm wrap-break-word break-keep sm:text-base">
      <h1 className="sr-only">{config.title}</h1>
      <p>
        안녕하세요, 프론트엔드 개발자{' '}
        <a
          href={config.social.github}
          target="_blank"
          rel="noreferrer"
          className="underline decoration-muted decoration-1 underline-offset-4 transition-colors duration-200 ease-out hover:decoration-main"
        >
          {config.name}
        </a>{' '}
        입니다.
      </p>
      <br />
      <p>
        사용자가 경험하는 모든 순간 뒤에는 보이지 않는 고민이 있습니다.
        <br />
        이곳에는 그런 화면 너머의 고민과 선택을 기록합니다.
        <br />
        작고 구체적인 기록들이 더 나은 방향을 만든다고 믿습니다.
      </p>
    </section>
  );
};

export default Me;
