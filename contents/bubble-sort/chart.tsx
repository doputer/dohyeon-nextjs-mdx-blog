import { cn } from '@/utils/cn';

interface Props {
  array: number[];
  max: number;
  active: number[];
  sortedFrom: number;
}

const Chart = ({ array, max, active, sortedFrom }: Props) => (
  <div className="flex aspect-video items-end gap-px overflow-hidden rounded border-2 border-line bg-surface p-2">
    {array.map((value, index) => (
      <div
        key={index}
        style={{ height: `${(value / max) * 100}%` }}
        className={cn(
          'flex-1',
          index >= sortedFrom ? 'bg-main' : active.includes(index) ? 'bg-accent' : 'bg-line'
        )}
      />
    ))}
  </div>
);

export default Chart;
