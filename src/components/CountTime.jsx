import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

const CountTime = ({ navCount, time, onTimeout }) => {
  const DEFAULT = typeof time === "number" ? time : 300;
  const [timeLeft, setTimeLeft] = useState(DEFAULT);
  const triggeredRef = useRef(false);
  const endTsRef = useRef(Date.now() + DEFAULT * 1000);
  const nav = useNavigate();

  const checkingNavigate = () => {
    if (window.history.length > 1) {
      nav(navCount ? navCount : -1);
    } else {
      nav("/");
    }
  };

  useEffect(() => {
    // Reset when incoming time changes
    if (typeof time === "number") {
      triggeredRef.current = false;
      endTsRef.current = Date.now() + time * 1000;
      setTimeLeft(time);
    }
  }, [time]);

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = Math.ceil((endTsRef.current - Date.now()) / 1000);
      const safe = remaining > 0 ? remaining : 0;
      setTimeLeft(safe);
      if (safe === 0 && !triggeredRef.current) {
        triggeredRef.current = true;
        if (typeof onTimeout === "function") {
          onTimeout();
        } else {
          checkingNavigate();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const safe = Math.max(0, seconds || 0);
    const m = Math.floor(safe / 60);
    const s = safe % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="text-2xl font-semibold text-red-500 w-16 text-end">
      {formatTime(timeLeft)}
    </div>
  );
};

export default CountTime;
