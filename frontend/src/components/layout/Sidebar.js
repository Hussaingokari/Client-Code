// 'use client';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/authSlice';

const NAV_ITEMS = [
  { key: 'dashboard', path: '/admin/dashboard', label: 'Dashboard', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>
  ) },
  { key: 'employees', label: 'Employees', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
  ), subItems: [
    { label: 'Manage Employees', path: '/admin/employees' },
    { label: 'Directory', path: '/admin/directory' },
    { label: 'ORG Chart', path: '/admin/org-chart' },
  ]},
  { key: 'checklist', label: 'Checklist', path: '/admin/checklist', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
  ), subItems: [
    { label: 'Tasks', path: '/admin/checklist/tasks' }
  ] },
  { key: 'timeoff', label: 'Time Off', path: '/admin/timeoff', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  ), subItems: [
    { label: 'Leave Requests', path: '/admin/leave' }
  ] },
  { key: 'attendance', label: 'Attendance', path: '/admin/attendance', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
  ), subItems: [
    { label: 'Daily Log', path: '/admin/attendance/log' }
  ] },
  { key: 'payroll', label: 'Payroll', path: '/admin/payroll', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"/><path d="M7 15h0M2 9.5h20"/></svg>
  ), subItems: [
    { label: 'Payslips', path: '/admin/payroll/payslips' }
  ] },
  { key: 'performance', label: 'Performance', path: '/admin/performance', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
  ), subItems: [
    { label: 'Reviews', path: '/admin/performance/reviews' }
  ] },
  { key: 'recruitment', label: 'Recruitment', path: '/admin/recruitment', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
  ), subItems: [
    { label: 'Candidates', path: '/admin/recruitment/candidates' }
  ] },
];

function NavItem({ item, pathname, router }) {
  const isActive = pathname === item.path || (item.subItems && item.subItems.some(sub => pathname === sub.path || pathname.startsWith(sub.path)));
  const [isOpen, setIsOpen] = useState(isActive);

  if (item.subItems) {
    return (
      <div className="mb-0.5">
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-between px-4 py-2.5 rounded-xl cursor-pointer transition-colors ${isActive ? 'text-slate-800 dark:text-white font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
        >
          <div className="flex items-center gap-3 font-semibold text-[13px] tracking-wide">
            <span className={isActive ? 'text-[#10b981] dark:text-[#DBFF00]' : ''}>{item.icon}</span>
            {item.label}
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${isOpen ? '' : '-rotate-90'}`}><polyline points="6 9 12 15 18 9"/></svg>
        </div>
        {isOpen && (
          <div className="ml-[1.35rem] mt-1 mb-2 flex flex-col border-l border-slate-200 dark:border-slate-700/50">
            {item.subItems.map(sub => {
              const isSubActive = pathname === sub.path;
              return (
                <div
                  key={sub.path}
                  onClick={() => router.push(sub.path)}
                  className={`px-4 py-2 text-[12px] cursor-pointer rounded-r-xl transition-all font-semibold ${isSubActive ? 'bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white border-l-2 border-[#10b981] dark:border-[#DBFF00] -ml-[1px]' : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  {sub.label}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      onClick={() => router.push(item.path)}
      className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer mb-2 transition-all text-[13px] font-semibold tracking-wide ${isActive ? 'bg-[#10b981] dark:bg-[#10b981] text-white shadow-[0_4px_12px_rgba(16,185,129,0.2)] dark:shadow-none' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-slate-200'}`}
    >
      <div className="flex items-center gap-3">
        {item.key !== 'dashboard' && item.icon}
        {item.label}
      </div>
      {item.key === 'dashboard' && (
        <div className={isActive ? 'text-white' : 'text-slate-400'}>
          {item.icon}
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ role }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  return (
    <div className="app-sidebar bg-white dark:bg-[#0f172a] border-r border-slate-100 dark:border-slate-800/60 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="h-[70px] shrink-0 flex items-center justify-between px-6">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/admin/dashboard')}>
          <div className="w-6 h-6 rounded bg-[#10b981] flex items-center justify-center text-white font-black text-sm">H</div>
          <span className="font-extrabold text-slate-900 dark:text-white tracking-tight text-[15px]">HRDashboard</span>
        </div>
        <button className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/></svg>
        </button>
      </div>

      {/* Nav Items */}
      <div className="flex-1 overflow-y-auto px-4 py-2 no-scrollbar">
        {NAV_ITEMS.map(item => <NavItem key={item.key} item={item} pathname={pathname} router={router} />)}
      </div>

      {/* Footer Tools */}
      <div className="p-4 flex flex-col gap-1 shrink-0 bg-white dark:bg-[#0f172a]">
        <div className="flex items-center justify-between px-4 py-2.5 rounded-xl cursor-pointer text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-white transition-colors">
          <div className="flex items-center gap-3 text-[13px] font-semibold tracking-wide">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            Help Center
          </div>
          <span className="w-5 h-5 flex items-center justify-center bg-[#ef4444] text-white text-[10px] font-bold rounded-full">8</span>
        </div>
        
        <div 
          onClick={() => router.push('/admin/settings')}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer text-[13px] font-semibold tracking-wide text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-white transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          Setting
        </div>
        
        <div 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 mt-1 rounded-xl cursor-pointer text-[13px] font-semibold tracking-wide text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
          Logout
        </div>

        {/* Theme Toggle matching design */}
        <div className="mt-4 px-2 mb-2">
          <div className="bg-[#f8fafc] dark:bg-[#1e293b] rounded-full p-1 flex items-center justify-between relative border border-slate-100 dark:border-slate-800">
            <button onClick={() => document.documentElement.classList.remove('dark')} className="flex-1 flex items-center justify-center gap-2 py-2 z-10 text-[11px] font-bold text-slate-800 dark:text-slate-400 group relative">
              <div className="absolute inset-0 bg-white dark:bg-transparent rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-none transition-all duration-300 -z-10 group-hover:bg-white"></div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              Light
            </button>
            <button onClick={() => document.documentElement.classList.add('dark')} className="flex-1 flex items-center justify-center gap-2 py-2 z-10 text-[11px] font-bold text-slate-400 dark:text-white group relative">
              <div className="absolute inset-0 bg-transparent dark:bg-[#0f172a] rounded-full shadow-none dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)] transition-all duration-300 -z-10 group-hover:bg-slate-200/50 dark:group-hover:bg-[#0f172a]"></div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              Dark
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

