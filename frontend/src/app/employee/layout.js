'use client';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';

export default function EmployeeLayout({ children }) {
  const { isAuthenticated, isInitialized, user } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (isInitialized) {
      if (!isAuthenticated) router.push('/');
    }
  }, [isAuthenticated, isInitialized, router]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-app)]">
        <div className="animate-spin w-12 h-12 border-4 border-[var(--border-main)] border-t-blue-500 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar role={user?.role} />
      <div className="app-main-content">
        <Navbar />
        <main className="app-main-padding">
          {children}
        </main>
      </div>
    </div>
  );
}