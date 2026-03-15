'use client';

import { useState, useEffect } from 'react';

interface TypingEffectProps {
  text: string;
  speed?: number;
}

export default function TypingEffect({ text, speed = 70 }: TypingEffectProps) {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    setDisplayedText(''); // Reset on text change
    const timeout = setTimeout(() => {
      let i = 0;
      const intervalId = setInterval(() => {
        setDisplayedText(text.slice(0, i + 1));
        i++;
        if (i >= text.length) {
          clearInterval(intervalId);
        }
      }, speed);
      return () => clearInterval(intervalId);
    }, 500); // Delay before starting

    return () => clearTimeout(timeout);
  }, [text, speed]);


  return (
    <>
      {displayedText}
      <span className="ml-1 inline-block h-[0.9em] w-[2px] animate-ping bg-accent" />
    </>
  );
}
