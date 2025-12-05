import { useState, useEffect, useCallback } from 'react';

type TUseTimerReturn = {
  timeLeft: number;
  isExpired: boolean;
  resetTimer: () => void;
  formatTime: (seconds: number) => string;
};

export function useTimer(initialMinutes: number = 30): TUseTimerReturn {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isExpired, setIsExpired] = useState(false);

  const formatTime = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  const resetTimer = useCallback(() => {
    setTimeLeft(initialMinutes * 60);
    setIsExpired(false);
  }, [initialMinutes]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  return {
    timeLeft,
    isExpired,
    resetTimer,
    formatTime,
  };
}
