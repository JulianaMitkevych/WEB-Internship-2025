import { useEffect, useState } from 'react';

type TProps = {
  isElementOpen: boolean;
};

export const useAnimationTimeout = ({ isElementOpen }: TProps) => {
  const [isVisible, setIsVisible] = useState(isElementOpen);

  useEffect(() => {
    if (isElementOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isElementOpen]);

  return { isVisible };
};
