interface CounterProps {
  label: string;
  count?: number;
}

const Counter = ({ label, count }: CounterProps) => {
  return (
    <div className="select-none">
      <h1 className="text-3xl font-bold tracking-tight capitalize">
        {label} {count ? <sup className="text-xl">{count}</sup> : null}
      </h1>
    </div>
  );
};

export default Counter;
