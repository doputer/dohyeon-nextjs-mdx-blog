import { cn } from '@/utils/cn';

// Base
const HEADING = cn('mt-12 scroll-mt-12 font-bold tracking-[-0.01em]');
const MARKER = cn('before:mr-2 before:font-normal before:text-soft');
const LIST = cn('list-inside marker:text-soft [&_ol]:my-0 [&_ol]:ml-6 [&_ul]:my-0 [&_ul]:ml-6');

// Element
export const h2 = cn(HEADING, MARKER, "text-xl before:content-['#'] sm:text-2xl");
export const h3 = cn(HEADING, MARKER, "text-lg before:content-['##'] sm:text-xl");
export const h4 = cn(HEADING, 'text-base');
export const code = cn(
  'text-[0.875em] font-bold before:text-soft before:content-["`"] after:text-soft after:content-["`"]'
);
export const ol = cn(LIST, 'list-decimal');
export const ul = cn(LIST, 'list-disc');
export const table = cn(
  'w-full text-left whitespace-nowrap [&_tbody_tr]:transition-colors [&_tbody_tr]:duration-150 [&_tbody_tr:hover]:bg-surface'
);
export const th = cn('border-b border-main/60 p-2 font-medium');
export const td = cn('border-b border-line p-2');
export const a = cn(
  'underline decoration-muted decoration-1 underline-offset-[0.3em] transition-colors duration-200 ease-out hover:decoration-main'
);
export const external = cn('after:align-super after:text-xs after:text-soft after:content-["↗"]');
export const strong = cn('font-bold');
export const img = cn('mx-auto rounded');
export const blockquote = cn('border-l-2 border-main/25 pl-5 text-muted');

// Component
export const pre = cn('text-sm leading-6');
export const callout = cn(
  'flex flex-col gap-4 rounded border border-line bg-surface p-4 lg:flex-row'
);
