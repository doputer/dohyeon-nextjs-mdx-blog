interface CounterProps {
  label: string;
  count?: number;
}

const Counter = ({ label, count }: CounterProps) => {
  return (
    <div className="group w-fit select-none text-2xl font-medium capitalize tracking-tight md:text-3xl">
      {label}
      {count && (
        <sup className="inline-block align-super text-base transition-transform duration-200 ease-out group-hover:-translate-y-0.5">
          {count}
        </sup>
      )}
    </div>
  );
};

export default Counter;
