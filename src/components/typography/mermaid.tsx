import * as format from '@/components/typography/format';
import { renderMermaidSVG } from 'beautiful-mermaid';

interface Props {
  code: string;
}

const colors = {
  bg: 'var(--color-background)',
  fg: 'var(--color-main)',
  line: 'var(--color-soft)',
  accent: 'var(--color-accent)',
  muted: 'var(--color-soft)',
  surface: 'var(--color-surface)',
  border: 'var(--color-line)',
  transparent: true,
};

const inheritFont = (svg: string) =>
  svg
    .replace(/^\s*@import url\('https:\/\/fonts\.googleapis\.com[^']*'\);$/gm, '')
    .replace(/text \{ font-family:[^}]*\}/, 'text { font-family: inherit; }');

const Mermaid = ({ code }: Props) => {
  let svg: string;

  try {
    svg = inheritFont(renderMermaidSVG(code, colors));
  } catch (error) {
    return <pre className={format.pre}>{String(error)}</pre>;
  }

  return (
    <div
      role="region"
      aria-label="다이어그램"
      tabIndex={0}
      className="overflow-x-auto [&>svg]:mx-auto [&>svg]:h-auto [&>svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export default Mermaid;
