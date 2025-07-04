import { cn } from '@/utils/cn';

// Base
const HEADING = cn('mt-8 mb-4 scroll-mt-4 font-bold');
const LIST = cn('my-4 list-inside leading-8 [&_ol]:my-0 [&_ol]:ml-4 [&_ul]:my-0 [&_ul]:ml-4');

// Element
export const h2 = cn(HEADING, 'text-2xl');
export const h3 = cn(HEADING, 'text-xl');
export const blockquote = cn('my-4 flex flex-col gap-4 rounded bg-surface p-4 *:m-0');
export const code = cn('text-sm font-bold break-all before:content-["`"] after:content-["`"]');
export const ol = cn(LIST, 'list-decimal');
export const ul = cn(LIST, 'list-disc');
export const p = cn('my-4 leading-8');
export const table = cn('w-full divide-y divide-line text-left');
export const th = cn('p-2');
export const td = cn('p-2');
export const a = cn('underline underline-offset-4');
export const strong = cn('font-semibold');
export const img = cn('m-auto my-4 aspect-auto h-auto w-auto max-w-full rounded');
