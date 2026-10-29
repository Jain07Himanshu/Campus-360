import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useSearchParams } from 'react-router-dom';
import {
  Coffee,
  Bus,
  LifeBuoy,
  PhoneCall,
  CheckCircle2,
  Clock,
  PlusCircle,
  AlertCircle,
  ShieldCheck,
  Send
} from 'lucide-react';

export default function Utilities() {
  const { user, isAdmin } = useAuth();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'canteen';
  const [activeTab, setActiveTab] = useState(initialTab); // 'canteen', 'bus', 'emergency', 'grievance'

  // Data
  const [canteenMenu, setCanteenMenu] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [emergency, setEmergency] = useState([]);
  const [grievances, setGrievances] = useState([]);

  // Grievance form
  const [grievanceCategory, setGrievanceCategory] = useState('Wi-Fi & Network');
  const [grievanceTitle, setGrievanceTitle] = useState('');
  const [grievanceDesc, setGrievanceDesc] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState(null);

  // Canteen filter
  const [canteenCategory, setCanteenCategory] = useState('all');

  useEffect(() => {
    loadAllUtilities();
  }, [user]);

  const loadAllUtilities = async () => {
    try {
      const [cnt, rt, emg, grv] = await Promise.all([
        api.getCanteenMenu(),
        api.getRoutes(),
        api.getEmergencyContacts(),
        api.getGrievances()
      ]);
      setCanteenMenu(cnt);
      setRoutes(rt);
      setEmergency(emg);
      setGrievances(grv);
    } catch (err) {
      console.error('Failed to load utilities:', err);
    }
  };

  const handleGrievanceSubmit = async (e) => {
    e.preventDefault();
    if (!grievanceTitle.trim() || !grievanceDesc.trim()) return;

    try {
      const res = await api.submitGrievance({
        category: grievanceCategory,
        title: grievanceTitle,
        description: grievanceDesc,
        student_name: user?.name || 'Alex Turner'
      });
      setSubmittedTicket(res.id);
      setGrievanceTitle('');
      setGrievanceDesc('');
      loadAllUtilities();
    } catch (err) {
      alert(err.message);
    }
  };

  const canteenFiltered = canteenCategory === 'all'
    ? canteenMenu
    : canteenMenu.filter(m => m.category === canteenCategory);

  return (
    <div className="animate-fade" style={{ padding: '24px', maxWidth: '1300px', margin: '0 auto' }}>
      {/* Title & Tabs */}
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
            Campus Utilities & Services
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Central food court menu, transport bus tracker, 24/7 helplines, and grievance registry
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-full)',
          padding: '4px',
          gap: '4px'
        }}>
          {[
            { id: 'canteen', label: 'Canteen Menu', icon: Coffee },
            { id: 'bus', label: 'Transport Bus', icon: Bus },
            { id: 'emergency', label: '24/7 Helplines', icon: PhoneCall },
            { id: 'grievance', label: 'Grievance Tracker', icon: LifeBuoy },
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
          TAB 1: CANTEEN MENU
          ==================================================================== */}
      {activeTab === 'canteen' && (
        <div className="animate-fade">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['all', 'Breakfast', 'Lunch', 'Snacks', 'Beverages'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCanteenCategory(cat)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    border: canteenCategory === cat ? '1px solid var(--c-primary)' : '1px solid var(--border-subtle)',
                    backgroundColor: canteenCategory === cat ? 'rgba(113, 201, 206, 0.15)' : 'var(--bg-card)',
                    color: canteenCategory === cat ? 'var(--c-lightest)' : 'var(--text-muted)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {cat === 'all' ? 'Full Menu' : cat}
                </button>
              ))}
            </div>

            <div style={{ fontSize: '0.82rem', color: 'var(--c-mid)' }}>
              ⏰ Canteen Hours: <strong>08:00 AM – 07:30 PM</strong> daily
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '18px'
          }}>
            {canteenFiltered.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '18px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: 'var(--shadow-card)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{
                      width: '12px',
                      height: '12px',
                      border: '1px solid #10b981',
                      borderRadius: '2px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                    </span>
                    <span className="badge badge-aqua">{item.category}</span>
                    {item.availability === 'Popular' && <span className="badge badge-teal">Popular</span>}
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '4px' }}>
                    {item.name}
                  </h4>
                  {item.description && (
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '240px' }}>
                      {item.description}
                    </p>
                  )}
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--c-primary)' }}>
                    ₹{item.price}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--c-lightest)' }}>Available</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ====================================================================
          TAB 2: TRANSPORT BUS ROUTES
          ==================================================================== */}
      {activeTab === 'bus' && (
        <div className="animate-fade">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '22px' }}>
            {routes.map((route) => (
              <div
                key={route.id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-card)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span className="badge badge-teal">{route.vehicle}</span>
                    <span className={`badge ${route.status === 'On Time' ? 'badge-teal' : 'badge-aqua'}`}>
                      {route.status}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                    {route.route_number}
                  </h3>

                  <div style={{ fontSize: '0.82rem', color: 'var(--c-mid)', marginBottom: '14px', lineHeight: 1.4 }}>
                    📍 <strong>Stops:</strong> {route.pickup_points}
                  </div>

                  <div style={{
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px',
                    fontSize: '0.8rem',
                    color: 'var(--c-lightest)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}>
                    <div>🌅 <strong>Morning Departures:</strong> {route.morning_times}</div>
                    <div>🌇 <strong>Evening Returns:</strong> {route.evening_times}</div>
                  </div>
                </div>

                <div style={{ marginTop: '16px', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  GPS Tracking verified with Campus Transport Terminal.
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ====================================================================
          TAB 3: EMERGENCY CONTACTS & MEDICAL
          ==================================================================== */}
      {activeTab === 'emergency' && (
        <div className="animate-fade">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px'
          }}>
            {emergency.map((contact) => (
              <div
                key={contact.id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-highlight)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px',
                  boxShadow: 'var(--shadow-card)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <PhoneCall size={20} color="#71C9CE" />
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {contact.title}
                  </h4>
                </div>

                <div style={{ margin: '14px 0 10px' }}>
                  <a
                    href={`tel:${contact.contact_number}`}
                    style={{
                      fontSize: '1.35rem',
                      fontWeight: 800,
                      color: 'var(--c-primary)',
                      textDecoration: 'none'
                    }}
                  >
                    {contact.contact_number}
                  </a>
                  <span style={{ fontSize: '0.82rem', color: 'var(--c-mid)', marginLeft: '8px' }}>
                    (Ext: {contact.extension})
                  </span>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Availability: <strong>{contact.available_hours}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ====================================================================
          TAB 4: GRIEVANCE TICKETING & TRACKER
          ==================================================================== */}
      {activeTab === 'grievance' && (
        <div className="animate-fade" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '24px' }}>
          {/* Submit Grievance Form */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '26px',
            boxShadow: 'var(--shadow-card)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
              Report Campus Issue / Grievance
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Generates a tracked ticket routed directly to Dean of Academic Affairs & Infrastructure.
            </p>

            {submittedTicket && (
              <div style={{
                backgroundColor: 'rgba(113, 201, 206, 0.15)',
                border: '1px solid var(--c-primary)',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                marginBottom: '18px',
                fontSize: '0.85rem',
                color: 'var(--c-lightest)'
              }}>
                ✅ <strong>Ticket Generated Successfully!</strong> Your tracking ID is <strong>{submittedTicket}</strong>. You can view its progress on the right tracker.
              </div>
            )}

            <form onSubmit={handleGrievanceSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--c-mid)', marginBottom: '6px', fontWeight: 600 }}>Category</label>
                <select
                  value={grievanceCategory}
                  onChange={(e) => setGrievanceCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)'
                  }}
                >
                  <option value="Wi-Fi & Network">Wi-Fi & Network Connectivity</option>
                  <option value="Facilities & Infrastructure">Facilities & Lab Equipment</option>
                  <option value="Canteen & Hygiene">Canteen & Hygiene</option>
                  <option value="Hostel & Transport">Hostel & Transport</option>
                  <option value="Academic Support">Academic Support & Evaluation</option>
                </select>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--c-mid)', marginBottom: '6px', fontWeight: 600 }}>Issue Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Projector audio failure in Seminar Hall 2"
                  value={grievanceTitle}
                  onChange={(e) => setGrievanceTitle(e.target.value)}
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

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--c-mid)', marginBottom: '6px', fontWeight: 600 }}>Detailed Description</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Please specify classroom/bench number, timestamp, and reproduction details..."
                  value={grievanceDesc}
                  onChange={(e) => setGrievanceDesc(e.target.value)}
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

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <Send size={16} />
                Submit Grievance Ticket
              </button>
            </form>
          </div>

          {/* Grievance Status Tracker */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '26px',
            boxShadow: 'var(--shadow-card)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}>
              Active Grievance Log
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '520px', overflowY: 'auto' }}>
              {grievances.map((g) => (
                <div
                  key={g.id}
                  style={{
                    padding: '16px',
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--c-primary)' }}>{g.id}</span>
                    <span className={`badge ${g.status === 'resolved' ? 'badge-teal' : 'badge-urgent'}`}>
                      {g.status.toUpperCase()}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-main)' }}>{g.title}</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>{g.description}</p>
                  
                  {g.admin_notes && (
                    <div style={{
                      marginTop: '8px',
                      padding: '8px',
                      backgroundColor: 'rgba(113, 201, 206, 0.08)',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      color: 'var(--c-lightest)'
                    }}>
                      Dean Note: "{g.admin_notes}"
                    </div>
                  )}

                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '8px' }}>
                    Filed by {g.student_name} on {g.submission_date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
