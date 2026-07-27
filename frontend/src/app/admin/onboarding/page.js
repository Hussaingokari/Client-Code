'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 1) return 'just now';
  if (hours < 24) return `about ${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

const ACTIVITY_ICON = {
  PENDING_SUMMARY: '⏳',
  DOCUMENT_UPLOADED: '📄',
  ONBOARDING_COMPLETED: '✅',
};

export default function OnboardingDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/onboarding/dashboard-summary');
      setData(res.data?.data);
    } catch (err) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  if (loading || !data) {
    return <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>Loading...</div>;
  }

  const STATS = [
    { label: 'Total Employees', value: data.totalEmployees, sub: 'All time', color: '#1e3a5f', bg: '#eef2ff', icon: '👥' },
    { label: 'Pending Onboarding', value: data.pendingOnboarding, sub: 'In progress', color: '#ca8a04', bg: '#fef9c3', icon: '⏰' },
    { label: 'Completed Onboarding', value: data.completedOnboarding, sub: 'Fully onboarded', color: '#16a34a', bg: '#dcfce7', icon: '✅' },
    { label: 'Pending Doc Verifications', value: data.pendingDocVerifications, sub: 'Awaiting review', color: '#dc2626', bg: '#fee2e2', icon: '📄' },
  ];

  const QUICK_ACTIONS = [
    { label: 'View Employees', route: '/admin/onboarding/employees' },
    { label: 'Review Documents', route: '/admin/onboarding/document-requests' },
    { label: 'View Checklists', route: '/admin/onboarding/checklist' },
    { label: 'Reports', route: '/admin/onboarding/reports' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1e293b', marginBottom: '4px' }}>
          HR Dashboard
        </h1>
        <p style={{ fontSize: '13px', color: '#94a3b8' }}>
          Welcome back. Here's your onboarding overview.
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
        {STATS.map((s, i) => (
          <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '18px', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>{s.label}</span>
              <div style={{ width: '30px', height: '30px', background: s.bg, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px' }}>{s.icon}</div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b', marginBottom: '4px' }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' }}>
        {/* Recent Activity */}
        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>
              📈 Recent Activity
            </div>
            <button
              onClick={() => router.push('/admin/onboarding/notifications')}
              style={{ background: 'none', border: 'none', color: '#4f46e5', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
              View all
            </button>
          </div>

          {data.recentActivity.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
              No recent activity yet.
            </div>
          ) : (
            data.recentActivity.map((item, i) => (
              <div key={i} style={{
                display: 'flex', gap: '12px', padding: '12px 8px',
                borderRadius: '8px',
                background: i === 0 ? '#f8fafc' : 'transparent',
              }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>
                  {ACTIVITY_ICON[item.type] || '📌'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>{item.title}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{item.description}</div>
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                  {timeAgo(item.timestamp)}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Actions */}
        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', marginBottom: '14px' }}>
            Quick Actions
          </div>
          {QUICK_ACTIONS.map((a, i) => (
            <button
              key={i}
              onClick={() => router.push(a.route)}
              style={{
                width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 14px', marginBottom: '8px',
                background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px',
                fontSize: '13px', fontWeight: '600', color: '#1e293b', cursor: 'pointer',
              }}>
              {a.label} <span>→</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}