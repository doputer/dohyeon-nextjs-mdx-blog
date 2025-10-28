import { useCallback } from 'react';

const useScroll = () => {
  return useCallback((id: string) => {
    const element = document.getElementById(id);

    if (!(element instanceof HTMLHeadingElement)) return;

    element.scrollIntoView({ behavior: 'smooth' });
  }, []);
};

export default useScroll;
