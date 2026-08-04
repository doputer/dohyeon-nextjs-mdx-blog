'use client';

import { type CSSProperties, useId, useState } from 'react';

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
    sample: `한 줄에 다 담기지 않는 긴 제목은 어떻게 잘려서 표시될까요? 이렇게 비교합니다.`,
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
  const name = useId();
  const [value, setValue] = useState(config.values[0]);

  return (
    <section className="my-8 rounded border border-line">
      <div className="flex flex-col sm:flex-row">
        <div className="flex min-w-0 flex-1 items-center p-5">
          <p
            lang={config.lang}
            style={config.style(value) as CSSProperties}
            className={cn('w-full min-w-0 overflow-x-auto text-main', config.previewClass)}
          >
            {config.sample}
          </p>
        </div>

        <fieldset className="shrink-0 border-t border-line bg-surface p-5 sm:w-48 sm:border-t-0 sm:border-l">
          <div className="flex flex-wrap gap-x-4 gap-y-2 sm:flex-col sm:gap-2.5">
            {config.values.map((option) => (
              <label
                key={option}
                className={cn(
                  'flex cursor-pointer items-center gap-2 text-sm text-muted transition-colors',
                  value === option && 'font-medium text-accent'
                )}
              >
                <input
                  type="radio"
                  name={name}
                  value={option}
                  checked={value === option}
                  onChange={() => setValue(option)}
                  className="accent-accent"
                />
                <span className="font-mono">{option}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>
    </section>
  );
};

export default Playground;
