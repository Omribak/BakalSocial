// useResponsiveType.js
import { useState, useEffect } from 'react';

const useResponsiveType = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Cleanup event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine the responsive types based on the width
  const isLaptop = windowWidth < 900;
  const isMobile = windowWidth < 660;

  return { isLaptop, isMobile };
};

export default useResponsiveType;
