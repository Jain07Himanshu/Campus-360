import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  User,
  Mail,
  Phone,
  Building,
  Award,
  GraduationCap,
  Calendar,
  Ticket,
  Shield,
  CheckCircle2,
  Users
} from 'lucide-react';

export default function Profile() {
  const { user, isAdmin, switchRole } = useAuth();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user?.id) return;
    try {
      const data = await api.getProfile(user.id);
      setProfileData(data.user);
    } catch (err) {
      console.error('Failed to load user profile:', err);
    }
  };

  const curr = profileData || user;

  return (
    <div className="animate-fade" style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(113, 201, 206, 0.18) 0%, rgba(203, 241, 245, 0.08) 100%)',
        border: '1px solid var(--border-highlight)',
        borderRadius: 'var(--radius-lg)',
        padding: '30px',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        boxShadow: 'var(--shadow-card)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '20px',
            backgroundColor: 'var(--c-primary)',
            color: '#081820',
            fontWeight: 800,
            fontSize: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(113, 201, 206, 0.4)'
          }}>
            {curr?.avatar || (isAdmin ? 'VM' : 'AT')}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge badge-teal">
                {isAdmin ? 'ADMINISTRATOR' : 'UNDERGRADUATE STUDENT'}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--c-mid)' }}>• ID: {curr?.id}</span>
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {curr?.name}
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {curr?.department} {curr?.year_semester ? `• ${curr?.year_semester}` : ''}
            </p>
          </div>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          backgroundColor: 'rgba(255,255,255,0.02)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
            <Mail size={15} color="#71C9CE" />
            <span style={{ color: 'var(--c-lightest)' }}>{curr?.email}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
            <Phone size={15} color="#71C9CE" />
            <span style={{ color: 'var(--c-lightest)' }}>{curr?.phone || '+91 98765 43210'}</span>
          </div>
        </div>
      </div>

      {/* Detail Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: isAdmin ? '1fr' : '1fr 1fr', gap: '24px' }}>
        {/* Left Column: Academic Credentials or Admin Role Details */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          boxShadow: 'var(--shadow-card)'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GraduationCap size={18} color="#71C9CE" />
            {isAdmin ? 'Administrative Authority' : 'Academic Credentials'}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem' }}>
            {!isAdmin ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Roll Number</span>
                  <span style={{ fontWeight: 700, color: 'var(--c-lightest)' }}>{curr?.roll_no || '21BCSE042'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Department</span>
                  <span style={{ fontWeight: 600 }}>{curr?.department}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Academic Standing</span>
                  <span style={{ fontWeight: 600 }}>{curr?.year_semester}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Cumulative GPA (CGPA)</span>
                  <span style={{ fontWeight: 800, color: 'var(--c-primary)', fontSize: '1.1rem' }}>{curr?.cgpa || '8.85'} / 10.0</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Portal Verification</span>
                  <span style={{ color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={15} /> Verified Active Student
                  </span>
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Administrative Designation</span>
                  <span style={{ fontWeight: 700, color: 'var(--c-lightest)' }}>Senior Administrator & Professor</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Jurisdiction</span>
                  <span style={{ fontWeight: 600 }}>Dean of Academic Affairs</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Permissions</span>
                  <span style={{ fontWeight: 600, color: 'var(--c-primary)' }}>Full System Superuser</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Column: Active Clubs & Registered Events (Students only) */}
        {!isAdmin && (
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            boxShadow: 'var(--shadow-card)'
          }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} color="#71C9CE" />
              Enrolled Societies & Registered Passes
            </h3>

            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--c-mid)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Affiliated Clubs:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                <span className="badge badge-teal">💻 Google Developer Student Club</span>
                <span className="badge badge-aqua">🏆 Athletics & Sports Committee</span>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--c-mid)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Active Digital Passes:
              </span>
              <div style={{
                marginTop: '8px',
                padding: '14px',
                backgroundColor: 'rgba(113, 201, 206, 0.08)',
                border: '1px solid var(--border-highlight)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--c-lightest)', fontSize: '0.9rem' }}>
                    Technova 2026: Flagship Fest
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Pass: TCK-TECHNOVA-8842
                  </div>
                </div>
                <Ticket size={20} color="#71C9CE" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
