'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// Move static constants outside the component so they don't trigger re-renders or dependency warnings
const TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

export default function SessionTimeout() {
  // ✅ Initialize with null instead of calling Date.now() during render
  const lastActiveTime = useRef(null);
  const [timeLeft, setTimeLeft] = useState(TIMEOUT_MS);

  // ✅ Wrap handleLogout in useCallback so it's safe to include in useEffect dependencies
  const handleLogout = useCallback(() => {
    // Your logout logic here
    console.log('User logged out due to inactivity');
  }, []);

  const resetTimer = useCallback(() => {
    lastActiveTime.current = Date.now();
    setTimeLeft(TIMEOUT_MS);
  }, []);

  useEffect(() => {
    // Set initial timestamp on mount
    lastActiveTime.current = Date.now();

    const events = ['mousemove', 'keydown', 'scroll', 'click'];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    const interval = setInterval(() => {
      if (!lastActiveTime.current) return;

      const elapsed = Date.now() - lastActiveTime.current;
      const remaining = TIMEOUT_MS - elapsed;

      if (remaining <= 0) {
        clearInterval(interval);
        handleLogout();
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
      clearInterval(interval);
    };
  }, [resetTimer, handleLogout]); // ✅ All required dependencies are now properly tracked

  return null; // Or render your UI modal if showing a countdown warning
}