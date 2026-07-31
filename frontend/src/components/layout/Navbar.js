'use client';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';
import { getUnreadCount } from '@/lib/employeeApi';
import { Search, Bell, Mail, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'HR';

  const fetchUnreadCount = async () => {
    try {
      const res = await getUnreadCount();
      setUnreadCount(res.data?.data || 0);
    } catch {}
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleBellClick = () => {
    if (isAdmin) {
      router.push('/admin/notifications');
    } else {
      router.push('/employee/notifications');
    }
  };

  return (
    <div className="app-navbar bg-white dark:bg-[#0f172a] border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between px-6 transition-colors">
      
      {/* Left - Search */}
      <div className="flex-1 max-w-md relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setShowResults(true); }}
            onFocus={() => setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
            placeholder="Search anything..."
            className="w-full pl-10 pr-12 py-2 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl text-sm focus:ring-0 focus:outline-none text-slate-700 dark:text-slate-200 placeholder:text-slate-400 font-medium"
          />
          <div className="absolute right-3 flex items-center gap-1 bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-400 shadow-sm border border-slate-200 dark:border-slate-600">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/></svg>
            F
          </div>
        </div>
      </div>

      {/* Center - Links */}
      <div className="hidden lg:flex items-center gap-8 ml-8">
        {['Documents', 'News', 'Payslip', 'Report'].map(link => (
          <div key={link} className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors">
            {link}
          </div>
        ))}
      </div>

      {/* Right - Profile & Actions */}
      <div className="flex-1 flex justify-end items-center gap-4">
        
        {/* Mail */}
        <button className="relative p-2 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors">
          <Mail className="w-5 h-5" />
        </button>

        {/* Bell */}
        <button onClick={handleBellClick} className="relative p-2 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#0f172a]"></span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-600 dark:to-slate-800 flex items-center justify-center text-white font-bold text-xs overflow-hidden">
            {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <ChevronDown className="w-4 h-4 text-slate-500" />
        </div>

      </div>
    </div>
  );
}
