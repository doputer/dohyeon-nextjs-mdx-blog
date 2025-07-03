interface CounterProps {
  label: string;
  count?: number;
}

const Counter = ({ label, count }: CounterProps) => {
  return (
    <section className="group w-fit text-2xl font-semibold tracking-tight capitalize select-none sm:text-3xl">
      {label}
      {count && <sup className="inline-block align-super text-base">{count}</sup>}
    </section>
  );
};

export default Counter;
