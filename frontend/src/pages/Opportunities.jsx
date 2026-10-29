import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Briefcase,
  Bookmark,
  PlusCircle,
  ExternalLink,
  DollarSign,
  MapPin,
  Calendar,
  CheckCircle2,
  Building,
  GraduationCap
} from 'lucide-react';

export default function Opportunities() {
  const { user, isAdmin } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [type, setType] = useState('all');
  const [selectedOpp, setSelectedOpp] = useState(null); // for Fast Apply modal
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [newOpp, setNewOpp] = useState({
    title: '',
    type: 'Internship',
    company: '',
    stipend: '₹20,000 / month',
    location: 'Remote',
    deadline: '2026-04-15',
    description: '',
    eligibility: 'B.Tech CSE/IT with CGPA >= 7.5',
    apply_url: '#apply'
  });

  const types = ['all', 'Internship', 'Scholarship', 'Competition', 'Certification'];

  useEffect(() => {
    loadOpportunities();
  }, [user, type]);

  const loadOpportunities = async () => {
    try {
      const data = await api.getOpportunities(user?.id, type);
      setOpportunities(data);
    } catch (err) {
      console.error('Failed to load opportunities:', err);
    }
  };

  const handleToggleSave = async (opp) => {
    try {
      await api.interactOpportunity(opp.id, {
        studentId: user?.id || 'STU-2024-8842',
        action: 'saved'
      });
      loadOpportunities();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleFastApplySubmit = async (e) => {
    e.preventDefault();
    try {
      await api.interactOpportunity(selectedOpp.id, {
        studentId: user?.id || 'STU-2024-8842',
        action: 'applied'
      });
      setSelectedOpp(null);
      alert('🚀 Application successfully dispatched using verified Student Portal profile credentials!');
      loadOpportunities();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreateOpp = async (e) => {
    e.preventDefault();
    try {
      await api.createOpportunity(newOpp);
      setCreateModalOpen(false);
      loadOpportunities();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="animate-fade" style={{ padding: '24px', maxWidth: '1300px', margin: '0 auto' }}>
      {/* Title & Action */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
            Opportunities Hub
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Curated industry internships, DRDO fellowships, STEM scholarships, and hackathons
          </p>
        </div>

        {isAdmin && (
          <button onClick={() => setCreateModalOpen(true)} className="btn-primary">
            <PlusCircle size={16} />
            Post Opportunity
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {types.map(t => (
          <button
            key={t}
            onClick={() => setType(t)}
            style={{
              padding: '7px 18px',
              borderRadius: 'var(--radius-full)',
              border: type === t ? '1px solid var(--c-primary)' : '1px solid var(--border-subtle)',
              backgroundColor: type === t ? 'rgba(113, 201, 206, 0.15)' : 'var(--bg-card)',
              color: type === t ? 'var(--c-lightest)' : 'var(--text-muted)',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {t === 'all' ? 'All Programs' : t}
          </button>
        ))}
      </div>

      {/* Opportunities Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '22px'
      }}>
        {opportunities.map((opp) => (
          <div
            key={opp.id}
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-card)',
              position: 'relative'
            }}
          >
            <div>
              {/* Badges & Save Bookmark */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className="badge badge-teal">{opp.type}</span>
                <button
                  onClick={() => handleToggleSave(opp)}
                  title={opp.is_saved ? 'Remove bookmark' : 'Save bookmark'}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: opp.is_saved ? 'var(--c-primary)' : 'var(--text-dim)',
                    cursor: 'pointer'
                  }}
                >
                  <Bookmark size={18} fill={opp.is_saved ? '#71C9CE' : 'none'} />
                </button>
              </div>

              {/* Title & Company */}
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                {opp.title}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', color: 'var(--c-mid)', marginBottom: '12px' }}>
                <Building size={14} />
                <span>{opp.company}</span>
              </div>

              {/* Key Highlights */}
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.02)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                fontSize: '0.8rem',
                color: 'var(--c-lightest)',
                marginBottom: '12px'
              }}>
                <div>💰 {opp.stipend}</div>
                <div>📍 {opp.location}</div>
                <div>⏰ Closes: {opp.deadline}</div>
                <div>🎓 {opp.eligibility.slice(0, 22)}...</div>
              </div>

              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                {opp.description}
              </p>
            </div>

            {/* Action Footer */}
            <div style={{
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                {opp.is_applied ? (
                  <span style={{ color: 'var(--c-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={14} color="#71C9CE" /> Applied
                  </span>
                ) : (
                  'Eligible profile'
                )}
              </span>

              {!isAdmin && (
                <button
                  onClick={() => setSelectedOpp(opp)}
                  disabled={opp.is_applied}
                  className="btn-primary"
                  style={{ padding: '6px 16px', fontSize: '0.82rem', opacity: opp.is_applied ? 0.6 : 1 }}
                >
                  {opp.is_applied ? 'Application Sent' : '1-Click Fast Apply'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ====================================================================
          1-CLICK FAST APPLY MODAL
          ==================================================================== */}
      {selectedOpp && (
        <div className="modal-overlay" onClick={() => setSelectedOpp(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ padding: '26px', maxWidth: '520px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
              Instant Application Submission
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
              Submitting verified credentials for <strong>{selectedOpp.title}</strong> ({selectedOpp.company})
            </p>

            <form onSubmit={handleFastApplySubmit}>
              <div style={{
                backgroundColor: 'rgba(113, 201, 206, 0.08)',
                border: '1px solid var(--border-highlight)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                fontSize: '0.85rem',
                marginBottom: '18px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Student Name:</span>
                  <span style={{ fontWeight: 600 }}>{user?.name || 'Alex Turner'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Roll Number:</span>
                  <span style={{ fontWeight: 600 }}>{user?.roll_no || '21BCSE042'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Department:</span>
                  <span style={{ fontWeight: 600 }}>{user?.department || 'Computer Science'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Institute CGPA:</span>
                  <span style={{ fontWeight: 700, color: 'var(--c-primary)' }}>{user?.cgpa || '8.85'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Contact Email:</span>
                  <span style={{ fontWeight: 600 }}>{user?.email || 'student@campus360.edu'}</span>
                </div>
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '18px' }}>
                * By submitting, your verified college academic transcript and attendance metrics will be shared with the recruiter portal.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setSelectedOpp(null)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Transmit Application</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          ADMIN: POST OPPORTUNITY MODAL
          ==================================================================== */}
      {createModalOpen && (
        <div className="modal-overlay" onClick={() => setCreateModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>
              Publish Career Opportunity
            </h3>
            <form onSubmit={handleCreateOpp}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--c-mid)', marginBottom: '4px' }}>Program Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NVIDIA Graduate AI Research Internship"
                  value={newOpp.title}
                  onChange={(e) => setNewOpp({ ...newOpp, title: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--c-mid)', marginBottom: '4px' }}>Type</label>
                  <select
                    value={newOpp.type}
                    onChange={(e) => setNewOpp({ ...newOpp, type: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}
                  >
                    <option value="Internship">Internship</option>
                    <option value="Scholarship">Scholarship</option>
                    <option value="Competition">Competition</option>
                    <option value="Certification">Certification</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--c-mid)', marginBottom: '4px' }}>Company / Agency</label>
                  <input
                    type="text"
                    required
                    value={newOpp.company}
                    onChange={(e) => setNewOpp({ ...newOpp, company: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--c-mid)', marginBottom: '4px' }}>Stipend / Award</label>
                  <input
                    type="text"
                    required
                    value={newOpp.stipend}
                    onChange={(e) => setNewOpp({ ...newOpp, stipend: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--c-mid)', marginBottom: '4px' }}>Deadline</label>
                  <input
                    type="date"
                    required
                    value={newOpp.deadline}
                    onChange={(e) => setNewOpp({ ...newOpp, deadline: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--c-mid)', marginBottom: '4px' }}>Eligibility</label>
                <input
                  type="text"
                  required
                  value={newOpp.eligibility}
                  onChange={(e) => setNewOpp({ ...newOpp, eligibility: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--c-mid)', marginBottom: '4px' }}>Description</label>
                <textarea
                  rows={3}
                  required
                  value={newOpp.description}
                  onChange={(e) => setNewOpp({ ...newOpp, description: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setCreateModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Post Opportunity</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
