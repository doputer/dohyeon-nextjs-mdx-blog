import { useCallback, useEffect, useRef } from 'react';

const useRender = <T extends HTMLElement>() => {
  const element = useRef<T>(null);

  const ref = useCallback((node: T | null) => {
    element.current = node;
  }, []);

  useEffect(() => {
    if (!element.current) return;

    element.current.animate(
      [
        { outline: '2px solid oklch(61.2% 0.231 22.6deg / 1)' },
        { outline: '2px solid oklch(61.2% 0.231 22.6deg / 0)' },
      ],
      { duration: 500 }
    );
  });

  return ref;
};

export default useRender;
