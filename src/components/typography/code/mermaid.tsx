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
    let canceled = false;

    mermaid.initialize({
      startOnLoad: false,
      theme: theme === 'light' ? 'neutral' : 'dark',
      look: 'handDrawn',
    });

    (async () => {
      if (canceled) return;

      try {
        const { svg } = await mermaid.render(`mmd-${id}`, code);
        setSvg(svg);
      } catch (error) {
        setSvg(`<pre>${String(error)}</pre>`);
      }
    })();

    return () => {
      canceled = true;
    };
  }, [code, id, theme]);

  return <div dangerouslySetInnerHTML={{ __html: svg }} />;
};

export default Mermaid;
