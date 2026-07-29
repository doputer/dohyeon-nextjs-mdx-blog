'use client';

import { useEffect, useId, useState } from 'react';

import useTheme from '@/hooks/use-theme';
import mermaid from 'mermaid';

interface Props {
  code: string;
}

const Mermaid = (props: Props) => {
  const id = useId();
  const [svg, setSvg] = useState<string>('');
  const { theme } = useTheme();

  useEffect(() => {
    let canceled = false;

    const styles = getComputedStyle(document.documentElement);
    const token = (name: string) => styles.getPropertyValue(name).trim();

    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      look: 'handDrawn',
      themeVariables: {
        darkMode: theme === 'dark',
        background: token('--color-background'),
        primaryColor: token('--color-surface'),
        primaryTextColor: token('--color-main'),
        primaryBorderColor: token('--color-soft'),
        secondaryColor: token('--color-line'),
        tertiaryColor: token('--color-background'),
        lineColor: token('--color-mute'),
        textColor: token('--color-main'),
        noteBkgColor: token('--color-surface'),
        noteTextColor: token('--color-main'),
        noteBorderColor: token('--color-line'),
        fontFamily: 'inherit',
      },
    });

    (async () => {
      if (canceled) return;

      try {
        const { svg } = await mermaid.render(`mmd-${id}`, props.code);
        setSvg(svg);
      } catch (error) {
        setSvg(`<pre>${String(error)}</pre>`);
      }
    })();

    return () => {
      canceled = true;
    };
  }, [props.code, id, theme]);

  return <div dangerouslySetInnerHTML={{ __html: svg }} />;
};

export default Mermaid;
