import React, { useState, useEffect } from 'react';
import styles from './Timer.module.css';
import { TimerProps } from '../../models/Timer';

const Timer: React.FC<TimerProps> = ({ taskId, onSaveTime }) => {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRunning) {
            interval = setInterval(() => {
                setTime(prevTime => prevTime + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    const handlePlayPause = () => {
        setIsRunning(prevIsRunning => !prevIsRunning);
    };

    const handleStop = () => {
        setIsRunning(false);
        onSaveTime(taskId, time);
    };

    const handleReset = () => {
        setTime(0);
    };

    return (
        <div className={styles.timerContainer}>
            <p className={styles.timerDisplay}>{new Date(time * 1000).toISOString().substr(11, 8)}</p>
            <div className={styles.timerButtons}>
                <button className={styles.timerButton} onClick={handlePlayPause}>
                    {isRunning ? 'Pause' : 'Play'}
                </button>
                <button className={styles.timerButton} onClick={handleStop}>Stop</button>
                <button className={styles.timerButton} onClick={handleReset}>Reset</button>
            </div>
        </div>
    );
};

export default Timer;