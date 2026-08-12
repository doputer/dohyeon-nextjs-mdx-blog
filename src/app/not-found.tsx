import Link from 'next/link';

const NotFound = () => {
  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold tracking-[-0.02em]">404 Not Found</h1>
      <Link
        href="/"
        className="text-sm text-muted decoration-line decoration-1 underline-offset-[0.3em] transition-colors duration-200 ease-out hover:text-main hover:decoration-main"
      >
        홈으로
      </Link>
    </section>
  );
};

export default NotFound;
