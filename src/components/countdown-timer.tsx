'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  endDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer({ endDate }: CountdownTimerProps) {
  const calculateTimeLeft = (): TimeLeft | null => {
    const difference = +new Date(endDate) - +new Date();
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return null;
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [endDate]);
  
  const TimerBlock = ({ value, label }: { value: number, label: string }) => (
    <div className="flex flex-col items-center">
        <div className="text-3xl md:text-5xl font-bold font-mono text-accent bg-transparent rounded-lg p-2 min-w-[60px] md:min-w-[80px] text-center" style={{ textShadow: '0 0 10px hsl(var(--accent))' }}>
            {value.toString().padStart(2, '0')}
        </div>
        <span className="text-xs mt-1 text-primary-foreground/70 uppercase tracking-widest">{label}</span>
    </div>
  );

  if (!timeLeft) {
    return <div className="text-center text-xl font-bold text-red-500">Oferta Encerrada!</div>;
  }

  return (
    <div className="flex justify-center gap-2 md:gap-6">
        <TimerBlock value={timeLeft.days} label="Dias" />
        <TimerBlock value={timeLeft.hours} label="Horas" />
        <TimerBlock value={timeLeft.minutes} label="Minutos" />
        <TimerBlock value={timeLeft.seconds} label="Segundos" />
    </div>
  );
}
