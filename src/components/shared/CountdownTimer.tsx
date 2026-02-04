"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  targetDate: Date | string;
  className?: string;
}

export default function CountdownTimer({ targetDate, className }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isUrgent, setIsUrgent] = useState(false);
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const update = () => {
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setIsPast(true);
        return;
      }

      const totalHours = diff / (1000 * 60 * 60);
      setIsUrgent(totalHours < 24);

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (isPast) {
    return (
      <div className={cn("flex items-center gap-2 text-sm text-muted-foreground", className)}>
        <Clock className="h-4 w-4" />
        <span>Sessão já ocorreu</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm",
        isUrgent ? "text-orange-600 font-medium" : "text-copper-600",
        className
      )}
    >
      <Clock className={cn("h-4 w-4", isUrgent && "animate-pulse")} />
      <span>
        {timeLeft.days > 0 && `${timeLeft.days}d `}
        {String(timeLeft.hours).padStart(2, "0")}h{" "}
        {String(timeLeft.minutes).padStart(2, "0")}min{" "}
        {String(timeLeft.seconds).padStart(2, "0")}s
      </span>
    </div>
  );
}
