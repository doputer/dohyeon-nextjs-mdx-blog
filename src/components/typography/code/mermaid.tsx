'use client';

import { useEffect, useId, useState } from 'react';

import mermaid from 'mermaid';

import useTheme from '@/hooks/use-theme';

interface Props {
  code: string;
}

const Mermaid = ({ code }: Props) => {
  const id = useId();
  const [svg, setSvg] = useState<string>('');
  const { theme } = useTheme();

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      theme: theme === 'light' ? 'neutral' : 'dark',
    });

    let cancelled = false;

    (async () => {
      try {
        const { svg } = await mermaid.render(`mmd-${id}`, code);
        if (!cancelled) setSvg(svg);
      } catch (e) {
        if (!cancelled) setSvg(`<pre>${escapeHtml(String(e))}\n${escapeHtml(code)}</pre>`);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [code, id, theme]);

  return <div dangerouslySetInnerHTML={{ __html: svg }} />;
};

const escapeHtml = (s: string) => {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!
  );
};

export default Mermaid;
