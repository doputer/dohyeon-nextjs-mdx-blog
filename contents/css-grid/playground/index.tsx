'use client';

import { type CSSProperties, useId, useState } from 'react';

import { cn } from '@/utils/cn';

interface Item {
  label: string;
  className?: string;
  truncate?: boolean;
}

interface PropertyConfig {
  values: string[];
  items: Item[];
  apply: 'container' | 'first';
  base?: CSSProperties;
  containerClass?: string;
  style: (value: string) => Record<string, string>;
}

const CELLS = [
  { label: '1' },
  { label: '2' },
  { label: '3' },
  { label: '4' },
  { label: '5' },
  { label: '6' },
];

const CONFIGS = {
  'grid-template-columns': {
    values: [
      '120px 120px',
      '1fr 1fr',
      '1fr 2fr',
      'repeat(4, 1fr)',
      'repeat(auto-fill, minmax(96px, 1fr))',
    ],
    items: CELLS,
    apply: 'container',
    style: (value) => ({ gridTemplateColumns: value }),
  },
  'grid-auto-flow': {
    values: ['row', 'column'],
    items: CELLS,
    apply: 'container',
    base: { gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(2, 2.5rem)' },
    style: (value) => ({ gridAutoFlow: value }),
  },
  'grid-column': {
    values: ['auto', 'span 2', '1 / 3', '2 / -1'],
    items: [{ label: '1', className: 'border-accent text-accent' }, ...CELLS.slice(1)],
    apply: 'first',
    base: { gridTemplateColumns: 'repeat(4, 1fr)' },
    style: (value) => ({ gridColumn: value }),
  },
  'justify-items': {
    values: ['stretch', 'start', 'center', 'end'],
    items: [{ label: '1' }, { label: '두 번째' }, { label: '3' }],
    apply: 'container',
    base: { gridTemplateColumns: 'repeat(3, 1fr)' },
    style: (value) => ({ justifyItems: value }),
  },
  'align-items': {
    values: ['stretch', 'start', 'center', 'end'],
    items: [{ label: '1' }, { label: '2' }, { label: '3' }],
    apply: 'container',
    base: { gridTemplateColumns: 'repeat(3, 1fr)' },
    containerClass: 'h-40',
    style: (value) => ({ alignItems: value }),
  },
  'justify-content': {
    values: ['start', 'center', 'end', 'space-between', 'space-around', 'space-evenly'],
    items: CELLS,
    apply: 'container',
    base: { gridTemplateColumns: 'repeat(3, 88px)' },
    style: (value) => ({ justifyContent: value }),
  },
  minmax: {
    values: ['1fr', 'minmax(0, 1fr)'],
    items: [
      {
        label: '/posts/2026/grid-template-columns-1fr-min-content-overflow-and-how-to-fix-it',
        className: 'block font-mono',
        truncate: true,
      },
      { label: '사이드' },
    ],
    apply: 'container',
    style: (value) => ({ gridTemplateColumns: `${value} 5rem` }),
  },
} satisfies Record<string, PropertyConfig>;

type Property = keyof typeof CONFIGS;

interface Props {
  property: Property;
}

const Playground = ({ property }: Props) => {
  const config: PropertyConfig = CONFIGS[property];
  const name = useId();
  const [value, setValue] = useState(config.values[0]);

  const selected = config.style(value) as CSSProperties;

  return (
    <section className="my-8 rounded border border-line">
      <div className="overflow-hidden p-4">
        <div
          style={{ ...config.base, ...(config.apply === 'container' ? selected : undefined) }}
          className={cn(
            'grid gap-2 rounded border border-dashed border-line p-3',
            config.containerClass
          )}
        >
          {config.items.map((item, index) => (
            <div
              key={item.label}
              style={config.apply === 'first' && index === 0 ? selected : undefined}
              className={cn(
                'flex items-center justify-center rounded border border-line bg-surface px-3 py-2 text-sm text-main',
                item.className
              )}
            >
              {item.truncate ? (
                <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
                  {item.label}
                </span>
              ) : (
                item.label
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-line bg-surface px-4 py-3">
        {config.values.map((option) => (
          <label
            key={option}
            className={cn(
              'flex cursor-pointer items-center gap-2 font-mono text-sm text-muted transition-colors hover:text-main',
              value === option && 'font-medium text-main'
            )}
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={() => setValue(option)}
              className="accent-main"
            />
            {option}
          </label>
        ))}
      </div>
    </section>
  );
};

export default Playground;
