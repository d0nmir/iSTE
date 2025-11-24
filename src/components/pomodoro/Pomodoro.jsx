import { useState, useEffect, useRef } from "react";
import "./pomodoro.css";

export default function PomodoroTimer() {
  const WORK_TIME = 25 * 60;
  const SHORT_BREAK = 5 * 60;
  const LONG_BREAK = 15 * 60;

  const [time, setTime] = useState(WORK_TIME);
  const [mode, setMode] = useState("work");
  const [isRunning, setIsRunning] = useState(false);

  const bellRef = useRef(null);

  useEffect(() => {
    bellRef.current = new Audio("https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg");
  }, []);

  useEffect(() => {
    let interval = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prev) => {
          if (prev <= 1) {
            handleEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, mode]);

  const handleEnd = () => {
    if (bellRef.current) bellRef.current.play();

    if (mode === "work") {
      setMode("short");
      setTime(SHORT_BREAK);
    } else {
      setMode("work");
      setTime(WORK_TIME);
    }
    setIsRunning(false);
  };

  const formatTime = () => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="container">
      <div className={`pomodoro-container ${mode}`}>
        <h2 className="pomodoro-title">
          {mode === "work" && "Focus Time"}
          {mode === "short" && "Short break"}
          {mode === "long" && "Long Break"}
        </h2>

        <div className="pomodoro-time">{formatTime()}</div>

        <div className="pomodoro-buttons">
          {!isRunning ? (
            <button onClick={() => setIsRunning(true)}>Start</button>
          ) : (
            <button onClick={() => setIsRunning(false)}>Pause</button>
          )}
          <button
            onClick={() => {
              if (mode === "work") setTime(WORK_TIME);
              if (mode === "short") setTime(SHORT_BREAK);
              if (mode === "long") setTime(LONG_BREAK);
              setIsRunning(false);
            }}
          >
            Reset
          </button>
        </div>

        <div className="pomodoro-mode-switch">
          <button
            onClick={() => {
              setMode("work");
              setTime(WORK_TIME);
              setIsRunning(false);
            }}
          >
            Focus Time
          </button>
          <button
            onClick={() => {
              setMode("short");
              setTime(SHORT_BREAK);
              setIsRunning(false);
            }}
          >
            Short Break
          </button>
          <button
            onClick={() => {
              setMode("long");
              setTime(LONG_BREAK);
              setIsRunning(false);
            }}
          >
            Long Break
          </button>
        </div>
      </div>
    </div>
  );
}