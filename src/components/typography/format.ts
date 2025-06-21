import clsx from 'clsx/lite';

// Base
const HEADING = clsx('mt-8 mb-4 scroll-mt-4 font-semibold');
const LIST = clsx('my-4 list-inside leading-8 [&_ol]:my-0 [&_ol]:ml-4 [&_ul]:my-0 [&_ul]:ml-4');

// Element
export const h2 = clsx(HEADING, 'text-2xl');
export const h3 = clsx(HEADING, 'text-xl');
export const blockquote = clsx('bg-surface my-4 space-y-4 rounded-lg p-4 [&>p]:m-0');
export const code = clsx('bg-surface rounded-sm px-1 py-0.5 text-sm');
export const ol = clsx(LIST, 'list-decimal');
export const ul = clsx(LIST, 'list-disc');
export const p = clsx('my-4 leading-8');
export const table = clsx('divide-line w-full divide-y text-left');
export const th = clsx('p-2');
export const td = clsx('p-2');
export const a = clsx('text-link font-medium underline underline-offset-4');
export const strong = clsx('font-semibold');
export const img = clsx('m-auto my-4 h-auto w-fit rounded-sm');
