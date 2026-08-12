'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

function StarRating({ value }) {
  return (
    <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} style={{ fontSize: '18px', color: s <= Math.round(value) ? '#f59e0b' : 'var(--border-main)' }}>★</span>
      ))}
      <span style={{ fontSize: '13px', color: 'var(--text-light)', marginLeft: '6px', fontWeight: '600' }}>
        {value}/5
      </span>
    </div>
  );
}

function Badge({ status }) {
  const map = {
    DRAFT: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
    SUBMITTED: 'bg-blue-50 text-blue-500 dark:bg-blue-900/30 dark:text-blue-400',
    ACKNOWLEDGED: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    IN_PROGRESS: 'bg-orange-50 text-orange-500 dark:bg-orange-900/30 dark:text-orange-400',
  };
  const classes = map[status] || map.DRAFT;
  return (
    <span className={`${classes} px-3 py-1 rounded-full text-[11px] font-bold`}>
      {status}
    </span>
  );
}

function getStatusBorderClass(status) {
  if (status === 'ACKNOWLEDGED') return 'border-green-200 dark:border-green-900/50';
  if (status === 'SUBMITTED') return 'border-blue-200 dark:border-blue-900/50';
  return 'border-[var(--border-main)]';
}

function getStatusHeaderBgClass(status) {
  if (status === 'ACKNOWLEDGED') return 'bg-green-50 dark:bg-green-900/10';
  if (status === 'SUBMITTED') return 'bg-blue-50 dark:bg-blue-900/10';
  return 'bg-[var(--bg-app)]';
}

export default function EmployeePerformancePage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [comment, setComment] = useState('');
  const [acknowledging, setAcknowledging] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchReviews = async () => {
      try {
        const res = await api.get('/api/performance/my');
        if (active) {
          setReviews(res.data?.data?.content || []);
          setLoading(false);
        }
      } catch {
        if (active) {
          toast.error('Failed to load performance reviews');
          setLoading(false);
        }
      }
    };
    fetchReviews();
    return () => { active = false; };
  }, []);

  const handleAcknowledge = async (reviewId) => {
    if (!comment.trim()) {
      toast.error('Please add your comments before acknowledging');
      return;
    }
    setAcknowledging(true);
    try {
      await api.put(`/api/performance/${reviewId}/acknowledge`, {
        employeeComments: comment,
      });
      toast.success('Review acknowledged successfully!');
      setComment('');
      setSelected(null);
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to acknowledge');
    } finally {
      setAcknowledging(false);
    }
  };

  const pendingCount = reviews.filter(r => r.status !== 'ACKNOWLEDGED').length;

  const renderContent = () => {
    if (loading) {
      return <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-lighter)' }}>Loading...</div>;
    }
    if (reviews.length === 0) {
      return (
        <div style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '80px', textAlign: 'center', border: '1px solid var(--border-main)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⭐</div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '8px' }}>
            No performance reviews yet
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-lighter)' }}>
            Your manager will create a review for you
          </div>
        </div>
      );
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {reviews.map((r) => (
          <div key={r.id} className={`bg-[var(--bg-card)] rounded-[14px] border-[2px] ${getStatusBorderClass(r.status)} shadow-sm overflow-hidden`}>
            {/* Review Header */}
            <div className={`px-5 py-4 border-b border-[var(--border-main)] flex justify-between items-center ${getStatusHeaderBgClass(r.status)}`}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '4px' }}>
                  {r.reviewPeriod}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-lighter)' }}>
                  Reviewed by: <strong style={{ color: '#374151' }}>{r.reviewerName}</strong> · {r.reviewDate}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-lighter)', marginBottom: '4px' }}>Overall Rating</div>
                  <StarRating value={r.overallRating} />
                </div>
                <Badge status={r.status} />
              </div>
            </div>

            {/* Ratings Grid */}
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginBottom: '20px' }}>
                {[
                  { label: 'Technical', value: r.technicalSkills, color: '#3b82f6' },
                  { label: 'Communication', value: r.communication, color: '#8b5cf6' },
                  { label: 'Teamwork', value: r.teamwork, color: '#16a34a' },
                  { label: 'Productivity', value: r.productivity, color: '#f59e0b' },
                  { label: 'Leadership', value: r.leadership, color: '#ec4899' },
                ].map(s => (
                  <div key={s.label} style={{ background: 'var(--bg-app)', borderRadius: '10px', padding: '12px', border: '1px solid var(--border-main)', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-light)', marginBottom: '6px', fontWeight: '600' }}>{s.label}</div>
                    <div style={{ fontSize: '22px', fontWeight: '900', color: s.color, marginBottom: '4px' }}>{s.value}</div>
                    <div style={{ height: '4px', background: 'var(--border-main)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(s.value / 5) * 100}%`, background: s.color, borderRadius: '2px' }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Feedback Sections */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                {[
                  { label: '💪 Strengths', value: r.strengths, textClass: 'text-green-600 dark:text-green-400', bgClass: 'bg-green-50 dark:bg-green-900/10 border-green-600/30 dark:border-green-400/20' },
                  { label: '📈 Improvements', value: r.improvements, textClass: 'text-orange-500 dark:text-orange-400', bgClass: 'bg-orange-50 dark:bg-orange-900/10 border-orange-500/30 dark:border-orange-400/20' },
                  { label: '🎯 Goals', value: r.goals, textClass: 'text-blue-500 dark:text-blue-400', bgClass: 'bg-blue-50 dark:bg-blue-900/10 border-blue-500/30 dark:border-blue-400/20' },
                ].map(d => d.value && (
                  <div key={d.label} className={`${d.bgClass} rounded-[10px] p-[14px] border`}>
                    <div className={`text-xs font-bold ${d.textClass} mb-2`}>{d.label}</div>
                    <div className="text-[13px] text-gray-700 dark:text-gray-300 leading-relaxed">{d.value}</div>
                  </div>
                ))}
              </div>

              {/* Employee Comments (if acknowledged) */}
              {r.employeeComments && (
                <div className="bg-green-50 dark:bg-green-900/10 rounded-[10px] p-[14px] border border-green-200 dark:border-green-900/50 mb-4">
                  <div className="text-[12px] font-bold text-green-600 dark:text-green-400 mb-[6px]">
                    💬 Your Comments
                  </div>
                  <div className="text-[13px] text-gray-700 dark:text-gray-300 leading-[1.6]">
                    {r.employeeComments}
                  </div>
                </div>
              )}

              {/* Acknowledge Section */}
              {r.status === 'SUBMITTED' && (
                <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-4 border border-blue-200 dark:border-blue-900/50">
                  <div className="text-[14px] font-bold text-slate-800 dark:text-blue-100 mb-1">
                    📝 Acknowledge This Review
                  </div>
                  <div className="text-[12px] text-[var(--text-light)] mb-3">
                    Add your comments and acknowledge to complete the review process
                  </div>

                  {selected === r.id ? (
                    <>
                      <textarea
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        placeholder="Add your comments about this review... (e.g. Thank you for the feedback, I will work on improving my communication skills)"
                        rows={4}
                        className="w-full p-3 border-[1.5px] border-blue-200 dark:border-blue-900/50 rounded-[10px] text-[13px] outline-none resize-y mb-3 bg-[var(--bg-card)] text-[var(--text-main)] focus:border-blue-500"
                      />
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => handleAcknowledge(r.id)}
                          disabled={acknowledging}
                          className="flex-1 p-3 bg-[var(--bg-sidebar)] text-white border-none rounded-[10px] text-[14px] font-bold cursor-pointer disabled:opacity-70 hover:opacity-90"
                        >
                          {acknowledging ? '⏳ Acknowledging...' : '✓ Acknowledge Review'}
                        </button>
                        <button
                          onClick={() => { setSelected(null); setComment(''); }}
                          className="px-5 py-3 bg-[var(--bg-card)] text-[var(--text-main)] border-[1.5px] border-[var(--border-main)] rounded-[10px] text-[13px] font-bold cursor-pointer hover:bg-[var(--bg-app)]"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={() => setSelected(r.id)}
                      className="px-6 py-2.5 bg-[var(--bg-sidebar)] text-white border-none rounded-[10px] text-[13px] font-bold cursor-pointer hover:opacity-90"
                    >
                      ✍️ Add Comments & Acknowledge
                    </button>
                  )}
                </div>
              )}

              {/* Already acknowledged message */}
              {r.status === 'ACKNOWLEDGED' && (
                <div className="bg-green-50 dark:bg-green-900/10 rounded-[10px] px-4 py-3 border border-green-200 dark:border-green-900/50 flex items-center gap-2.5">
                  <span style={{ fontSize: '20px' }}>✅</span>
                  <span className="text-[13px] text-green-600 dark:text-green-400 font-bold">
                    You have acknowledged this review
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          My Performance Reviews
          {pendingCount > 0 && (
            <span style={{ background: '#f59e0b', color: 'white', borderRadius: '20px', padding: '2px 10px', fontSize: '13px', fontWeight: '700' }}>
              {pendingCount} pending
            </span>
          )}
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-lighter)' }}>
          View your performance reviews and acknowledge them
        </p>
      </div>

      {renderContent()}
    </div>
  );
}