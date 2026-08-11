'use client';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/authSlice';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Clock } from 'lucide-react';

export default function SessionTimeout() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
  
  const lastActiveTime = useRef(Date.now());
  const [timeLeft, setTimeLeft] = useState(TIMEOUT_MS);

  const handleLogout = () => {
    dispatch(logout());
    toast.error('Session expired due to inactivity');
    router.push('/login');
  };

  const resetTimer = () => {
    lastActiveTime.current = Date.now();
  };

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

    if (isAuthenticated) {
      resetTimer();
      events.forEach((event) => {
        window.addEventListener(event, resetTimer, { passive: true });
      });
      
      const interval = setInterval(() => {
        const remaining = TIMEOUT_MS - (Date.now() - lastActiveTime.current);
        if (remaining <= 0) {
          clearInterval(interval);
          handleLogout();
        } else {
          setTimeLeft(remaining);
        }
      }, 1000);

      return () => {
        clearInterval(interval);
        events.forEach((event) => {
          window.removeEventListener(event, resetTimer);
        });
      };
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);
  const isWarning = timeLeft <= 3 * 60 * 1000; // Show warning (red) if <= 3 minutes left

  return (
    <div style={{
      background: isWarning ? '#fee2e2' : 'var(--bg-app)',
      border: `1px solid ${isWarning ? '#f87171' : 'var(--border-main)'}`,
      color: isWarning ? '#b91c1c' : 'var(--text-light)',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      whiteSpace: 'nowrap',
      transition: 'all 0.3s ease'
    }}>
      <Clock size={16} color={isWarning ? '#dc2626' : 'var(--text-light)'} />
      Session expires in {minutes}:{seconds.toString().padStart(2, '0')}
    </div>
  );
}
