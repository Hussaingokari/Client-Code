'use client';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { getAllEmployees } from '@/lib/adminApi';
import toast from 'react-hot-toast';
import { Users, Briefcase, Plus, Minus, Search, ChevronDown } from 'lucide-react';

function StatCard({ icon, value, label, trend, isPositive }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-6">
        <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
          {icon}
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-3xl font-bold text-slate-800 dark:text-white mb-1">{value}</div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</div>
        </div>
        <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'}`}>
          {isPositive ? '↗' : '↘'} {trend}
        </div>
      </div>
    </div>
  );
}

function SkeletonDashboard() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-48 mb-2"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-64 mb-8"></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="col-span-1 lg:col-span-2 grid grid-cols-2 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 h-[140px]">
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full mb-6"></div>
              <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded w-24 mb-2"></div>
              <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-32"></div>
            </div>
          ))}
        </div>
        <div className="col-span-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 min-h-[300px]">
          <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded w-40 mb-8"></div>
          <div className="h-40 bg-slate-100 dark:bg-slate-800 rounded-lg w-full"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5">
           <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded w-32 mb-6"></div>
           {[1,2,3].map(i => <div key={i} className="h-10 bg-slate-100 dark:bg-slate-800 rounded w-full mb-3"></div>)}
        </div>
        <div className="col-span-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5">
           <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded w-32 mb-6"></div>
           <div className="w-48 h-48 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user } = useSelector(s => s.auth);
  const router = useRouter();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const empRes = await getAllEmployees(0, 5); // Just fetch 5 for dashboard
        if (empRes.data?.data?.content) {
          setEmployees(empRes.data.data.content);
        }
      } catch (err) {
        toast.error('Failed to load dashboard data');
      } finally {
        setTimeout(() => setLoading(false), 800); // Slight delay to show skeleton
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return <SkeletonDashboard />;
  }

  return (
    <div>
      <h1 className="text-[26px] font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">
        Hi, {user?.name?.split(' ')[0] || 'Admin'}
      </h1>
      <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400 mb-8">
        This is your HR report so far
      </p>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* Left Stats Grid */}
        <div className="col-span-1 xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard icon={<Users className="w-5 h-5"/>} value="3,540" label="Total Employees" trend="+25.5%" isPositive={true} />
          <StatCard icon={<Briefcase className="w-5 h-5"/>} value="1,150" label="Job Applicants" trend="+4.10%" isPositive={true} />
          <StatCard icon={<Plus className="w-5 h-5"/>} value="500" label="New Employees" trend="+5.1%" isPositive={true} />
          <StatCard icon={<Minus className="w-5 h-5"/>} value="93" label="-25.5%" trend="-25.5%" isPositive={false} />
        </div>

        {/* Right Chart Placeholder (Team Performance) */}
        <div className="col-span-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-[16px] font-bold text-slate-800 dark:text-white">Team Performance</h3>
            <button className="text-[11px] font-bold text-slate-500 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1 flex items-center gap-1">
              Last 7 month <ChevronDown className="w-3 h-3" />
            </button>
          </div>
          
          <div className="flex gap-4 mb-4">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500"><span className="w-2 h-2 rounded-full bg-[#10b981]"></span> Project Team</div>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500"><span className="w-2 h-2 rounded-full bg-yellow-400"></span> Product Team</div>
          </div>

          {/* Dummy Chart Visuals */}
          <div className="h-40 relative flex items-end justify-between px-2 pb-6 pt-4 border-l border-b border-slate-100 dark:border-slate-800/50 mt-4">
            <svg viewBox="0 0 100 40" className="absolute inset-0 w-full h-full preserve-aspect-none" preserveAspectRatio="none">
              <path d="M0 30 Q10 20, 20 25 T40 15 T60 20 T80 5 T100 20" fill="none" stroke="#10b981" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
              <path d="M0 35 Q15 25, 25 30 T45 25 T65 20 T85 30 T100 15" fill="none" stroke="#fbbf24" strokeWidth="2" vectorEffect="non-scaling-stroke"/>
              <circle cx="60" cy="20" r="1.5" fill="#10b981" stroke="white" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
            </svg>
            <div className="absolute left-0 top-0 text-[9px] text-slate-400 -translate-x-full pr-2">60k</div>
            <div className="absolute left-0 top-[25%] text-[9px] text-slate-400 -translate-x-full pr-2">50k</div>
            <div className="absolute left-0 top-[50%] text-[9px] text-slate-400 -translate-x-full pr-2">40k</div>
            <div className="absolute left-0 top-[75%] text-[9px] text-slate-400 -translate-x-full pr-2">30k</div>
            
            {['Jan','Feb','Mar','Apr','May','Jun','Jul'].map(m => (
              <span key={m} className="text-[9px] font-semibold text-slate-400 absolute bottom-0 translate-y-full mt-2" style={{left: `${['Jan','Feb','Mar','Apr','May','Jun','Jul'].indexOf(m)*16}%`}}>{m}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Employees Table */}
        <div className="col-span-1 xl:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[16px] font-bold text-slate-800 dark:text-white">Employees</h3>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search employee" className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-transparent dark:bg-slate-800 rounded-xl text-[12px] focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-700 dark:text-white placeholder:text-slate-400" />
            </div>
          </div>
          
          <div className="flex gap-3 mb-6">
            {['All Offices', 'All Job Titles', 'All Status'].map(filter => (
              <div key={filter} className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-4 py-2 text-[12px] font-semibold text-slate-600 dark:text-slate-300 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50">
                {filter} <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800/60">
                  <th className="py-3 px-4 font-semibold text-[11px] text-slate-400 tracking-wider">Employee Name ↕</th>
                  <th className="py-3 px-4 font-semibold text-[11px] text-slate-400 tracking-wider">Job Title ↕</th>
                  <th className="py-3 px-4 font-semibold text-[11px] text-slate-400 tracking-wider">Line Manager ↕</th>
                  <th className="py-3 px-4 font-semibold text-[11px] text-slate-400 tracking-wider">Department ↕</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id} className="border-b border-slate-50 dark:border-slate-800/30 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" className="rounded border-slate-300 dark:border-slate-700 text-emerald-500 focus:ring-emerald-500" />
                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                          {emp.name.substring(0,2).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-[13px] font-semibold text-slate-800 dark:text-slate-100">{emp.name}</div>
                          <div className="text-[11px] text-slate-400">{emp.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-[13px] font-medium text-slate-600 dark:text-slate-300">{emp.department || 'UI UX Designer'}</td>
                    <td className="py-4 px-4 text-[13px] font-medium text-slate-500">@Manager</td>
                    <td className="py-4 px-4 text-[13px] font-medium text-slate-500">Team Product</td>
                  </tr>
                ))}
                {employees.length === 0 && (
                  <tr><td colSpan="4" className="text-center py-6 text-sm text-slate-500">No employees found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Total Employee Donut Placeholder */}
        <div className="col-span-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 relative">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[16px] font-bold text-slate-800 dark:text-white">Total Employee</h3>
            <button className="text-[11px] font-bold text-slate-500 flex items-center gap-1">All Time <ChevronDown className="w-3 h-3" /></button>
          </div>
          <div className="relative w-48 h-48 mx-auto mt-4">
            {/* SVG Donut Mock */}
            <svg viewBox="0 0 36 36" className="w-full h-full rotate-[-90deg]">
              <path strokeDasharray="60, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" strokeWidth="4" />
              <path strokeDasharray="15, 100" strokeDashoffset="-60" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#3b82f6" strokeWidth="4" />
              <path strokeDasharray="20, 100" strokeDashoffset="-75" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#fbbf24" strokeWidth="4" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-800 dark:text-white leading-none">121</span>
              <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Total Emp.</span>
            </div>
          </div>
          
          <div className="mt-8 space-y-3">
            <div className="flex justify-between text-[12px] font-semibold"><div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#10b981]"></span><span className="text-slate-600 dark:text-slate-300">Others</span></div><span className="text-slate-800 dark:text-white font-bold">71</span></div>
            <div className="flex justify-between text-[12px] font-semibold"><div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#fbbf24]"></span><span className="text-slate-600 dark:text-slate-300">Onboarding</span></div><span className="text-slate-800 dark:text-white font-bold">27</span></div>
            <div className="flex justify-between text-[12px] font-semibold"><div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#3b82f6]"></span><span className="text-slate-600 dark:text-slate-300">Offboarding</span></div><span className="text-slate-800 dark:text-white font-bold">23</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
