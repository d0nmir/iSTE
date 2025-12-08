import { useState, useEffect, useRef } from "react";
import "./pomodoro.css";
import clickMp3 from '../../assets/sound/button-press.mp3';
import endTime from '../../assets/sound/success.mp3';

export default function PomodoroTimer() {
  const WORK_TIME = 25 * 60;
  const SHORT_BREAK = 5 * 60;
  const LONG_BREAK = 15 * 60;

  const [time, setTime] = useState(WORK_TIME);
  const [mode, setMode] = useState("work");
  const [isRunning, setIsRunning] = useState(false);
  const [active, setActive] = useState("work");

  const clickSoundRef = useRef(new Audio(clickMp3));
  const bellRef = useRef(null);

  useEffect(() => {
  document.title = `${formatTime()} - ${mode === "work" ? "Focus Time" : mode === "short" ? "Short Break" : "Long Break"}`;
  }, [time, mode]);

  useEffect(() => {
    bellRef.current = new Audio(endTime);
  }, []);

  const playClickSound = () => {
    clickSoundRef.current.currentTime = 0;
    clickSoundRef.current.play();
  };

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
    if (bellRef.current) {
      bellRef.current.currentTime = 0;
      bellRef.current.play();
    }

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
        <div className="pomodoro-mode-switch">
          <button
            className={active === "work" ? "active-btn" : "btn"}
            onClick={() => {
              playClickSound();
              setMode("work");
              setTime(WORK_TIME);
              setIsRunning(false);
              setActive("work");
            }}
          >
            Focus Time
          </button>
          
          <button
            className={active === "short" ? "active-btn" : "btn"}
            onClick={() => {
              playClickSound();
              setMode("short");
              setTime(SHORT_BREAK);
              setIsRunning(false);
              setActive("short");
            }}
          >
            Short Break
          </button>
          
          <button
            className={active === "long" ? "active-btn" : "btn"}
            onClick={() => {
              playClickSound();
              setMode("long");
              setTime(LONG_BREAK);
              setIsRunning(false);
              setActive("long");
            }}
          >
            Long Break
          </button>
        </div>

        <div className="pomodoro-time">{formatTime()}</div>

        <div className="pomodoro-buttons">
          {!isRunning ? (
            <button
              onClick={() => {
                setIsRunning(true);
                playClickSound();
              }}
            >
              Start
            </button>
          ) : (
            <button
              onClick={() => {
                setIsRunning(false);
                playClickSound();
              }}
            >
              Pause
            </button>
          )}
          <button
            className="reset_button"
            onClick={() => {
              if (mode === "work") setTime(WORK_TIME);
              if (mode === "short") setTime(SHORT_BREAK);
              if (mode === "long") setTime(LONG_BREAK);
              setIsRunning(false);
              playClickSound();
            }}
          >
            <svg
              fill="#fff"
              width="20px"
              height="20px"
              viewBox="0 0 1920 1920"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M960 0v213.333c411.627 0 746.667 334.934 746.667 746.667S1371.627 1706.667 960 1706.667 213.333 1371.733 213.333 960c0-197.013 78.4-382.507 213.334-520.747v254.08H640V106.667H53.333V320h191.04C88.64 494.08 0 720.96 0 960c0 529.28 430.613 960 960 960s960-430.72 960-960S1489.387 0 960 0"
                fillRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
