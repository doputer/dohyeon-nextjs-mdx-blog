import { cn } from '@/utils/cn';

// Base
const HEADING = cn('mt-12 scroll-mt-12 font-bold');
const MARKER = cn('before:mr-2 before:font-medium before:text-muted');
const LIST = cn('list-inside leading-8 marker:text-soft [&_:is(ol,ul)]:ml-6');
const TASK = cn('[&.contains-task-list,&_.contains-task-list]:list-none');

// Element
export const h2 = cn(HEADING, MARKER, "text-2xl before:content-['#']");
export const h3 = cn(HEADING, MARKER, "text-xl before:content-['##']");
export const h4 = cn(HEADING);
export const code = cn('text-[0.875em] font-bold before:content-["`"] after:content-["`"]');
export const ol = cn(LIST, 'list-decimal');
export const ul = cn(LIST, 'list-disc', TASK);
export const p = cn('leading-8');
export const hr = cn('border-line');
export const checkbox = cn('mr-1 size-4 align-[-0.1em] accent-main');
export const sup = cn('[&_a]:text-muted [&_a]:no-underline [&_a]:hover:text-main');
export const table = cn('w-full text-left whitespace-nowrap [&_tbody_tr:hover]:bg-surface');
export const th = cn('border-b-[1.5px] border-main/60 p-2 font-medium');
export const td = cn('border-b border-line p-2');
export const a = cn('underline decoration-muted decoration-1 underline-offset-4');
export const external = cn('after:content-["↗"]');
export const strong = cn('font-bold');
export const img = cn('mx-auto rounded');
export const blockquote = cn('border-l-2 border-main/20 py-0.5 pl-4 text-muted');

// Component
export const pre = cn('text-sm/6');
export const callout = cn('flex flex-col gap-4 rounded bg-surface px-4 py-2 lg:flex-row');
export const footnotes = cn(
  'mt-12 border-t border-line pt-6 text-sm text-muted [&_.data-footnote-backref]:ml-1 [&_.data-footnote-backref]:no-underline [&_li]:leading-7 [&_li>p:first-child]:inline'
);
