interface CounterProps {
  label: string;
  count?: number;
}

const Counter = ({ label, count }: CounterProps) => {
  return (
    <div className="select-none">
      <h1 className="text-[1.75rem] font-bold tracking-[-0.02em] capitalize sm:text-[2rem]">
        {label}
        {count ? <sup className="ml-1 text-base font-medium text-muted">{count}</sup> : null}
      </h1>
    </div>
  );
};

export default Counter;
