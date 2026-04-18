import { useState, useEffect, useRef } from 'react';
import styles from './PomodoroTimer.module.css';

const WORK_SECS = 25 * 60;
const BREAK_SECS = 5 * 60;

export default function PomodoroTimer() {
  const [secondsLeft, setSecondsLeft] = useState(WORK_SECS);
  const [running, setRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            setIsBreak(b => !b);
            return isBreak ? WORK_SECS : BREAK_SECS;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, isBreak]);

  const reset = () => {
    setRunning(false);
    setIsBreak(false);
    setSecondsLeft(WORK_SECS);
  };

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const secs = String(secondsLeft % 60).padStart(2, '0');
  const progress = secondsLeft / (isBreak ? BREAK_SECS : WORK_SECS);

  return (
    <div className={styles.container}>
      <div className={styles.mode}>{isBreak ? 'Break' : 'Focus'}</div>

      <div className={styles.ring}>
        <svg viewBox="0 0 100 100" className={styles.svg}>
          <circle cx="50" cy="50" r="44" className={styles.track} />
          <circle
            cx="50" cy="50" r="44"
            className={styles.fill}
            strokeDasharray={`${2 * Math.PI * 44}`}
            strokeDashoffset={`${2 * Math.PI * 44 * (1 - progress)}`}
          />
        </svg>
        <div className={styles.time}>{mins}:{secs}</div>
      </div>

      <div className={styles.controls}>
        <button className={styles.btn} onClick={() => setRunning(r => !r)}>
          {running ? 'Pause' : 'Start'}
        </button>
        <button className={styles.resetBtn} onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
