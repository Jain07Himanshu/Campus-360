import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  Compass,
  MapPin,
  Users,
  Search,
  PlusCircle,
  Ticket,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Navigation,
  FileCheck
} from 'lucide-react';

export default function CampusLife() {
  const { user, isAdmin } = useAuth();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'events';
  const [activeTab, setActiveTab] = useState(initialTab); // 'events', 'lostfound', 'map', 'clubs'

  // Data states
  const [events, setEvents] = useState([]);
  const [lostFound, setLostFound] = useState([]);
  const [locations, setLocations] = useState([]);
  const [clubs, setClubs] = useState([]);

  // Modals
  const [ticketModal, setTicketModal] = useState(null); // ticket data to show
  const [claimModalItem, setClaimModalItem] = useState(null);
  const [claimProof, setClaimProof] = useState('');

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [newReport, setNewReport] = useState({
    type: 'lost',
    title: '',
    category: 'Electronics',
    location: '',
    description: ''
  });

  const [createEventModalOpen, setCreateEventModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    category: 'Fest',
    date: '2026-03-25',
    time: '10:00 AM',
    venue: 'Main Auditorium',
    organizer: 'Student Council',
    capacity: 500,
    description: '',
    fee: 'Free',
    tags: 'Campus Fest, Tech'
  });

  // Directions calculator
  const [startLoc, setStartLoc] = useState('');
  const [destLoc, setDestLoc] = useState('');
  const [calculatedRoute, setCalculatedRoute] = useState(null);

  useEffect(() => {
    loadAllCampusLifeData();
  }, [user]);

  const loadAllCampusLifeData = async () => {
    try {
      const [ev, lf, loc, clb] = await Promise.all([
        api.getEvents(user?.id),
        api.getLostFound(),
        api.getLocations(),
        api.getClubs(user?.id)
      ]);
      setEvents(ev);
      setLostFound(lf);
      setLocations(loc);
      setClubs(clb);
      if (loc.length >= 2) {
        setStartLoc(loc[0].id);
        setDestLoc(loc[1].id);
      }
    } catch (err) {
      console.error('Failed to load campus life data:', err);
    }
  };

  const handleRegisterEvent = async (event) => {
    try {
      const res = await api.registerEvent(event.id, user?.id || 'STU-2024-8842');
      setTicketModal({
        eventTitle: event.title,
        ticketId: res.ticketId,
        venue: event.venue,
        date: event.date,
        time: event.time,
        studentName: user?.name || 'Alex Turner',
        rollNo: user?.roll_no || '21BCSE042'
      });
      loadAllCampusLifeData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleClub = async (club) => {
    try {
      if (club.is_member) {
        await api.leaveClub(club.id, user?.id || 'STU-2024-8842');
      } else {
        await api.joinClub(club.id, user?.id || 'STU-2024-8842');
      }
      loadAllCampusLifeData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.claimLostFound(claimModalItem.id, {
        claimant_id: user?.id || 'STU-2024-8842',
        claimant_name: user?.name || 'Alex Turner',
        claimant_dept: user?.department || 'Computer Engineering',
        proof_description: claimProof
      });
      setClaimModalItem(null);
      setClaimProof('');
      alert('✅ Ownership verification claim submitted to the Campus Security Desk.');
      loadAllCampusLifeData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.reportLostFound({
        ...newReport,
        reporter_id: user?.id || 'STU-2024-8842',
        reporter_name: user?.name || 'Alex Turner'
      });
      setReportModalOpen(false);
      setNewReport({ type: 'lost', title: '', category: 'Electronics', location: '', description: '' });
      loadAllCampusLifeData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await api.createEvent(newEvent);
      setCreateEventModalOpen(false);
      loadAllCampusLifeData();
    } catch (err) {
      alert(err.message);
    }
  };

  const calculateWalkingRoute = () => {
    const from = locations.find(l => l.id === startLoc);
    const to = locations.find(l => l.id === destLoc);
    if (!from || !to) return;

    setCalculatedRoute({
      fromName: from.name,
      toName: to.name,
      time: '3 - 5 mins walk',
      distance: '180 meters',
      steps: [
        `Exit ${from.building} via main lobby doors.`,
        `Follow the covered pergola pathway towards ${to.building}.`,
        `Take stairs / elevator up to ${to.floor}.`,
        `Arrive at ${to.name} (${to.code}).`
      ]
    });
  };

  return (
    <div className="animate-fade" style={{ padding: '24px', maxWidth: '1300px', margin: '0 auto' }}>
      {/* Page Header */}
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
            Campus Life & Communities
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Fests, hackathons, lost & found verification, route navigation, and technical societies
          </p>
        </div>

        {/* Tab Pill Switcher */}
        <div style={{
          display: 'flex',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-full)',
          padding: '4px',
          gap: '4px'
        }}>
          {[
            { id: 'events', label: 'Events & Fests', icon: Calendar },
            { id: 'lostfound', label: 'Lost & Found', icon: Compass },
            { id: 'map', label: 'Campus Navigation', icon: MapPin },
            { id: 'clubs', label: 'Student Clubs', icon: Users },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 16px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  backgroundColor: active ? 'var(--c-primary)' : 'transparent',
                  color: active ? '#07171e' : 'var(--text-muted)',
                  boxShadow: active ? 'var(--shadow-teal)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ====================================================================
          TAB 1: EVENTS & FESTS
          ==================================================================== */}
      {activeTab === 'events' && (
        <div className="animate-fade">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Campus Hackathons, Fests & Symposiums
            </h3>
            {isAdmin && (
              <button onClick={() => setCreateEventModalOpen(true)} className="btn-primary">
                <PlusCircle size={16} />
                Register New Event
              </button>
            )}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '22px'
          }}>
            {events.map((evt) => (
              <div
                key={evt.id}
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span className="badge badge-teal">{evt.category}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--c-mid)', fontWeight: 600 }}>{evt.fee}</span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                    {evt.title}
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.82rem', color: 'var(--c-lightest)', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} color="#71C9CE" />
                      <span>{evt.date} {evt.end_date && evt.end_date !== evt.date ? `to ${evt.end_date}` : ''}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={14} color="#71C9CE" />
                      <span>{evt.time}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={14} color="#71C9CE" />
                      <span>{evt.venue}</span>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                    {evt.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {evt.tags?.map((t, idx) => (
                      <span key={idx} style={{ fontSize: '0.72rem', backgroundColor: 'rgba(255,255,255,0.04)', color: 'var(--c-mid)', padding: '2px 8px', borderRadius: '4px' }}>
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{
                  marginTop: '20px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                    {evt.registered_count || 0} registered / {evt.capacity} seats
                  </span>

                  {evt.is_registered ? (
                    <button
                      onClick={() => setTicketModal({
                        eventTitle: evt.title,
                        ticketId: evt.my_ticket_id || 'TCK-PASS-ACTIVE',
                        venue: evt.venue,
                        date: evt.date,
                        time: evt.time,
                        studentName: user?.name,
                        rollNo: user?.roll_no
                      })}
                      className="btn-secondary"
                      style={{ padding: '6px 14px', fontSize: '0.8rem', borderColor: 'var(--c-primary)' }}
                    >
                      <Ticket size={14} color="#71C9CE" />
                      View Entry Pass
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRegisterEvent(evt)}
                      className="btn-primary"
                      style={{ padding: '6px 16px', fontSize: '0.82rem' }}
                    >
                      Register Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ====================================================================
          TAB 2: LOST & FOUND
          ==================================================================== */}
      {activeTab === 'lostfound' && (
        <div className="animate-fade">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Campus Lost & Found Registry
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Security-moderated ownership verification and recovery center
              </p>
            </div>
            <button onClick={() => setReportModalOpen(true)} className="btn-primary">
              <PlusCircle size={16} />
              Report Lost / Found Item
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {lostFound.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '22px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-card)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span className={`badge ${item.type === 'found' ? 'badge-teal' : 'badge-urgent'}`}>
                      {item.type.toUpperCase()}
                    </span>
                    <span className="badge badge-aqua">{item.status.replace('_', ' ').toUpperCase()}</span>
                  </div>

                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                    {item.title}
                  </h4>

                  <div style={{ fontSize: '0.82rem', color: 'var(--c-lightest)', display: 'flex', flexDirection: 'column', gap: '3px', marginBottom: '10px' }}>
                    <span>📍 <strong>Location:</strong> {item.location}</span>
                    <span>📅 <strong>Date:</strong> {item.item_date}</span>
                    <span>👤 <strong>Logged by:</strong> {item.reporter_name}</span>
                  </div>

                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    {item.description}
                  </p>
                </div>

                <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end' }}>
                  {item.status === 'returned' ? (
                    <span style={{ fontSize: '0.78rem', color: 'var(--c-mid)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={14} color="#71C9CE" /> Returned to Owner
                    </span>
                  ) : (
                    <button
                      onClick={() => setClaimModalItem(item)}
                      className="btn-secondary"
                      style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                    >
                      Claim Ownership
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ====================================================================
          TAB 3: CAMPUS NAVIGATION & DIRECTIONS
          ==================================================================== */}
      {activeTab === 'map' && (
        <div className="animate-fade">
          {/* Walking Route Directions Calculator */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-highlight)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            marginBottom: '28px',
            boxShadow: 'var(--shadow-card)'
          }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Navigation size={18} color="#71C9CE" />
              Point-to-Point Campus Walking Route Calculator
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '14px', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--c-mid)', marginBottom: '6px', fontWeight: 600 }}>Start Location</label>
                <select
                  value={startLoc}
                  onChange={(e) => setStartLoc(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)'
                  }}
                >
                  {locations.map(l => (
                    <option key={l.id} value={l.id}>{l.name} ({l.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--c-mid)', marginBottom: '6px', fontWeight: 600 }}>Destination</label>
                <select
                  value={destLoc}
                  onChange={(e) => setDestLoc(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)'
                  }}
                >
                  {locations.map(l => (
                    <option key={l.id} value={l.id}>{l.name} ({l.code})</option>
                  ))}
                </select>
              </div>

              <button onClick={calculateWalkingRoute} className="btn-primary" style={{ height: '42px', padding: '0 20px' }}>
                Calculate Route
              </button>
            </div>

            {calculatedRoute && (
              <div style={{
                marginTop: '20px',
                padding: '18px',
                backgroundColor: 'rgba(113, 201, 206, 0.08)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-highlight)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--c-lightest)' }}>
                    Route: {calculatedRoute.fromName} → {calculatedRoute.toName}
                  </span>
                  <span className="badge badge-teal">{calculatedRoute.time} • {calculatedRoute.distance}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {calculatedRoute.steps.map((step, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                      <span style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--c-primary)',
                        color: '#07171e',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Locations Directory */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '18px'
          }}>
            {locations.map((loc) => (
              <div
                key={loc.id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  boxShadow: 'var(--shadow-card)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="badge badge-teal">{loc.code}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--c-mid)' }}>{loc.category}</span>
                </div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                  {loc.name}
                </h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--c-lightest)', marginBottom: '8px' }}>
                  {loc.building} • {loc.floor}
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '12px' }}>
                  {loc.description}
                </p>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
                  Hours: {loc.operating_hours}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ====================================================================
          TAB 4: STUDENT CLUBS & SOCIETIES
          ==================================================================== */}
      {activeTab === 'clubs' && (
        <div className="animate-fade">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Student Technical Societies & Arts Clubs
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Join collegiate technical cells, sports teams, and cultural groups
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {clubs.map((c) => (
              <div
                key={c.id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: c.is_member ? '1px solid var(--border-highlight)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-card)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '1.6rem' }}>{c.logo_icon}</span>
                    <span className="badge badge-teal">{c.category}</span>
                  </div>

                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                    {c.name}
                  </h4>

                  <div style={{ fontSize: '0.82rem', color: 'var(--c-mid)', marginBottom: '8px' }}>
                    Lead: <strong>{c.lead_name}</strong>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '12px' }}>
                    {c.description}
                  </p>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                    📅 {c.meeting_info}
                  </div>
                </div>

                <div style={{
                  marginTop: '18px',
                  paddingTop: '14px',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--c-lightest)', fontWeight: 600 }}>
                    {c.members_count} active members
                  </span>

                  <button
                    onClick={() => handleToggleClub(c)}
                    className={c.is_member ? 'btn-secondary' : 'btn-primary'}
                    style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                  >
                    {c.is_member ? 'Leave Club' : 'Join Community'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ====================================================================
          TICKET PASS MODAL
          ==================================================================== */}
      {ticketModal && (
        <div className="modal-overlay" onClick={() => setTicketModal(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ padding: '28px', maxWidth: '480px' }}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                backgroundColor: 'rgba(113, 201, 206, 0.2)',
                color: 'var(--c-primary)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '10px'
              }}>
                <Ticket size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Official Campus Entry Pass
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--c-mid)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Verified Digital Ticket
              </p>
            </div>

            <div style={{
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px dashed var(--border-highlight)',
              borderRadius: 'var(--radius-md)',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>EVENT</span>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--c-lightest)' }}>{ticketModal.eventTitle}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>DATE & TIME</span>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{ticketModal.date} ({ticketModal.time})</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>VENUE</span>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{ticketModal.venue}</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>DELEGATE</span>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{ticketModal.studentName}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>ROLL NUMBER</span>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{ticketModal.rollNo}</div>
                </div>
              </div>
              <div style={{ borderTop: '1px dashed var(--border-subtle)', paddingTop: '10px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>BARCODE ID</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--c-primary)', letterSpacing: '2px' }}>
                  {ticketModal.ticketId}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
              <button onClick={() => setTicketModal(null)} className="btn-primary" style={{ width: '100%' }}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          CLAIM OWNERSHIP MODAL
          ==================================================================== */}
      {claimModalItem && (
        <div className="modal-overlay" onClick={() => setClaimModalItem(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
              Claim Ownership of Item
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Item: <strong>{claimModalItem.title}</strong> ({claimModalItem.location})
            </p>

            <form onSubmit={handleClaimSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--c-mid)', marginBottom: '6px', fontWeight: 600 }}>
                  Proof of Ownership / Identifiable Features*
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe unique scratches, serial numbers, wallpaper, decals, or internal contents..."
                  value={claimProof}
                  onChange={(e) => setClaimProof(e.target.value)}
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setClaimModalItem(null)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Submit for Dean Verification</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          REPORT LOST/FOUND ITEM MODAL
          ==================================================================== */}
      {reportModalOpen && (
        <div className="modal-overlay" onClick={() => setReportModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>
              Report Lost or Found Item
            </h3>
            <form onSubmit={handleReportSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--c-mid)', marginBottom: '6px' }}>Report Type</label>
                  <select
                    value={newReport.type}
                    onChange={(e) => setNewReport({ ...newReport, type: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}
                  >
                    <option value="lost">Lost Item</option>
                    <option value="found">Found Item</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--c-mid)', marginBottom: '6px' }}>Category</label>
                  <select
                    value={newReport.category}
                    onChange={(e) => setNewReport({ ...newReport, category: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Keys & Wallets">Keys & Wallets</option>
                    <option value="ID Cards">ID Cards</option>
                    <option value="Books & Stationery">Books & Stationery</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--c-mid)', marginBottom: '6px' }}>Item Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Blue Titan Water Bottle with NASA stickers"
                  value={newReport.title}
                  onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--c-mid)', marginBottom: '6px' }}>Location Found / Lost</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Library 2nd Floor Reading Hall"
                  value={newReport.location}
                  onChange={(e) => setNewReport({ ...newReport, location: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--c-mid)', marginBottom: '6px' }}>Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detailed description..."
                  value={newReport.description}
                  onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setReportModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Submit Report</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          CREATE EVENT MODAL (ADMIN)
          ==================================================================== */}
      {createEventModalOpen && (
        <div className="modal-overlay" onClick={() => setCreateEventModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>
              Publish Campus Event
            </h3>
            <form onSubmit={handleCreateEvent}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--c-mid)', marginBottom: '4px' }}>Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Technova Drone Racing Championship"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--c-mid)', marginBottom: '4px' }}>Category</label>
                  <select
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}
                  >
                    <option value="Fest">Fest</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Sports">Sports</option>
                    <option value="Cultural">Cultural</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--c-mid)', marginBottom: '4px' }}>Date</label>
                  <input
                    type="date"
                    required
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--c-mid)', marginBottom: '4px' }}>Venue</label>
                  <input
                    type="text"
                    required
                    value={newEvent.venue}
                    onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--c-mid)', marginBottom: '4px' }}>Capacity</label>
                  <input
                    type="number"
                    required
                    value={newEvent.capacity}
                    onChange={(e) => setNewEvent({ ...newEvent, capacity: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--c-mid)', marginBottom: '4px' }}>Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Details and highlights..."
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setCreateEventModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Publish Event</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
