import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

const UrgencyTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [endTime, setEndTime] = useState<number>(0);

  useEffect(() => {
    // Check if there's a stored end time
    const storedEndTime = localStorage.getItem('urgencyTimerEnd');
    let targetTime: number;

    if (storedEndTime && parseInt(storedEndTime) > Date.now()) {
      targetTime = parseInt(storedEndTime);
    } else {
      // Generate random hours between 5 and 24
      const randomHours = Math.floor(Math.random() * (24 - 5 + 1)) + 5;
      targetTime = Date.now() + randomHours * 60 * 60 * 1000;
      localStorage.setItem('urgencyTimerEnd', targetTime.toString());
    }

    setEndTime(targetTime);

    const interval = setInterval(() => {
      const now = Date.now();
      const difference = targetTime - now;

      if (difference <= 0) {
        // Timer expired, reset with new random time
        const newRandomHours = Math.floor(Math.random() * (24 - 5 + 1)) + 5;
        const newTargetTime = Date.now() + newRandomHours * 60 * 60 * 1000;
        localStorage.setItem('urgencyTimerEnd', newTargetTime.toString());
        setEndTime(newTargetTime);
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-center gap-2 text-destructive">
        <Clock className="h-5 w-5" />
        <span className="font-semibold">Limited Time Offer Ends In:</span>
      </div>
      <div className="flex justify-center gap-3 mt-3">
        <div className="text-center">
          <div className="bg-destructive text-destructive-foreground rounded-md px-3 py-2 min-w-[60px] font-bold text-xl">
            {String(timeLeft.hours).padStart(2, '0')}
          </div>
          <div className="text-xs mt-1 text-muted-foreground">Hours</div>
        </div>
        <div className="text-2xl font-bold self-center">:</div>
        <div className="text-center">
          <div className="bg-destructive text-destructive-foreground rounded-md px-3 py-2 min-w-[60px] font-bold text-xl">
            {String(timeLeft.minutes).padStart(2, '0')}
          </div>
          <div className="text-xs mt-1 text-muted-foreground">Minutes</div>
        </div>
        <div className="text-2xl font-bold self-center">:</div>
        <div className="text-center">
          <div className="bg-destructive text-destructive-foreground rounded-md px-3 py-2 min-w-[60px] font-bold text-xl">
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
          <div className="text-xs mt-1 text-muted-foreground">Seconds</div>
        </div>
      </div>
    </div>
  );
};

export default UrgencyTimer;