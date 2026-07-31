'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-900">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/20 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-purple-600/20 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="w-full max-w-md relative z-10 backdrop-blur-xl bg-white/10 border border-white/20 p-10 rounded-3xl shadow-2xl flex flex-col items-center transform transition-all duration-500 hover:scale-[1.01]">
        {/* Header */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 mb-6 relative group">
          <div className="absolute inset-0 bg-white/20 rounded-2xl blur-md group-hover:blur-lg transition-all"></div>
          <span className="text-white text-3xl font-black tracking-tight relative z-10">H</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-1 tracking-tight">HRMS</h1>
        <p className="text-xs font-bold text-blue-400 uppercase tracking-[0.2em] mb-2">Management System</p>
        <p className="text-sm text-slate-300 mb-8 text-center font-medium">Streamline · Manage · Empower</p>
        
        <p className="text-sm font-semibold text-slate-400 mb-6 w-full text-left uppercase tracking-wider">Select Portal</p>

        {/* Employee Card */}
        <Link
          href="/login/employee"
          className="group w-full flex items-center gap-5 p-5 mb-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-blue-400/50 transition-all duration-300 backdrop-blur-sm cursor-pointer shadow-lg hover:shadow-blue-500/20"
        >
          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 group-hover:bg-blue-500/30 transition-colors">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-blue-400 stroke-[2] stroke-linecap-round stroke-linejoin-round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div className="flex-1 text-left">
            <div className="text-base font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">Employee Portal</div>
            <div className="text-xs font-medium text-slate-400">Access your personal dashboard</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-500/20 group-hover:translate-x-1 transition-all">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-slate-400 group-hover:text-blue-400 stroke-[2.5] stroke-linecap-round stroke-linejoin-round"><path d="m9 18 6-6-6-6"/></svg>
          </div>
        </Link>

        {/* Admin Card */}
        <Link
          href="/login/admin"
          className="group w-full flex items-center gap-5 p-5 mb-8 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-emerald-400/50 transition-all duration-300 backdrop-blur-sm cursor-pointer shadow-lg hover:shadow-emerald-500/20"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/30 transition-colors">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-emerald-400 stroke-[2] stroke-linecap-round stroke-linejoin-round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <div className="flex-1 text-left">
            <div className="text-base font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">HR / Admin Portal</div>
            <div className="text-xs font-medium text-slate-400">Manage system and personnel</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:translate-x-1 transition-all">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-slate-400 group-hover:text-emerald-400 stroke-[2.5] stroke-linecap-round stroke-linejoin-round"><path d="m9 18 6-6-6-6"/></svg>
          </div>
        </Link>

        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">© 2025 HRMS. All rights reserved.</p>
      </div>
    </div>
  );
}