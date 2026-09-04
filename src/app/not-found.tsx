import Link from 'next/link';

const NotFound = () => {
  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-semibold sm:text-4xl">404 Not Found</h1>
      <Link href="/" className="text-lg text-muted hover:text-main">
        홈으로
      </Link>
    </section>
  );
};

export default NotFound;
