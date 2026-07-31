'use client';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getAllEmployees } from '@/lib/adminApi';
import toast from 'react-hot-toast';
import { Search, ChevronDown, Download, Plus, X, Calendar, Edit, Eye, MoreHorizontal, Settings, HelpCircle } from 'lucide-react';

function Badge({ status }) {
  const map = {
    ACTIVE: { bg: 'bg-emerald-100 dark:bg-emerald-500/10', color: 'text-emerald-500', label: 'ACTIVE' },
    ON_BOARDING: { bg: 'bg-amber-100 dark:bg-amber-500/10', color: 'text-amber-500', label: 'ON BOARDING' },
    PROBATION: { bg: 'bg-fuchsia-100 dark:bg-fuchsia-500/10', color: 'text-fuchsia-500', label: 'PROBATION' },
    ON_LEAVE: { bg: 'bg-rose-100 dark:bg-rose-500/10', color: 'text-rose-500', label: 'ON LEAVE' },
    INACTIVE: { bg: 'bg-slate-100 dark:bg-slate-800', color: 'text-slate-500', label: 'INACTIVE' },
  };
  const s = map[status] || map.ACTIVE;
  return (
    <span className={`${s.bg} ${s.color} px-2.5 py-1 rounded-full text-[9px] font-black tracking-wider flex items-center justify-center w-fit mx-auto`}>
      {s.label}
    </span>
  );
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSlideOutOpen, setIsSlideOutOpen] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await getAllEmployees(0, 10);
        if (res.data?.data?.content) {
          // Add dummy statuses for visual demonstration
          const data = res.data.data.content.map((e, i) => ({
            ...e,
            empStatus: i === 1 ? 'ON_BOARDING' : i === 2 ? 'PROBATION' : i === 3 ? 'ON_LEAVE' : 'ACTIVE',
            account: i === 2 || i === 3 ? 'Need Invitation' : 'Activated'
          }));
          setEmployees(data);
        }
      } catch (err) {
        toast.error('Failed to load employees');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <div className="relative h-full flex flex-col">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-[26px] font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">
            Employees
          </h1>
          <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400">
            Manage your Employee
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-[13px] font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Download className="w-4 h-4" /> Download
          </button>
          <button 
            onClick={() => setIsSlideOutOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#0f172a] dark:bg-[#10b981] rounded-xl text-[13px] font-bold text-white shadow-md shadow-slate-900/10 dark:shadow-emerald-900/20 hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" /> Add New
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 flex-1 shadow-sm">
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search employee" className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 rounded-xl text-[13px] focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-700 dark:text-white placeholder:text-slate-400" />
          </div>
          
          <div className="flex w-full md:w-auto items-center gap-3">
            {['All Offices', 'All Job Titles', 'All Status'].map(filter => (
              <div key={filter} className="flex-1 md:flex-none border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl px-4 py-2.5 text-[12px] font-semibold text-slate-600 dark:text-slate-300 flex items-center justify-between gap-6 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 relative group">
                {filter} <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800/60">
                <th className="py-4 px-4"><input type="checkbox" className="rounded border-slate-300 dark:border-slate-600 text-emerald-500 focus:ring-emerald-500 bg-transparent" /></th>
                <th className="py-4 px-2 font-semibold text-[11px] text-slate-400 tracking-wider">Employee Name ↕</th>
                <th className="py-4 px-2 font-semibold text-[11px] text-slate-400 tracking-wider">Job Title ↕</th>
                <th className="py-4 px-2 font-semibold text-[11px] text-slate-400 tracking-wider">Line Manager ↕</th>
                <th className="py-4 px-2 font-semibold text-[11px] text-slate-400 tracking-wider">Department ↕</th>
                <th className="py-4 px-2 font-semibold text-[11px] text-slate-400 tracking-wider">Office ↕</th>
                <th className="py-4 px-2 font-semibold text-[11px] text-slate-400 tracking-wider text-center">Employee Status ↕</th>
                <th className="py-4 px-2 font-semibold text-[11px] text-slate-400 tracking-wider text-center">Account ↕</th>
                <th className="py-4 px-4 font-semibold text-[11px] text-slate-400 tracking-wider text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="9" className="text-center py-10 text-slate-500">Loading employees...</td></tr>
              ) : (
                employees.map((emp, i) => (
                  <tr key={emp.id || i} className="border-b border-slate-50 dark:border-slate-800/30 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="py-4 px-4"><input type="checkbox" className="rounded border-slate-300 dark:border-slate-600 text-emerald-500 focus:ring-emerald-500 bg-transparent" /></td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                          {emp.name.substring(0,2).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-[13px] font-bold text-slate-800 dark:text-slate-100">{emp.name}</div>
                          <div className="text-[11px] text-slate-400">{emp.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-[13px] font-semibold text-slate-600 dark:text-slate-300">{emp.department || 'UI UX Designer'}</td>
                    <td className="py-4 px-2 text-[13px] font-semibold text-slate-500">@Manager</td>
                    <td className="py-4 px-2 text-[13px] font-semibold text-slate-500">Team Product</td>
                    <td className="py-4 px-2 text-[13px] font-semibold text-slate-500">Unpixel Office</td>
                    <td className="py-4 px-2"><Badge status={emp.empStatus} /></td>
                    <td className="py-4 px-2 text-[13px] font-semibold text-center text-slate-500">{emp.account}</td>
                    <td className="py-4 px-4 text-center">
                      <div className="w-7 h-7 rounded bg-emerald-500 flex items-center justify-center text-white mx-auto cursor-pointer shadow shadow-emerald-500/20 hover:bg-emerald-600 transition-colors">
                        <Eye className="w-3.5 h-3.5" />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="mt-6 flex items-center gap-2">
           <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 bg-white dark:bg-slate-800">&lt;</button>
           <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#0f172a] text-white text-[12px] font-bold shadow-md">1</button>
           <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-400 text-[12px] font-bold hover:bg-slate-50 dark:hover:bg-slate-800">2</button>
           <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-400 text-[12px] font-bold hover:bg-slate-50 dark:hover:bg-slate-800">3</button>
           <span className="text-slate-400 text-sm tracking-widest">...</span>
           <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-400 text-[12px] font-bold hover:bg-slate-50 dark:hover:bg-slate-800">10</button>
           <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 bg-white dark:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300">&gt;</button>
        </div>
      </div>

      {/* Slide-out Form Drawer */}
      {isSlideOutOpen && (
        <>
          <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity" onClick={() => setIsSlideOutOpen(false)}></div>
          <div className="fixed top-0 right-0 bottom-0 w-full md:w-[400px] bg-white dark:bg-slate-900 shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
            
            <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-10 h-10 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-lg cursor-pointer text-slate-700 dark:text-slate-200 z-50" onClick={() => setIsSlideOutOpen(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </div>

            <div className="p-8 flex-1 overflow-y-auto">
              <h2 className="text-[22px] font-extrabold text-slate-900 dark:text-white tracking-tight mb-8">Add New Profile</h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 mb-2">First Name <span className="text-red-500">*</span></label>
                  <input type="text" className="w-full px-4 py-3 border border-red-400 dark:border-red-500/50 bg-white dark:bg-slate-800 rounded-xl text-[13px] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-red-400" />
                  <p className="text-[11px] text-red-500 mt-2 flex items-center gap-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> This field is required.</p>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 mb-2">Last Name <span className="text-red-500">*</span></label>
                  <input type="text" defaultValue="Candra" className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-[13px] font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 mb-2">Email Address <span className="text-red-500">*</span></label>
                  <input type="email" defaultValue="pristia@gmail.com" className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-[13px] font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-slate-700 dark:text-slate-300 mb-2">Join Date <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input type="text" defaultValue="23 Mar 2023" className="w-full pl-4 pr-10 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-[13px] font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex gap-3">
              <button onClick={() => setIsSlideOutOpen(false)} className="flex-1 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-[13px] font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                Cancel
              </button>
              <button onClick={() => setIsSlideOutOpen(false)} className="flex-1 py-3 bg-[#0f172a] dark:bg-[#10b981] rounded-xl text-[13px] font-bold text-white shadow-lg shadow-slate-900/10 dark:shadow-emerald-900/20 hover:opacity-90 transition-opacity">
                Create
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
