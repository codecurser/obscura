import React, { useState, useEffect } from 'react';

export default function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({
    days: '05',
    hours: '20',
    mins: '45',
    secs: '00'
  });

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: '00', hours: '00', mins: '00', secs: '00' });
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(d).padStart(2, '0'),
        hours: String(h).padStart(2, '0'),
        mins: String(m).padStart(2, '0'),
        secs: String(s).padStart(2, '0')
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="photowalk-countdown-wrapper">
      <div className="countdown-label">COUNTDOWN TO SHUTTER RELEASE (SEP 26 • 10:00 AM)</div>
      <div className="countdown-timer">
        <div className="timer-box">
          <div className="timer-num">{timeLeft.days}</div>
          <div className="timer-unit">Days</div>
        </div>
        <div className="timer-sep">:</div>
        <div className="timer-box">
          <div className="timer-num">{timeLeft.hours}</div>
          <div className="timer-unit">Hours</div>
        </div>
        <div className="timer-sep">:</div>
        <div className="timer-box">
          <div className="timer-num">{timeLeft.mins}</div>
          <div className="timer-unit">Mins</div>
        </div>
        <div className="timer-sep">:</div>
        <div className="timer-box">
          <div className="timer-num">{timeLeft.secs}</div>
          <div className="timer-unit">Secs</div>
        </div>
      </div>
    </div>
  );
}
