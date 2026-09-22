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
  apply: 'container' | 'items';
  base?: CSSProperties;
  containerClass?: string;
  style: (value: string) => Record<string, string>;
}

const BOXES = [{ label: '1' }, { label: '2' }, { label: '3' }];

const CELLS = [
  { label: '1', className: 'w-40' },
  { label: '2', className: 'w-40' },
  { label: '3', className: 'w-40' },
  { label: '4', className: 'w-40' },
  { label: '5', className: 'w-40' },
  { label: '6', className: 'w-40' },
];

const CONFIGS = {
  'flex-direction': {
    values: ['row', 'row-reverse', 'column', 'column-reverse'],
    items: BOXES,
    apply: 'container',
    containerClass: 'h-48 items-start',
    style: (value) => ({ flexDirection: value }),
  },
  'justify-content': {
    values: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'],
    items: BOXES,
    apply: 'container',
    containerClass: 'h-24',
    style: (value) => ({ justifyContent: value }),
  },
  'align-items': {
    values: ['stretch', 'flex-start', 'center', 'flex-end', 'baseline'],
    items: [
      { label: '1', className: 'py-1 text-xs' },
      { label: '2', className: 'py-5 text-lg' },
      { label: '3', className: 'py-3' },
    ],
    apply: 'container',
    containerClass: 'h-48',
    style: (value) => ({ alignItems: value }),
  },
  'flex-wrap': {
    values: ['nowrap', 'wrap', 'wrap-reverse'],
    items: CELLS,
    apply: 'container',
    containerClass: 'h-40 items-start',
    style: (value) => ({ flexWrap: value }),
  },
  'align-content': {
    values: ['stretch', 'flex-start', 'center', 'flex-end', 'space-between', 'space-around'],
    items: CELLS,
    apply: 'container',
    base: { flexWrap: 'wrap' },
    containerClass: 'h-56',
    style: (value) => ({ alignContent: value }),
  },
  flex: {
    values: ['initial', 'auto', 'none', '1'],
    items: [{ label: '짧게' }, { label: '조금 더 긴 내용' }, { label: '가장 긴 내용의 아이템' }],
    apply: 'items',
    containerClass: 'h-24 items-center',
    style: (value) => ({ flex: value }),
  },
  'min-width': {
    values: ['auto', '0'],
    items: [
      {
        label: '/posts/2026/flex-container-min-width-auto-overflow-issue-and-how-to-fix-it',
        className: 'block flex-1 font-mono',
        truncate: true,
      },
      { label: '사이드', className: 'shrink-0' },
    ],
    apply: 'items',
    containerClass: 'h-24 items-center',
    style: (value) => ({ minWidth: value }),
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
            'flex gap-2 rounded border border-dashed border-line p-3',
            config.containerClass
          )}
        >
          {config.items.map((item) => (
            <div
              key={item.label}
              style={config.apply === 'items' ? selected : undefined}
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
