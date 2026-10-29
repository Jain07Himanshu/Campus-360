import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Users,
  Compass,
  Bus,
  Coffee,
  LifeBuoy,
  ChevronRight,
  TrendingUp,
  MapPin,
  Sparkles,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user, role, isAdmin } = useAuth();
  const [attendance, setAttendance] = useState({ overallPercentage: 85.2, subjects: [] });
  const [timetableToday, setTimetableToday] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grievances, setGrievances] = useState([]);
  const [lostFound, setLostFound] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      if (isAdmin) {
        // Load admin console data
        const [gRes, lfRes] = await Promise.all([
          api.getGrievances(),
          api.getLostFound()
        ]);
        setGrievances(gRes);
        setLostFound(lfRes.filter(item => item.claims && item.claims.some(c => c.status === 'pending')));
      } else {
        // Load student console data
        const [attRes, ttRes, asgRes] = await Promise.all([
          api.getAttendance(user?.id || 'STU-2024-8842'),
          api.getTimetable('Monday'), // Default current day demo
          api.getAssignments(user?.id || 'STU-2024-8842')
        ]);
        setAttendance(attRes);
        setTimetableToday(ttRes['Monday'] || []);
        setAssignments(asgRes.filter(a => a.status === 'pending'));
      }
    } catch (err) {
      console.error('Failed to load dashboard telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveGrievance = async (id) => {
    try {
      await api.updateGrievanceStatus(id, {
        status: 'resolved',
        admin_notes: 'Action taken and resolved by Dean of Academic Affairs.'
      });
      loadDashboardData();
    } catch (err) {
      alert('Error updating grievance status');
    }
  };

  const handleClaimReview = async (claimId, itemId, action) => {
    try {
      await api.updateClaimStatus(claimId, { status: action, itemId });
      loadDashboardData();
    } catch (err) {
      alert('Error updating claim status');
    }
  };

  return (
    <div className="animate-fade" style={{ padding: '24px', maxWidth: '1300px', margin: '0 auto' }}>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(113, 201, 206, 0.15) 0%, rgba(203, 241, 245, 0.08) 50%, rgba(227, 253, 253, 0.03) 100%)',
        border: '1px solid var(--border-highlight)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px 28px',
        marginBottom: '28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: 'var(--shadow-card)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-teal">
              {isAdmin ? 'EXECUTIVE COMMAND' : 'STUDENT CONSOLE'}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--c-mid)' }}>• Spring 2026 Academic Session</span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
            Welcome back, {user?.name || (isAdmin ? 'Dr. Vikram Malhotra' : 'Alex Turner')}
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {isAdmin 
              ? `${user?.department || 'Dean Office'} • Real-time Campus Administration & Operations`
              : `${user?.department || 'Computer Engineering'} • Roll No: ${user?.roll_no || '21BCSE042'} • CGPA: ${user?.cgpa || '8.85'}`
            }
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          {isAdmin ? (
            <Link to="/notices" className="btn-primary">
              <FileText size={16} />
              Publish Circular
            </Link>
          ) : (
            <Link to="/academics" className="btn-primary">
              <Calendar size={16} />
              View Full Timetable
            </Link>
          )}
        </div>
      </div>

      {/* ====================================================================
          STUDENT VIEW
          ==================================================================== */}
      {!isAdmin && (
        <>
          {/* 4 Metric Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '18px',
            marginBottom: '28px'
          }}>
            {/* Card 1: Attendance */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-card)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Overall Attendance</span>
                <span className="badge badge-teal">Safe Zone</span>
              </div>
              <div style={{ margin: '14px 0 8px' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--c-lightest)' }}>
                  {attendance.overallPercentage}%
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--c-mid)', marginLeft: '8px' }}>
                  ({attendance.totalAttended}/{attendance.totalClasses} classes)
                </span>
              </div>
              {/* Progress bar */}
              <div style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${attendance.overallPercentage}%`,
                  backgroundColor: 'var(--c-primary)',
                  borderRadius: '999px'
                }} />
              </div>
            </div>

            {/* Card 2: Next Scheduled Lecture */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-card)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Next Up Today</span>
                <span className="badge badge-aqua">09:00 AM</span>
              </div>
              <div style={{ margin: '12px 0 4px' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Data Structures & Algorithms
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--c-mid)', marginTop: '2px' }}>
                  Room L-201 • Prof. Sharma (CS301)
                </p>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Lecture Hall Block A</span>
            </div>

            {/* Card 3: Due Assignments */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-card)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pending Coursework</span>
                <span className="badge badge-urgent">{assignments.length} Due</span>
              </div>
              <div style={{ margin: '14px 0 8px' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: '#fb7185' }}>
                  {assignments.length}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '8px' }}>
                  Assignments to submit
                </span>
              </div>
              <Link to="/academics" style={{ fontSize: '0.78rem', color: 'var(--c-primary)', textDecoration: 'none', fontWeight: 600 }}>
                Submit records & assignments →
              </Link>
            </div>

            {/* Card 4: Mid-Term Seating */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-card)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Mid-Term Seating</span>
                <span className="badge badge-ice">Hall Ticket</span>
              </div>
              <div style={{ margin: '12px 0 4px' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--c-lightest)' }}>
                  Exam Hall 301
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--c-primary)', fontWeight: 600 }}>
                  Seat: Block B-14
                </div>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Commencing March 2, 2026</span>
            </div>
          </div>

          {/* Quick Action Shortcuts Bar */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            marginBottom: '28px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--c-mid)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Campus Shortcuts:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <Link to="/campus-life?tab=lostfound" className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                <Compass size={14} color="#71C9CE" />
                Lost & Found Registry
              </Link>
              <Link to="/campus-life?tab=map" className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                <MapPin size={14} color="#71C9CE" />
                Campus Walking Directions
              </Link>
              <Link to="/utilities?tab=canteen" className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                <Coffee size={14} color="#71C9CE" />
                Canteen Daily Menu
              </Link>
              <Link to="/utilities?tab=bus" className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                <Bus size={14} color="#71C9CE" />
                Bus Routes Schedule
              </Link>
              <Link to="/utilities?tab=grievance" className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                <LifeBuoy size={14} color="#71C9CE" />
                Report Grievance
              </Link>
            </div>
          </div>

          {/* 2-Column Section: Today's Schedule & Subject Attendance Ledger */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
            {/* Column 1: Today's Class Schedule */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              boxShadow: 'var(--shadow-card)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={18} color="#71C9CE" />
                  Today's Lectures & Labs
                </h3>
                <span className="badge badge-aqua">Monday Routine</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {timetableToday.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: index === 0 ? 'rgba(113, 201, 206, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                      border: index === 0 ? '1px solid var(--border-highlight)' : '1px solid var(--border-subtle)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: index === 0 ? 'var(--c-primary)' : 'rgba(166, 227, 233, 0.1)',
                        color: index === 0 ? '#081820' : 'var(--c-mid)',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {item.period}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                          {item.subject}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {item.room} • {item.faculty} • <span style={{ color: 'var(--c-mid)' }}>{item.class_type}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--c-lightest)' }}>
                        {item.time_slot}
                      </span>
                      {index === 0 && (
                        <div style={{ fontSize: '0.68rem', color: 'var(--c-primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                          Next
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Subject Attendance Breakdown */}
            <div style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              boxShadow: 'var(--shadow-card)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrendingUp size={18} color="#71C9CE" />
                  Subject Attendance Ledger
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Min Required: 75%</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {attendance.subjects?.map((sub, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {sub.subject}
                      </span>
                      <span style={{
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        color: sub.percentage < 75 ? '#fb7185' : 'var(--c-primary)'
                      }}>
                        {sub.percentage}% ({sub.attended}/{sub.total})
                      </span>
                    </div>

                    <div style={{ height: '7px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${Math.min(100, sub.percentage)}%`,
                        backgroundColor: sub.percentage < 75 ? '#fb7185' : 'var(--c-primary)',
                        borderRadius: '999px'
                      }} />
                    </div>

                    {sub.percentage < 75 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', color: '#fb7185', fontSize: '0.72rem' }}>
                        <AlertTriangle size={12} />
                        {sub.margin_note || 'Warning: Attendance is below institute minimum threshold!'}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ====================================================================
          ADMINISTRATOR VIEW
          ==================================================================== */}
      {isAdmin && (
        <>
          {/* Executive Metrics Overview */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '18px',
            marginBottom: '28px'
          }}>
            <div style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              boxShadow: 'var(--shadow-card)'
            }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Enrolled Students</span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--c-lightest)', margin: '10px 0 4px' }}>
                4 Active
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--c-primary)' }}>All departments verified</span>
            </div>

            <div style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              boxShadow: 'var(--shadow-card)'
            }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Courses</span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--c-lightest)', margin: '10px 0 4px' }}>
                11
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--c-mid)' }}>Computer & Electronics</span>
            </div>

            <div style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              boxShadow: 'var(--shadow-card)'
            }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pending Grievances</span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fb7185', margin: '10px 0 4px' }}>
                {grievances.filter(g => g.status !== 'resolved').length} Open
              </div>
              <span style={{ fontSize: '0.75rem', color: '#fb7185' }}>Requires Dean resolution</span>
            </div>

            <div style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              boxShadow: 'var(--shadow-card)'
            }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Lost & Found Claims</span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--c-primary)', margin: '10px 0 4px' }}>
                {lostFound.length} Pending
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--c-primary)' }}>Awaiting verification</span>
            </div>
          </div>

          {/* Grievance Management Console */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            marginBottom: '28px',
            boxShadow: 'var(--shadow-card)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldAlert size={18} color="#71C9CE" />
                  Student Grievance & Issue Resolution Console
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Review incoming complaints, Wi-Fi issues, and facilities feedback.
                </p>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--c-mid)' }}>
                    <th style={{ padding: '10px' }}>Ticket ID</th>
                    <th style={{ padding: '10px' }}>Student</th>
                    <th style={{ padding: '10px' }}>Category</th>
                    <th style={{ padding: '10px' }}>Issue Summary</th>
                    <th style={{ padding: '10px' }}>Date</th>
                    <th style={{ padding: '10px' }}>Status</th>
                    <th style={{ padding: '10px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {grievances.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '12px 10px', fontWeight: 600, color: 'var(--c-lightest)' }}>{item.id}</td>
                      <td style={{ padding: '12px 10px' }}>{item.student_name}</td>
                      <td style={{ padding: '12px 10px' }}>
                        <span className="badge badge-aqua">{item.category}</span>
                      </td>
                      <td style={{ padding: '12px 10px', maxWidth: '300px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.description}</div>
                      </td>
                      <td style={{ padding: '12px 10px', color: 'var(--text-dim)' }}>{item.submission_date}</td>
                      <td style={{ padding: '12px 10px' }}>
                        <span className={`badge ${item.status === 'resolved' ? 'badge-teal' : 'badge-urgent'}`}>
                          {item.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        {item.status !== 'resolved' ? (
                          <button
                            onClick={() => handleResolveGrievance(item.id)}
                            className="btn-primary"
                            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                          >
                            Mark Resolved
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--c-mid)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle2 size={13} color="#71C9CE" /> Resolved
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Lost & Found Ownership Claims Verification */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            boxShadow: 'var(--shadow-card)'
          }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} color="#71C9CE" />
              Lost & Found Claims Verification Desk
            </h3>

            {lostFound.length === 0 ? (
              <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>No pending ownership claims.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {lostFound.map((item) => (
                  item.claims.filter(c => c.status === 'pending').map((claim) => (
                    <div
                      key={claim.id}
                      style={{
                        padding: '16px',
                        backgroundColor: 'rgba(255,255,255,0.02)',
                        border: '1px solid var(--border-highlight)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '12px'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                            {item.title}
                          </span>
                          <span className="badge badge-aqua">{item.location}</span>
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--c-lightest)' }}>
                          Claimed by: <strong>{claim.claimant_name}</strong> ({claim.claimant_dept})
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          Proof description: "<em>{claim.proof_description}</em>"
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleClaimReview(claim.id, item.id, 'approved')}
                          className="btn-primary"
                          style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                        >
                          Approve Return
                        </button>
                        <button
                          onClick={() => handleClaimReview(claim.id, item.id, 'rejected')}
                          className="btn-secondary"
                          style={{ padding: '6px 14px', fontSize: '0.8rem', borderColor: '#f43f5e', color: '#fb7185' }}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
