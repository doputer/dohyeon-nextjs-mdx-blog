interface CounterProps {
  label: string;
  count?: number;
}

const Counter = ({ label, count }: CounterProps) => {
  return (
    <section className="select-none">
      <h1 className="text-3xl font-bold tracking-tight capitalize">
        {label} {count ? <sup>{count}</sup> : null}
      </h1>
    </section>
  );
};

export default Counter;
