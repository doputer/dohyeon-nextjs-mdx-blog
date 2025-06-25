import { cn } from '@/utils/cn';

// Base
const HEADING = cn('mt-8 mb-4 scroll-mt-4 font-medium');
const LIST = cn('my-4 list-inside leading-8 [&_ol]:my-0 [&_ol]:ml-4 [&_ul]:my-0 [&_ul]:ml-4');

// Element
export const h2 = cn(HEADING, 'text-2xl');
export const h3 = cn(HEADING, 'text-xl');
export const blockquote = cn('bg-surface my-4 space-y-4 rounded-lg p-4 [&>p]:m-0');
export const code = cn('text-sm text-black dark:text-white');
export const ol = cn(LIST, 'list-decimal');
export const ul = cn(LIST, 'list-disc');
export const p = cn('my-4 leading-8');
export const table = cn('divide-line w-full divide-y text-left');
export const th = cn('p-2');
export const td = cn('p-2');
export const a = cn('text-link underline underline-offset-4');
export const strong = cn('font-medium text-black dark:text-white');
export const img = cn('m-auto my-4 h-auto w-fit rounded-sm');
