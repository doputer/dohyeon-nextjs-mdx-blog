import { useCallback } from 'react';

interface ScrollOption {
  id?: string;
}

const useScroll = () => {
  return useCallback(({ id }: ScrollOption) => {
    if (!id) return;

    const element = document.getElementById(id);

    if (!(element instanceof HTMLHeadingElement)) return;

    element.scrollIntoView({ behavior: 'smooth' });
  }, []);
};

export default useScroll;
