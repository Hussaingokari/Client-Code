'use client';
import { useState, useEffect, useCallback } from 'react';
import { getAllEmployees } from '@/lib/adminApi';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

// ---------------------------------------------------------------------------
// THEME VARIABLES: Emerald Teal & Charcoal
// ---------------------------------------------------------------------------
function ThemeVars() {
  return (
    <style jsx global>{`
      :root {
        --bg-page: #f4f6f8;
        --bg-card: #ffffff;
        --bg-card-header: #f8fafc;
        --bg-hover: #f1f5f9;
        --bg-selected: #f0fdf4;
        --border-color: #e2e8f0;
        --border-color-light: #f1f5f9;
        --border-color-strong: #cbd5e1;
        --text-primary: #0f172a;
        --text-secondary: #475569;
        --text-muted: #94a3b8;
        
        /* Accent Colors */
        --accent-primary: #0d9488;       /* Teal 600 */
        --accent-primary-hover: #0f766e; /* Teal 700 */
        --accent-blue: #10b981;          /* Emerald 500 */
        --accent-blue-bg: #ecfdf5;
        
        --btn-secondary-bg: #f1f5f9;
        --btn-secondary-text: #334155;
        --shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);

        --badge-draft-bg: #f1f5f9;      --badge-draft-text: #64748b;
        --badge-submitted-bg: #e0f2fe;  --badge-submitted-text: #0284c7;
        --badge-ack-bg: #dcfce7;        --badge-ack-text: #15803d;
        --badge-progress-bg: #fef3c7;   --badge-progress-text: #b45309;
      }

      .dark {
        --bg-page: #090d16;
        --bg-card: #111827;
        --bg-card-header: #1f2937;
        --bg-hover: #1f2937;
        --bg-selected: #064e3b;
        --border-color: #1f2937;
        --border-color-light: #162032;
        --border-color-strong: #374151;
        --text-primary: #f9fafb;
        --text-secondary: #9ca3af;
        --text-muted: #6b7280;
        
        /* Accent Colors Dark */
        --accent-primary: #14b8a6;       /* Teal 500 */
        --accent-primary-hover: #2dd4bf; /* Teal 400 */
        --accent-blue: #34d399;          /* Emerald 400 */
        --accent-blue-bg: #064e3b;
        
        --btn-secondary-bg: #1f2937;
        --btn-secondary-text: #e5e7eb;
        --shadow-card: 0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -4px rgba(0, 0, 0, 0.5);

        --badge-draft-bg: #1f2937;      --badge-draft-text: #9ca3af;
        --badge-submitted-bg: #075985;  --badge-submitted-text: #7dd3fc;
        --badge-ack-bg: #064e3b;        --badge-ack-text: #6ee7b7;
        --badge-progress-bg: #78350f;   --badge-progress-text: #fde68a;
      }
    `}</style>
  );
}

function StarRating({ value }) {
  return (
    <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} style={{ fontSize: '14px', color: s <= Math.round(value) ? '#f59e0b' : 'var(--border-color-strong)' }}>★</span>
      ))}
      <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '4px' }}>{value}/5</span>
    </div>
  );
}

function Badge({ status }) {
  const map = {
    DRAFT: { bg: 'var(--badge-draft-bg)', color: 'var(--badge-draft-text)' },
    SUBMITTED: { bg: 'var(--badge-submitted-bg)', color: 'var(--badge-submitted-text)' },
    ACKNOWLEDGED: { bg: 'var(--badge-ack-bg)', color: 'var(--badge-ack-text)' },
    IN_PROGRESS: { bg: 'var(--badge-progress-bg)', color: 'var(--badge-progress-text)' },
  };
  const s = map[status] || { bg: 'var(--badge-draft-bg)', color: 'var(--badge-draft-text)' };
  return (
    <span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.3px', display: 'inline-block' }}>
      {status?.replace(/_/g, ' ')}
    </span>
  );
}

const EMPTY_FORM = {
  employeeId: '',
  reviewPeriod: 'Q2 2026',
  reviewDate: new Date().toISOString().split('T')[0],
  technicalSkills: 3,
  communication: 3,
  teamwork: 3,
  productivity: 3,
  leadership: 3,
  strengths: '',
  improvements: '',
  goals: '',
};

export default function PerformancePage() {
  const [reviews, setReviews] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [revRes, empRes] = await Promise.allSettled([
        api.get(`/api/performance?page=${page}`),
        getAllEmployees(0, 100),
      ]);
      if (revRes.status === 'fulfilled') {
        setReviews(revRes.value.data?.data?.content || []);
        setTotalPages(revRes.value.data?.data?.totalPages || 1);
      }
      if (empRes.status === 'fulfilled') {
        setEmployees(empRes.value.data?.data?.content || []);
      }
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    const timer = setTimeout(() => { fetchAll(); }, 0);
    return () => clearTimeout(timer);
  }, [fetchAll]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/api/performance', {
        ...form,
        employeeId: parseInt(form.employeeId),
        technicalSkills: parseInt(form.technicalSkills),
        communication: parseInt(form.communication),
        teamwork: parseInt(form.teamwork),
        productivity: parseInt(form.productivity),
        leadership: parseInt(form.leadership),
      });
      toast.success('Performance review created!');
      setShowForm(false);
      setForm(EMPTY_FORM);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRatingChange = (name, val) => setForm(prev => ({ ...prev, [name]: val }));

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: '100vh', padding: '12px' }}>
      <ThemeVars />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
            Performance Reviews
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Create and manage employee performance reviews
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          style={{
            padding: '10px 20px',
            background: 'var(--accent-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(13, 148, 136, 0.25)',
            transition: 'all 0.2s'
          }}
        >
          + Create Review
        </button>
      </div>

      {/* Reviews Table */}
      <div className="table-responsive" style={{ background: 'var(--bg-card)', borderRadius: '14px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
        <div className="admin-data-table" style={{ minWidth: '760px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', padding: '12px 20px', background: 'var(--bg-card-header)', borderBottom: '1px solid var(--border-color)' }}>
            {['Employee', 'Review Period', 'Overall Rating', 'Status', 'Review Date'].map(h => (
              <div key={h} style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</div>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
          ) : reviews.length === 0 ? (
            <div style={{ padding: '80px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⭐</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>No reviews yet</div>
              <button
                onClick={() => setShowForm(true)}
                style={{ padding: '10px 20px', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
              >
                + Create First Review
              </button>
            </div>
          ) : (
            reviews.map((r) => (
              <div key={r.id} onClick={() => setSelected(selected?.id === r.id ? null : r)} style={{ cursor: 'pointer' }}>
                <div
                  style={{
                    display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                    padding: '14px 20px', borderBottom: '1px solid var(--border-color-light)', alignItems: 'center',
                    background: selected?.id === r.id ? 'var(--bg-selected)' : 'var(--bg-card)',
                    borderLeft: selected?.id === r.id ? '4px solid var(--accent-primary)' : '4px solid transparent',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={e => { if (selected?.id !== r.id) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                  onMouseLeave={e => { if (selected?.id !== r.id) e.currentTarget.style.background = 'var(--bg-card)'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-blue))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: 'white', flexShrink: 0 }}>
                      {r.employeeName?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{r.employeeName}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{r.employeeCode}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{r.reviewPeriod}</div>
                  <StarRating value={r.overallRating} />
                  <div><Badge status={r.status} /></div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{r.reviewDate}</div>
                </div>

                {/* Expanded Detail */}
                {selected?.id === r.id && (
                  <div style={{ padding: '16px 20px', background: 'var(--bg-hover)', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                      {[
                        { label: 'Technical', value: r.technicalSkills },
                        { label: 'Communication', value: r.communication },
                        { label: 'Teamwork', value: r.teamwork },
                        { label: 'Productivity', value: r.productivity },
                        { label: 'Leadership', value: r.leadership },
                      ].map(s => (
                        <div key={s.label} style={{ background: 'var(--bg-card)', borderRadius: '8px', padding: '10px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>{s.label}</div>
                          <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--accent-primary)' }}>{s.value}</div>
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>/ 5</div>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                      {[
                        { label: '💪 Strengths', value: r.strengths },
                        { label: '📈 Improvements', value: r.improvements },
                        { label: '🎯 Goals', value: r.goals },
                      ].map(d => d.value && (
                        <div key={d.label} style={{ background: 'var(--bg-card)', borderRadius: '8px', padding: '12px', border: '1px solid var(--border-color)' }}>
                          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>{d.label}</div>
                          <div style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.5 }}>{d.value}</div>
                        </div>
                      ))}
                    </div>

                    {r.employeeComments && (
                      <div style={{ marginTop: '12px', background: 'var(--accent-blue-bg)', borderRadius: '8px', padding: '12px', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--accent-blue)', marginBottom: '4px' }}>💬 Employee Comments</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{r.employeeComments}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Pagination controls */}
        {!loading && reviews.length > 0 && (
          <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500' }}>
              Page {page + 1} of {totalPages || 1}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                style={{
                  padding: '6px 12px',
                  border: '1px solid var(--border-color-strong)',
                  borderRadius: '6px',
                  background: page === 0 ? 'var(--bg-card-header)' : 'var(--btn-secondary-bg)',
                  color: page === 0 ? 'var(--text-muted)' : 'var(--btn-secondary-text)',
                  cursor: page === 0 ? 'not-allowed' : 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                style={{
                  padding: '6px 12px',
                  border: '1px solid var(--border-color-strong)',
                  borderRadius: '6px',
                  background: page >= totalPages - 1 ? 'var(--bg-card-header)' : 'var(--btn-secondary-bg)',
                  color: page >= totalPages - 1 ? 'var(--text-muted)' : 'var(--btn-secondary-text)',
                  cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Review Modal */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px'
        }}>
          <div style={{
            background: 'var(--bg-card)', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '580px',
            maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>Create Performance Review</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
            </div>

            <form onSubmit={handleCreate}>
              {/* Employee + Period */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                    Employee <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    value={form.employeeId}
                    onChange={e => setForm({ ...form, employeeId: e.target.value })}
                    required
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border-color-strong)', borderRadius: '8px', fontSize: '13px', outline: 'none', background: 'var(--bg-card-header)', color: 'var(--text-primary)' }}
                  >
                    <option value="">Select employee...</option>
                    {employees.map(e => (
                      <option key={e.id} value={e.id}>{e.firstName} {e.lastName} — {e.employeeCode}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>Review Period</label>
                  <input
                    value={form.reviewPeriod}
                    onChange={e => setForm({ ...form, reviewPeriod: e.target.value })}
                    placeholder="e.g. Q2 2026"
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border-color-strong)', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box', background: 'var(--bg-card-header)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>

              {/* Ratings */}
              <div style={{ background: 'var(--bg-card-header)', borderRadius: '10px', padding: '16px', marginBottom: '16px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '14px' }}>Ratings (1–5)</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <RatingInput label="Technical Skills" name="technicalSkills" value={form.technicalSkills} onChange={handleRatingChange} />
                  <RatingInput label="Communication" name="communication" value={form.communication} onChange={handleRatingChange} />
                  <RatingInput label="Teamwork" name="teamwork" value={form.teamwork} onChange={handleRatingChange} />
                  <RatingInput label="Productivity" name="productivity" value={form.productivity} onChange={handleRatingChange} />
                  <RatingInput label="Leadership" name="leadership" value={form.leadership} onChange={handleRatingChange} />
                </div>
              </div>

              {/* Text fields */}
              {[
                { label: 'Strengths', name: 'strengths', placeholder: 'Key strengths of the employee...' },
                { label: 'Areas for Improvement', name: 'improvements', placeholder: 'Areas to improve...' },
                { label: 'Goals', name: 'goals', placeholder: 'Goals for next period...' },
              ].map(f => (
                <div key={f.name} style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>{f.label}</label>
                  <textarea
                    value={form[f.name]}
                    onChange={e => setForm({ ...form, [f.name]: e.target.value })}
                    placeholder={f.placeholder}
                    rows={2}
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border-color-strong)', borderRadius: '8px', fontSize: '13px', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit', background: 'var(--bg-card-header)', color: 'var(--text-primary)' }}
                  />
                </div>
              ))}

              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{ flex: 1, padding: '12px', background: 'var(--btn-secondary-bg)', color: 'var(--btn-secondary-text)', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ flex: 1, padding: '12px', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}
                >
                  {submitting ? '⏳ Creating...' : 'Create Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function RatingInput({ label, name, value, onChange }) {
  return (
    <div>
      <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
        {label} ({value}/5)
      </label>
      <input
        type="range" min="1" max="5" value={value || 3}
        onChange={e => onChange(name, e.target.value)}
        style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)' }}>
        <span>Poor</span><span>Average</span><span>Excellent</span>
      </div>
    </div>
  );
}