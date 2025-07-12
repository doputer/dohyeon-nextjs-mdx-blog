import { useEffect, useState } from 'react';

const useObserver = () => {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveId(entry.target.id);
      });
    };

    const headings = document.querySelectorAll('h2, h3');
    const rootMarginBottom = -(window.innerHeight - 48);
    const options: IntersectionObserverInit = { rootMargin: `0px 0px ${rootMarginBottom}px` };
    const observer = new IntersectionObserver(handleObserver, options);

    headings.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, []);

  return activeId;
};

export default useObserver;
