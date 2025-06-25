interface CounterProps {
  label: string;
  count?: number;
}

const Counter = ({ label, count }: CounterProps) => {
  return (
    <div className="text-2xl font-medium tracking-tight capitalize md:text-3xl">
      {label}
      {count && <sup>{count}</sup>}
    </div>
  );
};

export default Counter;
