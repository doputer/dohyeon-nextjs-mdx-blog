import Link from 'next/link';

const NotFound = () => {
  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-6 sm:gap-8">
      <h1 className="text-4xl font-semibold sm:text-5xl">404 Not Found</h1>
      <Link href="/" className="text-xl">
        홈으로
      </Link>
    </section>
  );
};

export default NotFound;
