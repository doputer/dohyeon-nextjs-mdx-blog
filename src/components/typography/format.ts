import { cn } from '@/utils/cn';

// Base
const HEADING = cn('mt-12 scroll-mt-12 font-bold');
const LIST = cn('list-inside leading-8 [&_ol]:my-0 [&_ol]:ml-6 [&_ul]:my-0 [&_ul]:ml-6');

// Element
export const h2 = cn(HEADING, 'text-2xl');
export const h3 = cn(HEADING, 'text-xl');
export const blockquote = cn('flex flex-col gap-6 rounded bg-surface p-4');
export const code = cn('text-sm font-bold before:content-["`"] after:content-["`"]');
export const ol = cn(LIST, 'list-decimal');
export const ul = cn(LIST, 'list-disc');
export const p = cn('leading-8');
export const table = cn('w-full divide-y divide-line text-left whitespace-nowrap');
export const th = cn('p-2');
export const td = cn('p-2');
export const a = cn('underline underline-offset-4');
export const strong = cn('font-semibold');
export const img = cn('h-auto w-full rounded');
export const pre = cn('text-sm leading-6');
