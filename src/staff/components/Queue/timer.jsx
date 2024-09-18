import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import './timer.scss';

const Timer = forwardRef(({ onDone }, ref) => {
  const [time, setTime] = useState({ hr: 0, min: 0, sec: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const timerId = useRef(null);

  useEffect(() => {
    if (isRunning) {
      timerId.current = setInterval(() => {
        setTime((prevTime) => {
          const { hr, min, sec } = prevTime;
          if (sec < 59) {
            return { hr, min, sec: sec + 1 };
          } else if (min < 59) {
            return { hr, min: min + 1, sec: 0 };
          } else {
            return { hr: hr + 1, min: 0, sec: 0 };
          }
        });
      }, 1000);
    } else {
      clearInterval(timerId.current);
    }

    return () => clearInterval(timerId.current);
  }, [isRunning]);

  
  useImperativeHandle(ref, () => ({
    resetTimer() {
      setTime({ hr: 0, min: 0, sec: 0 }); // Reset time to 0
      setIsRunning(false); // Stop the timer
    }
  }));

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setTime({ hr: 0, min: 0, sec: 0 });
    setIsRunning(false);
  };

  const handleDoneClick = () => {
    onDone(time);  
    handleReset(); 
  };

  return (
    <div className="timer-container">
      <h2>
        {time.hr.toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        })}
        :
        {time.min.toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        })}
        :
        {time.sec.toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        })}
      </h2>
      <div className="buttons">
        <button className="start-button" onClick={handleStart}>Start</button>
        <button className="pause-button" onClick={handleStop}>Pause</button>
        <button className="reset-button" onClick={handleReset}>Reset</button>
        <button className="done-button" onClick={handleDoneClick}>Done</button>
      </div>
    </div>
  );
});

export default Timer;
