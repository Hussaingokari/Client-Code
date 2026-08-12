'use client';
import { useState, useEffect, useCallback } from 'react';
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

        /* Status Badges Light */
        --badge-open-bg: #dcfce7;        --badge-open-text: #15803d;
        --badge-closed-bg: #fee2e2;      --badge-closed-text: #b91c1c;
        --badge-draft-bg: #f1f5f9;       --badge-draft-text: #64748b;
        --badge-applied-bg: #e0f2fe;     --badge-applied-text: #0369a1;
        --badge-shortlist-bg: #fae8ff;   --badge-shortlist-text: #86198f;
        --badge-interview-bg: #fef3c7;   --badge-interview-text: #b45309;
        --badge-offer-bg: #dcfce7;       --badge-offer-text: #15803d;
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

        /* Status Badges Dark */
        --badge-open-bg: #064e3b;        --badge-open-text: #6ee7b7;
        --badge-closed-bg: #7f1d1d;      --badge-closed-text: #fca5a5;
        --badge-draft-bg: #1f2937;       --badge-draft-text: #9ca3af;
        --badge-applied-bg: #075985;     --badge-applied-text: #7dd3fc;
        --badge-shortlist-bg: #701a75;   --badge-shortlist-text: #f5d0fe;
        --badge-interview-bg: #78350f;   --badge-interview-text: #fde68a;
        --badge-offer-bg: #064e3b;       --badge-offer-text: #6ee7b7;
      }
    `}</style>
  );
}

const STATUSES = [
  'APPLIED', 'SHORTLISTED', 'INTERVIEW_SCHEDULED',
  'INTERVIEWED', 'OFFER_SENT', 'OFFER_ACCEPTED',
  'OFFER_REJECTED', 'REJECTED',
];

function Badge({ status }) {
  const map = {
    OPEN: { bg: 'var(--badge-open-bg)', color: 'var(--badge-open-text)' },
    CLOSED: { bg: 'var(--badge-closed-bg)', color: 'var(--badge-closed-text)' },
    DRAFT: { bg: 'var(--badge-draft-bg)', color: 'var(--badge-draft-text)' },
    APPLIED: { bg: 'var(--badge-applied-bg)', color: 'var(--badge-applied-text)' },
    SHORTLISTED: { bg: 'var(--badge-shortlist-bg)', color: 'var(--badge-shortlist-text)' },
    INTERVIEW_SCHEDULED: { bg: 'var(--badge-interview-bg)', color: 'var(--badge-interview-text)' },
    INTERVIEWED: { bg: 'var(--badge-interview-bg)', color: 'var(--badge-interview-text)' },
    OFFER_SENT: { bg: 'var(--badge-offer-bg)', color: 'var(--badge-offer-text)' },
    OFFER_ACCEPTED: { bg: 'var(--badge-offer-bg)', color: 'var(--badge-offer-text)' },
    OFFER_REJECTED: { bg: 'var(--badge-closed-bg)', color: 'var(--badge-closed-text)' },
    REJECTED: { bg: 'var(--badge-closed-bg)', color: 'var(--badge-closed-text)' },
  };
  const s = map[status] || { bg: 'var(--badge-draft-bg)', color: 'var(--badge-draft-text)' };
  return (
    <span style={{
      background: s.bg, color: s.color,
      padding: '3px 10px', borderRadius: '20px',
      fontSize: '11px', fontWeight: '700',
      whiteSpace: 'nowrap', display: 'inline-block'
    }}>
      {status?.replace(/_/g, ' ')}
    </span>
  );
}

const EMPTY_JOB = {
  title: '', department: '', location: '',
  employmentType: 'FULL_TIME', description: '',
  requirements: '', experienceRequired: '',
  salaryRange: '', applicationDeadline: '',
};

export default function RecruitmentPage() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingApps, setLoadingApps] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [jobForm, setJobForm] = useState(EMPTY_JOB);
  const [submitting, setSubmitting] = useState(false);
  const [updatingApp, setUpdatingApp] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewScore, setInterviewScore] = useState('');
  const [interviewNotes, setInterviewNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/recruitment/jobs/all');
      setJobs(res.data?.data?.content || res.data?.data || []);
    } catch { toast.error('Failed to load jobs'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => { fetchJobs(); }, 0);
    return () => clearTimeout(timer);
  }, [fetchJobs]);

  const fetchApplications = async (jobId) => {
    setLoadingApps(true);
    try {
      const res = await api.get(`/api/recruitment/jobs/${jobId}/applications`);
      setApplications(res.data?.data?.content || res.data?.data || []);
    } catch { toast.error('Failed to load applications'); }
    finally { setLoadingApps(false); }
  };

  const handleSelectJob = (job) => {
    setSelectedJob(job);
    setSelectedApp(null);
    fetchApplications(job.id);
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/api/recruitment/jobs', jobForm);
      toast.success('Job posted successfully!');
      setShowJobForm(false);
      setJobForm(EMPTY_JOB);
      fetchJobs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post job');
    } finally { setSubmitting(false); }
  };

  const handleUpdateApplication = async (appId) => {
    if (!newStatus) { toast.error('Select a status'); return; }
    setUpdatingApp(appId);
    try {
      const payload = { status: newStatus };
      if (newStatus === 'INTERVIEW_SCHEDULED') {
        payload.interviewDate = interviewDate;
        payload.interviewMode = 'VIDEO';
        payload.interviewerId = 2;
      }
      if (newStatus === 'INTERVIEWED') {
        payload.interviewScore = parseInt(interviewScore) || 0;
        payload.interviewNotes = interviewNotes;
      }
      if (newStatus === 'REJECTED') {
        payload.rejectionReason = rejectionReason;
      }
      await api.put(`/api/recruitment/applications/${appId}`, payload);
      toast.success('Application updated!');
      setSelectedApp(null);
      setNewStatus('');
      fetchApplications(selectedJob.id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setUpdatingApp(null); }
  };

  const handleCloseJob = async (jobId) => {
    if (!confirm('Are you sure you want to close this job posting?')) return;
    try {
      await api.put(`/api/recruitment/jobs/${jobId}`, { status: 'CLOSED' });
      toast.success('Job closed successfully');
      fetchJobs();
      if (selectedJob?.id === jobId) {
        setSelectedJob(prev => ({ ...prev, status: 'CLOSED' }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to close job');
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: '100vh', padding: '12px' }}>
      <ThemeVars />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
            Recruitment
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Manage job postings and candidate applications
          </p>
        </div>
        <button
          onClick={() => setShowJobForm(true)}
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
          + Post Job
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedJob ? '1fr 1.5fr' : '1fr', gap: '20px' }}>

        {/* Jobs List */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '14px',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-card)',
          overflow: 'hidden',
        }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-card-header)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>
              Job Postings ({jobs.length})
            </h3>
          </div>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
          ) : jobs.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>💼</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>No jobs posted yet</div>
              <button
                onClick={() => setShowJobForm(true)}
                style={{ padding: '8px 18px', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
              >
                + Post First Job
              </button>
            </div>
          ) : (
            jobs.map((job) => (
              <div key={job.id}
                onClick={() => handleSelectJob(job)}
                style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid var(--border-color-light)',
                  cursor: 'pointer',
                  background: selectedJob?.id === job.id ? 'var(--bg-selected)' : 'var(--bg-card)',
                  borderLeft: selectedJob?.id === job.id ? '4px solid var(--accent-primary)' : '4px solid transparent',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (selectedJob?.id !== job.id) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={e => { if (selectedJob?.id !== job.id) e.currentTarget.style.background = 'var(--bg-card)'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>{job.title}</div>
                  <Badge status={job.status} />
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  📍 {job.location} · {job.department} · {job.employmentType}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  💰 {job.salaryRange} · Exp: {job.experienceRequired}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Deadline: {job.applicationDeadline}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Applications */}
        {selectedJob && (
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '14px',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-card)',
            overflow: 'hidden',
          }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-card-header)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {selectedJob.title}
                </h3>
                {selectedJob.status === 'OPEN' && (
                  <button
                    onClick={() => handleCloseJob(selectedJob.id)}
                    style={{
                      fontSize: '11px', padding: '4px 10px',
                      background: 'var(--badge-closed-bg)',
                      color: 'var(--badge-closed-text)',
                      border: 'none', borderRadius: '6px',
                      fontWeight: '700', cursor: 'pointer'
                    }}
                  >
                    Close Job
                  </button>
                )}
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {applications.length} application(s) received
              </p>
            </div>

            {loadingApps ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading applications...</div>
            ) : applications.length === 0 ? (
              <div style={{ padding: '60px', textAlign: 'center' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>No applications yet</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Applications will appear here when candidates apply
                </div>
              </div>
            ) : (
              applications.map((app) => (
                <div key={app.id} style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color-light)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '38px', height: '38px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-blue))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '13px', fontWeight: '700', color: 'white', flexShrink: 0,
                      }}>
                        {app.candidateName?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>
                          {app.candidateName}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {app.candidateEmail} · {app.candidatePhone}
                        </div>
                      </div>
                    </div>
                    <Badge status={app.status} />
                  </div>

                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    🏢 {app.currentCompany} · {app.currentDesignation} · {app.experienceYears} yrs exp
                  </div>

                  {app.interviewDate && (
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      📅 Interview: {app.interviewDate} · {app.interviewMode}
                      {app.interviewScore && ` · Score: ${app.interviewScore}/100`}
                    </div>
                  )}

                  {/* Update Status */}
                  {selectedApp === app.id ? (
                    <div style={{ background: 'var(--bg-hover)', borderRadius: '8px', padding: '12px', marginTop: '8px', border: '1px solid var(--border-color)' }}>
                      <div style={{ marginBottom: '10px' }}>
                        <select
                          value={newStatus}
                          onChange={e => setNewStatus(e.target.value)}
                          style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color-strong)', borderRadius: '8px', fontSize: '13px', outline: 'none', background: 'var(--bg-card)', color: 'var(--text-primary)', marginBottom: '8px' }}
                        >
                          <option value="">Select new status...</option>
                          {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                        </select>

                        {newStatus === 'INTERVIEW_SCHEDULED' && (
                          <input type="date" value={interviewDate}
                            onChange={e => setInterviewDate(e.target.value)}
                            placeholder="Interview Date"
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color-strong)', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box', marginBottom: '8px', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                          />
                        )}

                        {newStatus === 'INTERVIEWED' && (
                          <>
                            <input type="number" value={interviewScore}
                              onChange={e => setInterviewScore(e.target.value)}
                              placeholder="Score (0-100)"
                              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color-strong)', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box', marginBottom: '8px', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                            />
                            <input value={interviewNotes}
                              onChange={e => setInterviewNotes(e.target.value)}
                              placeholder="Interview notes..."
                              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color-strong)', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                            />
                          </>
                        )}

                        {newStatus === 'REJECTED' && (
                          <input value={rejectionReason}
                            onChange={e => setRejectionReason(e.target.value)}
                            placeholder="Rejection reason..."
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color-strong)', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                          />
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleUpdateApplication(app.id)}
                          disabled={updatingApp === app.id}
                          style={{ flex: 1, padding: '8px', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '7px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                        >
                          {updatingApp === app.id ? '⏳' : 'Update'}
                        </button>
                        <button
                          onClick={() => { setSelectedApp(null); setNewStatus(''); }}
                          style={{ padding: '8px 14px', background: 'var(--btn-secondary-bg)', color: 'var(--btn-secondary-text)', border: 'none', borderRadius: '7px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedApp(app.id)}
                      style={{
                        marginTop: '8px', padding: '6px 14px',
                        background: 'var(--accent-blue-bg)', color: 'var(--accent-primary)',
                        border: '1px solid var(--border-color-strong)', borderRadius: '6px',
                        fontSize: '11px', fontWeight: '700', cursor: 'pointer',
                      }}
                    >
                      Update Status →
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Post Job Modal */}
      {showJobForm && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, padding: '20px',
        }}>
          <div style={{
            background: 'var(--bg-card)', borderRadius: '16px', padding: '28px',
            width: '100%', maxWidth: '560px', maxHeight: '90vh',
            overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid var(--border-color)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>Post New Job</h2>
              <button onClick={() => setShowJobForm(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
            </div>

            <form onSubmit={handleCreateJob}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                {[
                  { label: 'Job Title', name: 'title', required: true, placeholder: 'e.g. Java Developer' },
                  { label: 'Department', name: 'department', required: true, placeholder: 'e.g. Engineering' },
                  { label: 'Location', name: 'location', placeholder: 'e.g. Hyderabad' },
                  { label: 'Salary Range', name: 'salaryRange', placeholder: 'e.g. 6-10 LPA' },
                  { label: 'Experience Required', name: 'experienceRequired', placeholder: 'e.g. 2-4 years' },
                  { label: 'Application Deadline', name: 'applicationDeadline', type: 'date' },
                ].map(f => (
                  <div key={f.name}>
                    <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                      {f.label} {f.required && <span style={{ color: '#ef4444' }}>*</span>}
                    </label>
                    <input
                      type={f.type || 'text'}
                      value={jobForm[f.name]}
                      onChange={e => setJobForm({ ...jobForm, [f.name]: e.target.value })}
                      placeholder={f.placeholder}
                      required={f.required}
                      style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border-color-strong)', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box', background: 'var(--bg-card-header)', color: 'var(--text-primary)' }}
                    />
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                  Employment Type
                </label>
                <select value={jobForm.employmentType}
                  onChange={e => setJobForm({ ...jobForm, employmentType: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border-color-strong)', borderRadius: '8px', fontSize: '13px', outline: 'none', background: 'var(--bg-card-header)', color: 'var(--text-primary)' }}>
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="INTERN">Internship</option>
                </select>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                  Description <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea value={jobForm.description}
                  onChange={e => setJobForm({ ...jobForm, description: e.target.value })}
                  placeholder="Job description..." required rows={3}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border-color-strong)', borderRadius: '8px', fontSize: '13px', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit', background: 'var(--bg-card-header)', color: 'var(--text-primary)' }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                  Requirements
                </label>
                <textarea value={jobForm.requirements}
                  onChange={e => setJobForm({ ...jobForm, requirements: e.target.value })}
                  placeholder="Job requirements..." rows={3}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border-color-strong)', borderRadius: '8px', fontSize: '13px', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit', background: 'var(--bg-card-header)', color: 'var(--text-primary)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setShowJobForm(false)}
                  style={{ flex: 1, padding: '12px', background: 'var(--btn-secondary-bg)', color: 'var(--btn-secondary-text)', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  style={{ flex: 1, padding: '12px', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
                  {submitting ? '⏳ Posting...' : 'Post Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}