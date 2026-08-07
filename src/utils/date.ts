export const toYearMonthDay = (date: string) => date.replaceAll('-', '.');

export const toYearMonth = (date: string) => date.slice(0, 7).replace('-', '.');

export const toYear = (date: string) => date.slice(0, 4);

export const toMonthDay = (date: string) => date.slice(5).replace('-', '.');
