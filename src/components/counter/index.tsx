interface CounterProps {
  label: string;
  count?: number;
}

const Counter = ({ label, count }: CounterProps) => {
  return (
    <section className="group w-fit text-2xl font-medium tracking-tight capitalize select-none md:text-3xl">
      {label}
      {count && (
        <sup className="inline-block align-super text-base transition-transform duration-200 ease-out group-hover:-translate-y-0.5">
          {count}
        </sup>
      )}
    </section>
  );
};

export default Counter;
