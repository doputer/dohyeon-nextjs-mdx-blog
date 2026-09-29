import { cn } from '@/utils/cn';

interface Props {
  array: number[];
  max: number;
  candidate: number;
  probe: number | null;
  sortedTo: number;
}

const Chart = ({ array, max, candidate, probe, sortedTo }: Props) => (
  <div className="flex aspect-video items-end gap-px overflow-hidden border-2 border-line p-2">
    {array.map((value, index) => (
      <div
        key={index}
        style={{ height: `${(value / max) * 100}%` }}
        className={cn(
          'flex-1',
          index < sortedTo
            ? 'bg-main'
            : index === candidate
              ? 'bg-accent-alt'
              : index === probe
                ? 'bg-accent'
                : 'bg-line'
        )}
      />
    ))}
  </div>
);

export default Chart;
