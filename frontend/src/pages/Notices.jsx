import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Megaphone,
  Pin,
  AlertTriangle,
  PlusCircle,
  Eye,
  Trash2,
  Calendar,
  Building,
  UserCheck,
  Search,
  ExternalLink
} from 'lucide-react';

export default function Notices() {
  const { user, isAdmin } = useAuth();
  const [notices, setNotices] = useState([]);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [newNotice, setNewNotice] = useState({
    title: '',
    category: 'Exam',
    department: 'Examination Cell',
    content: '',
    author: user?.name || 'Dr. Vikram Malhotra',
    is_urgent: false,
    pinned: false
  });

  const categories = ['all', 'Exam', 'Event', 'Academic', 'Placement', 'Administration'];

  useEffect(() => {
    loadNotices();
  }, [category]);

  const loadNotices = async () => {
    try {
      const data = await api.getNotices(category);
      setNotices(data);
    } catch (err) {
      console.error('Failed to load notices:', err);
    }
  };

  const handleTogglePin = async (id) => {
    try {
      await api.togglePinNotice(id);
      loadNotices();
    } catch (err) {
      alert('Error updating pin status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return;
    try {
      await api.deleteNotice(id);
      loadNotices();
    } catch (err) {
      alert('Error deleting notice');
    }
  };

  const handleCreateNotice = async (e) => {
    e.preventDefault();
    try {
      await api.createNotice({
        ...newNotice,
        author: user?.name || 'Dr. Vikram Malhotra'
      });
      setCreateModalOpen(false);
      setNewNotice({
        title: '',
        category: 'Exam',
        department: 'Examination Cell',
        content: '',
        author: user?.name || 'Dr. Vikram Malhotra',
        is_urgent: false,
        pinned: false
      });
      loadNotices();
    } catch (err) {
      alert('Error creating notice: ' + err.message);
    }
  };

  const urgentNotice = notices.find(n => n.is_urgent);

  const filteredNotices = notices.filter(n => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q) || n.department.toLowerCase().includes(q);
  });

  return (
    <div className="animate-fade" style={{ padding: '24px', maxWidth: '1300px', margin: '0 auto' }}>
      {/* Page Title & Admin Action */}
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
            Campus Noticeboard
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Official administrative decrees, examination circulars, and time-sensitive bulletins
          </p>
        </div>

        {isAdmin && (
          <button onClick={() => setCreateModalOpen(true)} className="btn-primary">
            <PlusCircle size={16} />
            Publish Official Circular
          </button>
        )}
      </div>

      {/* Urgent Emergency Spotlight Banner */}
      {urgentNotice && (
        <div style={{
          backgroundColor: 'rgba(244, 63, 94, 0.1)',
          border: '1px solid rgba(244, 63, 94, 0.35)',
          borderRadius: 'var(--radius-lg)',
          padding: '18px 24px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          boxShadow: '0 0 20px rgba(244, 63, 94, 0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(244, 63, 94, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fb7185'
            }}>
              <AlertTriangle size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-urgent">URGENT BROADCAST</span>
                <span style={{ fontSize: '0.8rem', color: '#fda4af' }}>{urgentNotice.department} • {urgentNotice.time_ago}</span>
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '4px' }}>
                {urgentNotice.title}
              </h3>
            </div>
          </div>
          <button
            onClick={() => setSelectedNotice(urgentNotice)}
            className="btn-secondary"
            style={{ borderColor: 'rgba(244, 63, 94, 0.4)', color: '#fecdd3' }}
          >
            Read Notice
          </button>
        </div>
      )}

      {/* Filter Chips & Search Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: category === c ? '1px solid var(--c-primary)' : '1px solid var(--border-subtle)',
                backgroundColor: category === c ? 'rgba(113, 201, 206, 0.15)' : 'var(--bg-card)',
                color: category === c ? 'var(--c-lightest)' : 'var(--text-muted)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {c === 'all' ? 'All Bulletins' : c}
            </button>
          ))}
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'var(--bg-input)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '8px 14px',
          width: '280px'
        }}>
          <Search size={16} color="var(--c-mid)" />
          <input
            type="text"
            placeholder="Search circulars..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-main)',
              fontSize: '0.84rem',
              outline: 'none',
              width: '100%'
            }}
          />
        </div>
      </div>

      {/* Notices Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '20px'
      }}>
        {filteredNotices.map((n) => (
          <div
            key={n.id}
            style={{
              backgroundColor: 'var(--bg-card)',
              border: n.pinned ? '1px solid var(--border-highlight)' : '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-card)',
              position: 'relative'
            }}
          >
            <div>
              {/* Badges & Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <span className="badge badge-teal">{n.category}</span>
                  {n.is_urgent === 1 && <span className="badge badge-urgent">Urgent</span>}
                  {n.pinned === 1 && (
                    <span title="Pinned Announcement" style={{ color: 'var(--c-primary)', display: 'flex', alignItems: 'center' }}>
                      <Pin size={14} fill="#71C9CE" />
                    </span>
                  )}
                </div>

                {isAdmin && (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => handleTogglePin(n.id)}
                      title={n.pinned ? 'Unpin' : 'Pin to top'}
                      style={{ background: 'none', border: 'none', color: n.pinned ? 'var(--c-primary)' : 'var(--text-dim)', cursor: 'pointer' }}
                    >
                      <Pin size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(n.id)}
                      title="Delete notice"
                      style={{ background: 'none', border: 'none', color: '#fb7185', cursor: 'pointer' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                )}
              </div>

              {/* Title */}
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.4, marginBottom: '8px' }}>
                {n.title}
              </h3>

              {/* Department & Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--c-mid)', marginBottom: '12px' }}>
                <Building size={13} />
                <span>{n.department}</span>
                <span>•</span>
                <span>{n.author}</span>
              </div>

              {/* Snippet */}
              <p style={{
                fontSize: '0.84rem',
                color: 'var(--text-muted)',
                lineHeight: 1.5,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {n.content}
              </p>
            </div>

            {/* Card Footer */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '18px',
              paddingTop: '12px',
              borderTop: '1px solid var(--border-subtle)'
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                {n.date} ({n.time_ago})
              </span>
              <button
                onClick={() => setSelectedNotice(n)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--c-primary)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                Read Details →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ====================================================================
          NOTICE DETAIL MODAL
          ==================================================================== */}
      {selectedNotice && (
        <div className="modal-overlay" onClick={() => setSelectedNotice(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ padding: '28px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <span className="badge badge-teal">{selectedNotice.category}</span>
              {selectedNotice.is_urgent === 1 && <span className="badge badge-urgent">Urgent</span>}
            </div>

            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '10px' }}>
              {selectedNotice.title}
            </h2>

            <div style={{ fontSize: '0.82rem', color: 'var(--c-mid)', marginBottom: '18px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <span>Issued by: <strong>{selectedNotice.author}</strong></span>
              <span>•</span>
              <span>Cell: <strong>{selectedNotice.department}</strong></span>
              <span>•</span>
              <span>Date: <strong>{selectedNotice.date}</strong></span>
            </div>

            <div style={{
              padding: '18px',
              backgroundColor: 'rgba(255,255,255,0.02)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.9rem',
              color: 'var(--text-main)',
              lineHeight: 1.6,
              whiteSpace: 'pre-line'
            }}>
              {selectedNotice.content}
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setSelectedNotice(null)} className="btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          ADMIN: PUBLISH NOTICE MODAL
          ==================================================================== */}
      {createModalOpen && (
        <div className="modal-overlay" onClick={() => setCreateModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ padding: '26px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>
              Draft & Broadcast Campus Circular
            </h3>

            <form onSubmit={handleCreateNotice}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--c-mid)', marginBottom: '6px', fontWeight: 600 }}>Notice Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule for End-Semester Practical Examinations"
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--c-mid)', marginBottom: '6px', fontWeight: 600 }}>Category</label>
                  <select
                    value={newNotice.category}
                    onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-main)'
                    }}
                  >
                    <option value="Exam">Examination</option>
                    <option value="Event">Event</option>
                    <option value="Academic">Academic</option>
                    <option value="Placement">Placement</option>
                    <option value="Administration">Administration</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--c-mid)', marginBottom: '6px', fontWeight: 600 }}>Department</label>
                  <input
                    type="text"
                    required
                    value={newNotice.department}
                    onChange={(e) => setNewNotice({ ...newNotice, department: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-main)'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--c-mid)', marginBottom: '6px', fontWeight: 600 }}>Circular Content</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Official notice text, instructions, deadlines, and contact coordinates..."
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)',
                    fontSize: '0.88rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={newNotice.is_urgent}
                    onChange={(e) => setNewNotice({ ...newNotice, is_urgent: e.target.checked })}
                  />
                  Mark as Urgent Broadcast
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={newNotice.pinned}
                    onChange={(e) => setNewNotice({ ...newNotice, pinned: e.target.checked })}
                  />
                  Pin to Top
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setCreateModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Broadcast to Portal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
