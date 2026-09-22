export const toSlug = (file: string) => file.split('/').at(-2)!;

export const toEntry = <T>([file, value]: [string, T]) => [toSlug(file), value] as const;

export const byLatest = <T extends { frontmatter: { date: string } }>(a: T, b: T) =>
  new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime();
