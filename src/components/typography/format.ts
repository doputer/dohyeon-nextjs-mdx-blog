import { cn } from '@/utils/cn';

// Base
const HEADING = cn('mt-12 scroll-mt-12 font-semibold');
const LIST = cn('list-inside leading-8 marker:text-soft [&_:is(ol,ul)]:ml-6');

// Element
export const h2 = cn(
  HEADING,
  'flex items-center gap-2 text-xl after:h-px after:flex-1 after:bg-main'
);
export const h3 = cn(HEADING, 'text-lg');
export const h4 = cn(HEADING);
export const code = cn('text-[0.875em] font-semibold before:content-["`"] after:content-["`"]');
export const ol = cn(LIST, 'list-decimal');
export const ul = cn(LIST, 'list-disc');
export const p = cn('leading-8');
export const hr = cn('border-line');
export const input = cn('mr-1 size-4 align-[-0.1em] accent-main');
export const table = cn('w-full text-left whitespace-nowrap [&_tbody_tr:hover]:bg-surface');
export const th = cn('border-b-[1.5px] border-main/40 p-2 font-medium');
export const td = cn('border-b border-line p-2');
export const a = cn('text-accent no-underline');
export const external = cn('text-teal');
export const strong = cn('font-semibold');
export const img = cn('mx-auto rounded');
export const blockquote = cn('border-l-2 border-main/20 py-0.5 pl-4 text-muted');

// Component
export const pre = cn('text-sm/6');
export const callout = cn('space-y-6 overflow-hidden rounded bg-surface p-4');
