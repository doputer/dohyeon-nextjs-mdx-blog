import { useCallback, useEffect, useRef } from 'react';

const useRender = <T extends HTMLElement>() => {
  const element = useRef<T>(null);

  const ref = useCallback((node: T | null) => {
    element.current = node;
  }, []);

  useEffect(() => {
    if (!element.current) return;

    element.current.animate(
      [{ outline: '2px solid rgba(255, 0, 0, 0.5)' }, { outline: '2px solid rgba(255, 0, 0, 0)' }],
      { duration: 500 }
    );
  });

  return ref;
};

export default useRender;
