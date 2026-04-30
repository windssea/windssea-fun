import { useState, useEffect, useRef } from 'react';

export const useMorseInput = (onCommit: (char: string) => void, onSpace: () => void) => {
  const [sequence, setSequence] = useState<string>('');
  const [isPressing, setIsPressing] = useState(false);
  const pressStartRef = useRef<number>(0);
  const timerRef = useRef<any>(null);

  const clearTimers = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const startPress = () => {
    setIsPressing(true);
    pressStartRef.current = Date.now();
    clearTimers();
    if (navigator.vibrate) navigator.vibrate(10);
  };

  const endPress = () => {
    setIsPressing(false);
    const duration = Date.now() - pressStartRef.current;
    const bit = duration < 200 ? '.' : '-';
    setSequence(prev => prev + bit);
  };

  useEffect(() => {
    if (!isPressing && sequence.length > 0) {
      clearTimers();
      timerRef.current = setTimeout(() => {
        onCommit(sequence);
        setSequence('');
        if (navigator.vibrate) navigator.vibrate([20, 50, 20]);
        
        timerRef.current = setTimeout(() => {
          onSpace();
        }, 1400 - 600); // Total 1400ms from release
      }, 600);
    }
    return clearTimers;
  }, [sequence, isPressing, onCommit, onSpace]);

  return { sequence, isPressing, startPress, endPress };
};
