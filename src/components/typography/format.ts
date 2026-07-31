import { cn } from '@/utils/cn';

// Base
const HEADING = cn('mt-12 scroll-mt-12 font-bold');
const MARKER = cn('before:mr-2 before:font-medium before:text-accent');
const LIST = cn(
  'list-inside leading-8 marker:text-accent [&_ol]:my-0 [&_ol]:ml-6 [&_ul]:my-0 [&_ul]:ml-6'
);

// Element
export const h2 = cn(HEADING, MARKER, "text-2xl before:content-['#']");
export const h3 = cn(HEADING, MARKER, "text-xl before:content-['##']");
export const h4 = cn(HEADING);
export const blockquote = cn('border-l-2 border-accent py-0.5 pl-4 text-main italic');
export const callout = cn(
  'flex flex-col gap-4 rounded border border-line bg-surface/60 p-4 lg:flex-row'
);
export const code = cn('text-sm font-bold before:content-["`"] after:content-["`"]');
export const ol = cn(LIST, 'list-decimal');
export const ul = cn(LIST, 'list-disc');
export const p = cn('leading-8');
export const table = cn(
  'w-full text-left whitespace-nowrap',
  '[&_tbody_tr]:transition-colors [&_tbody_tr]:duration-150 [&_tbody_tr:hover]:bg-surface'
);
export const th = cn('border-b-[1.5px] border-main/55 p-2 font-medium');
export const td = cn('border-b border-line p-2');
export const a = cn('text-accent underline decoration-1 underline-offset-3 after:content-["↗"]');
export const strong = cn('font-bold');
export const img = cn('mx-auto rounded');
export const pre = cn('text-sm leading-6');
