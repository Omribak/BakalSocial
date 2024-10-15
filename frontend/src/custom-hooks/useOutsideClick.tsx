import { useEffect, useRef } from 'react';

const useOutsideClick = (handler: () => void) => {
  // Define ref type as HTMLElement or null
  const ref = useRef<any>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [handler]);

  return ref;
};

export default useOutsideClick;
