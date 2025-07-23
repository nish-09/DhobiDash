import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface TimerProps {
  targetMinutes?: number;
  onComplete?: () => void;
  isActive?: boolean;
}

export default function Timer({ targetMinutes = 20, onComplete, isActive = true }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(targetMinutes * 60); // in seconds
  
  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timeLeft, onComplete]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((targetMinutes * 60 - timeLeft) / (targetMinutes * 60)) * 100;

  const formatTime = (mins: number, secs: number) => 
    `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  return (
    <Card className="p-6 text-center bg-gradient-speed text-white">
      <div className="space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Clock className="w-6 h-6" />
          <span className="text-lg font-medium">Pickup ETA</span>
        </div>
        
        <div className="text-4xl font-bold font-mono">
          {formatTime(minutes, seconds)}
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-white/20 rounded-full h-2">
          <div 
            className="bg-white h-2 rounded-full transition-smooth"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <p className="text-sm opacity-90">
          {timeLeft > 0 ? "Driver arriving soon!" : "Driver should be there!"}
        </p>
      </div>
    </Card>
  );
}