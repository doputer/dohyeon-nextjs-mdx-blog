import { useEffect, useRef, useState } from 'react';

const useInView = () => {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const options = { threshold: 0.3 } satisfies IntersectionObserverInit;
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return { ref, inView };
};

export default useInView;
