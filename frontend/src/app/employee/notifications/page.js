'use client';
import { useState, useEffect, useCallback } from 'react';
import { getMyNotifications, getUnreadCount, markNotificationRead } from '@/lib/employeeApi';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

const TYPE_META = {
  LEAVE_APPLIED: { icon: '🌴', bgClass: 'bg-green-50 dark:bg-green-900/30', textClass: 'text-green-600 dark:text-green-400' },
  LEAVE_APPROVED: { icon: '🌴', bgClass: 'bg-green-100 dark:bg-green-900/50', textClass: 'text-green-600 dark:text-green-400' },
  LEAVE_REJECTED: { icon: '🌴', bgClass: 'bg-red-50 dark:bg-red-900/30', textClass: 'text-red-600 dark:text-red-400' },
  LEAVE_CANCELLED: { icon: '🌴', bgClass: 'bg-slate-100 dark:bg-slate-800', textClass: 'text-slate-500 dark:text-slate-400' },
  ATTENDANCE_REMINDER: { icon: '📅', bgClass: 'bg-blue-50 dark:bg-blue-900/30', textClass: 'text-blue-500 dark:text-blue-400' },
  PAYROLL_GENERATED: { icon: '💰', bgClass: 'bg-yellow-50 dark:bg-yellow-900/30', textClass: 'text-yellow-600 dark:text-yellow-500' },
  PERFORMANCE_REVIEWED: { icon: '⭐', bgClass: 'bg-indigo-50 dark:bg-indigo-900/30', textClass: 'text-indigo-500 dark:text-indigo-400' },
  TRAINING_ENROLLED: { icon: '📚', bgClass: 'bg-blue-50 dark:bg-blue-900/30', textClass: 'text-blue-500 dark:text-blue-400' },
  TRAINING_COMPLETED: { icon: '📚', bgClass: 'bg-green-100 dark:bg-green-900/50', textClass: 'text-green-600 dark:text-green-400' },
  ONBOARDING_INITIATED: { icon: '👋', bgClass: 'bg-indigo-50 dark:bg-indigo-900/30', textClass: 'text-indigo-500 dark:text-indigo-400' },
  DOCUMENT_UPLOADED: { icon: '📄', bgClass: 'bg-blue-50 dark:bg-blue-900/30', textClass: 'text-blue-500 dark:text-blue-400' },
  DOCUMENT_APPROVED: { icon: '✅', bgClass: 'bg-green-100 dark:bg-green-900/50', textClass: 'text-green-600 dark:text-green-400' },
  DOCUMENT_REJECTED: { icon: '⚠️', bgClass: 'bg-red-50 dark:bg-red-900/30', textClass: 'text-red-600 dark:text-red-400' },
  CHECKLIST_COMPLETED: { icon: '🎉', bgClass: 'bg-green-100 dark:bg-green-900/50', textClass: 'text-green-600 dark:text-green-400' },
  JOB_APPLICATION: { icon: '💼', bgClass: 'bg-indigo-50 dark:bg-indigo-900/30', textClass: 'text-indigo-500 dark:text-indigo-400' },
  GENERAL: { icon: '🔔', bgClass: 'bg-slate-100 dark:bg-slate-800', textClass: 'text-slate-500 dark:text-slate-400' },
};

function getMeta(n) {
  return TYPE_META[n.type] || TYPE_META.GENERAL;
}

function formatTimeAgo(dateStr, now) {
  if (!dateStr) return '';
  const diff = now - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [markingAll, setMarkingAll] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const [notifRes, unreadRes] = await Promise.allSettled([
        filter === 'UNREAD'
          ? api.get(`/api/notifications/unread?page=${page}&size=10`)
          : getMyNotifications(page, 10),
        getUnreadCount(),
      ]);

      if (notifRes.status === 'fulfilled') {
        const data = notifRes.value.data?.data;
        setNotifications(data?.content || []);
        setTotalPages(data?.totalPages || 0);
      }
      if (unreadRes.status === 'fulfilled') {
        setUnreadCount(unreadRes.value.data?.data || 0);
      }
    } catch (err) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, [filter, page]);

  useEffect(() => {
    const timer = setTimeout(() => { fetchNotifications(); }, 0);
    return () => clearTimeout(timer);
  }, [fetchNotifications]);

  const handleMarkRead = async (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
    try {
      await markNotificationRead(id);
    } catch (err) {
      toast.error('Failed to mark as read');
      fetchNotifications();
    }
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    try {
      await api.put('/api/notifications/mark-all-read');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success('All caught up!');
    } catch (err) {
      toast.error('Failed to mark all as read');
    } finally {
      setMarkingAll(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span style={{
                background: '#4f46e5', color: 'white',
                borderRadius: '20px', padding: '3px 12px',
                fontSize: '12px', fontWeight: '700',
              }}>
                {unreadCount} unread
              </span>
            )}
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-lighter)' }}>
            Stay updated with your latest alerts and activities.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={markingAll}
            className="px-5 py-[11px] bg-[var(--bg-card)] text-[var(--text-main)] border-[1.5px] border-[var(--border-main)] rounded-[10px] text-[13px] font-bold whitespace-nowrap disabled:cursor-not-allowed hover:bg-[var(--bg-app)] transition-colors"
          >
            {markingAll ? 'Marking...' : '✓ Mark all as read'}
          </button>
        )}
      </div>

      <div style={{
        display: 'flex', gap: '6px', marginBottom: '20px',
        background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-main)',
        padding: '6px', width: 'fit-content', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      }}>
        {['ALL', 'UNREAD'].map(f => (
          <button
            key={f}
            onClick={() => { setFilter(f); setPage(0); }}
            style={{
              padding: '9px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              fontSize: '13px', fontWeight: '700',
              background: filter === f ? '#4f46e5' : 'transparent',
              color: filter === f ? 'white' : 'var(--text-light)',
              transition: 'all 0.15s',
            }}
          >
            {f === 'ALL' ? 'All Notifications' : `Unread${unreadCount ? ` (${unreadCount})` : ''}`}
          </button>
        ))}
      </div>

      <div style={{ background: 'var(--bg-card)', borderRadius: '14px', border: '1px solid var(--border-main)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '70px', textAlign: 'center', color: 'var(--text-lighter)', fontSize: '14px' }}>
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ padding: '80px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '44px', marginBottom: '14px' }}>🔔</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '6px' }}>
              {filter === 'UNREAD' ? "You're all caught up!" : 'No notifications yet'}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-lighter)' }}>
              {filter === 'UNREAD'
                ? 'No unread notifications right now.'
                : 'Updates and alerts will appear here.'}
            </div>
            {filter === 'UNREAD' && (
              <button
                onClick={() => setFilter('ALL')}
                style={{ marginTop: '18px', padding: '10px 22px', background: 'var(--bg-sidebar)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
              >
                View all notifications
              </button>
            )}
          </div>
        ) : (
          <>
            {notifications.map((n, i) => {
              const meta = getMeta(n);
              return (
                <div
                  key={n.id}
                  onClick={() => { if (!n.read) handleMarkRead(n.id); }}
                  className={`flex gap-4 items-start p-[18px] sm:px-[22px] ${n.read ? 'cursor-default bg-[var(--bg-card)]' : 'cursor-pointer bg-indigo-50/50 dark:bg-indigo-900/20'} ${i === 0 ? '' : 'border-t border-[var(--border-main)]'} hover:bg-[var(--bg-app)] transition-colors duration-150`}
                >
                  <div className={`w-11 h-11 flex-shrink-0 rounded-xl flex items-center justify-center text-xl ${meta.bgClass}`}>
                    {meta.icon}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '15px', fontWeight: n.read ? '600' : '800', color: 'var(--text-main)' }}>
                        {n.title}
                      </span>
                      {!n.read && (
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4f46e5', flexShrink: 0 }} />
                      )}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-light)', lineHeight: '1.5', marginBottom: '6px' }}>
                      {n.message}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-lighter)' }}>
                      {formatTimeAgo(n.createdAt, now)}
                    </div>
                  </div>

                  {!n.read && (
                    <button
                      onClick={e => { e.stopPropagation(); handleMarkRead(n.id); }}
                      className="flex-shrink-0 px-4 py-[7px] bg-[var(--bg-card)] text-indigo-600 dark:text-indigo-400 border-[1.5px] border-indigo-500/20 rounded-lg text-xs font-bold whitespace-nowrap hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                    >
                      Mark read
                    </button>
                  )}
                </div>
              );
            })}

            {totalPages > 1 && (
              <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', borderTop: '1px solid var(--border-main)' }}>
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  style={{ padding: '7px 16px', border: '1.5px solid var(--border-main)', borderRadius: '8px', fontSize: '12px', fontWeight: '700', color: page === 0 ? 'var(--border-dark)' : 'var(--text-main)', background: 'var(--bg-card)', cursor: page === 0 ? 'not-allowed' : 'pointer' }}
                >← Prev</button>
                <span style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: '600' }}>
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  style={{ padding: '7px 16px', border: '1.5px solid var(--border-main)', borderRadius: '8px', fontSize: '12px', fontWeight: '700', color: page >= totalPages - 1 ? 'var(--border-dark)' : 'var(--text-main)', background: 'var(--bg-card)', cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer' }}
                >Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}