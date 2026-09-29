'use client';

import { type CSSProperties, useState } from 'react';

import { cn } from '@/utils/cn';

interface PropertyConfig {
  values: string[];
  sample: string;
  lang?: string;
  previewClass?: string;
  style: (value: string) => Record<string, string>;
}

const CONFIGS = {
  'white-space': {
    values: ['normal', 'nowrap', 'pre', 'pre-wrap', 'pre-line', 'break-spaces'],
    sample: `공백   세 칸과\t탭 문자,\n그리고 줄바꿈이 포함된 조금 긴 예시 문장으로 자동 줄바꿈 여부까지 한눈에 비교해봅니다.`,
    style: (value) => ({ whiteSpace: value }),
  },
  'word-break': {
    values: ['normal', 'break-all', 'keep-all'],
    sample: `한글 어절이 어디서 끊기는지, 그리고 pneumonoultramicroscopicsilicovolcanoconiosis 같은 긴 영어 단어가 어떻게 처리되는지 살펴봅니다.`,
    style: (value) => ({ wordBreak: value }),
  },
  'overflow-wrap': {
    values: ['normal', 'break-word', 'anywhere'],
    sample: `긴 URL https://example.com/verylongpathsegmentthathasnobreakopportunitiesanywhereatall 은 이렇게 컨테이너를 뚫고 나갑니다.`,
    style: (value) => ({ overflowWrap: value }),
  },
  'text-overflow': {
    values: ['clip', 'ellipsis'],
    sample: `한 줄에 다 담기지 않는 긴 제목이 어디에서 잘리고 말줄임표는 어느 자리에 붙는지, 값을 바꿔가며 이렇게 비교합니다.`,
    style: (value) => ({ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: value }),
  },
  'line-break': {
    values: ['auto', 'loose', 'normal', 'strict', 'anywhere'],
    lang: 'ja',
    previewClass: 'max-w-[17em]',
    sample: `今日はいい天気ですが、明日は雨が降るそうです。傘を持っていきましょう。`,
    style: (value) => ({ lineBreak: value }),
  },
  hyphens: {
    values: ['none', 'manual', 'auto'],
    lang: 'en',
    sample: `An extraordinarily complicated internationalization example hyphenates automatically here.`,
    style: (value) => ({ hyphens: value, WebkitHyphens: value }),
  },
  'text-wrap': {
    values: ['wrap', 'nowrap', 'balance', 'pretty'],
    sample: `줄의 길이를 고르게 맞추거나 마지막 줄에 한 단어만 남지 않도록 다듬는 차이를 확인합니다.`,
    style: (value) => ({ textWrap: value }),
  },
} satisfies Record<string, PropertyConfig>;

type Property = keyof typeof CONFIGS;

interface Props {
  property: Property;
}

const Playground = ({ property }: Props) => {
  const config: PropertyConfig = CONFIGS[property];
  const [value, setValue] = useState(config.values[0]);

  return (
    <section className="space-y-2.5">
      <div className="rounded border-2 border-line bg-surface p-4">
        <div className="w-full max-w-full min-w-24 resize-x overflow-auto">
          <p
            lang={config.lang}
            style={config.style(value) as CSSProperties}
            className={cn('w-full text-main', config.previewClass)}
          >
            {config.sample}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded border border-line bg-surface py-1 pr-1.5 pl-3.5">
        <span className="font-mono text-xs text-muted select-none">{property}</span>
        <div className="flex flex-wrap items-center justify-end">
          {config.values.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={value === option}
              onClick={() => setValue(option)}
              className={cn(
                'flex min-w-7 items-center justify-center rounded px-1.5 py-0.5 font-mono text-xs font-medium select-none',
                value === option
                  ? 'bg-main text-background'
                  : 'text-muted hover:bg-background hover:text-main'
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Playground;
