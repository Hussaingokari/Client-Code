'use client';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import Image from "next/image";
import { User, ShieldCheck, ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 transition-colors duration-500">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/5 dark:bg-cyan-500/5 blur-[100px] sm:blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/5 dark:bg-cyan-500/5 blur-[100px] sm:blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-3xl mx-auto relative z-10 backdrop-blur-xl bg-slate-900/70 border border-cyan-400/25 px-14 pt-8 pb-12 rounded-[32px] shadow-[0_25px_80px_rgba(0,170,255,0.15)] flex flex-col items-center transition-all duration-500">

        <div className="relative flex justify-center items-center w-full mb-0">
          <div className="absolute w-60 h-60 rounded-full bg-cyan-500/5 blur-3xl"></div>
          <Image
  src="/logo/paxsat-logo.png"
  alt="PAXSAT Business Solutions Pvt Ltd"
  width={900}
  height={500}
  priority
  className="relative z-10 w-full max-w-[420px] h-auto object-contain transition-transform duration-500 hover:scale-[1.06] drop-shadow-[0_0_25px_rgba(0,180,255,.45)]"
/>
        </div>

        <div className="w-16 h-[2px] rounded-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent mt-1 mb-3"></div>

        <div className="flex flex-col items-center mb-4">
          <p className="text-base font-extrabold text-yellow-400 uppercase tracking-[0.45em] mb-3">
            WORKSPACE
          </p>
          <div className="flex items-center gap-2 text-[11px] text-cyan-400/70 font-medium uppercase tracking-widest">
            <span>Streamline</span>
            <span className="w-1 h-1 rounded-full bg-yellow-400"></span>
            <span>Manage</span>
            <span className="w-1 h-1 rounded-full bg-yellow-400"></span>
            <span>Empower</span>
          </div>
        </div>

        <div className="w-24 h-[2px] rounded-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent mb-5"></div>

        <p className="text-xs font-semibold text-cyan-400/80 mb-5 uppercase tracking-wider">Select Your Portal</p>

        <Link
          href="/login/employee"
          aria-label="Employee Portal"
          className="group w-full flex items-center gap-5 py-6 px-8 mb-4 rounded-[16px] border border-cyan-500/40 bg-slate-800/50 hover:bg-slate-800/70 hover:border-cyan-500/60 hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[0_0_45px_rgba(34,211,238,0.30)] focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          <div className="w-[72px] h-[72px] rounded-[14px] bg-slate-700/50 border border-yellow-400/40 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:border-yellow-300 group-hover:bg-slate-700/70 group-hover:scale-110">
            <User
              size={42}
              className="text-yellow-400 drop-shadow-[0_0_10px_rgba(255,215,0,.5)] transition-all duration-300 group-hover:scale-110"
            />
          </div>
          <div className="flex-1 text-left">
            <div className="text-xl font-bold text-white mb-0.5 group-hover:text-cyan-300 transition-colors">Employee Portal</div>
            <div className="text-base font-medium text-cyan-400/60">Access your personal dashboard</div>
          </div>
          <div className="w-14 h-14 rounded-full border border-cyan-500/40 flex items-center justify-center group-hover:border-cyan-500/60 transition-all">
            <ChevronRight
              size={28}
              className="text-cyan-400 transition-all duration-300 group-hover:text-cyan-300 group-hover:translate-x-1"
            />
          </div>
        </Link>

        <Link
          href="/login/admin"
          aria-label="HR Admin Portal"
          className="group w-full flex items-center gap-5 py-6 px-8 mb-8 rounded-[16px] border border-cyan-500/40 bg-slate-800/50 hover:bg-slate-800/70 hover:border-cyan-500/60 hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[0_0_45px_rgba(34,211,238,0.30)] focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          <div className="w-[72px] h-[72px] rounded-[14px] bg-slate-700/50 border border-yellow-400/40 flex items-center justify-center shrink-0 group-hover:border-yellow-300 group-hover:bg-slate-700/70 transition-all">
            <ShieldCheck
              size={42}
              className="text-yellow-400 drop-shadow-[0_0_10px_rgba(255,215,0,.5)] transition-all duration-300"
            />
          </div>
          <div className="flex-1 text-left">
            <div className="text-xl font-bold text-white mb-0.5 group-hover:text-cyan-300 transition-colors">HR / Admin Portal</div>
            <div className="text-base font-medium text-cyan-400/60">Manage system and personnel</div>
          </div>
          <div className="w-14 h-14 rounded-full border border-cyan-500/40 flex items-center justify-center group-hover:border-cyan-500/60 transition-all">
            <ChevronRight
              size={28}
              className="text-cyan-400 transition-all duration-300 group-hover:text-cyan-300 group-hover:translate-x-1"
            />
          </div>
        </Link>

        <div className="flex flex-col items-center mt-6 text-center">
          <p className="text-[10px] font-semibold text-cyan-300 uppercase tracking-wider">
            © 2026 PAXSAT BUSINESS SOLUTIONS PVT. LTD.
          </p>
          <p className="text-[9px] font-medium text-cyan-300/70 uppercase tracking-widest mt-1">
            All rights reserved.
          </p>
        </div>
      </div>

      <ThemeToggle />
    </div>
  );
}
