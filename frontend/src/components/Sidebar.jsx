import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  GraduationCap,
  Megaphone,
  Compass,
  Briefcase,
  ShoppingBag,
  Coffee,
  User,
  Shield,
  HelpCircle,
  Database
} from 'lucide-react';

export default function Sidebar() {
  const { role, isAdmin } = useAuth();

  const links = [
    { to: '/dashboard', label: 'Smart Dashboard', icon: LayoutDashboard },
    { to: '/academics', label: 'Academics Hub', icon: GraduationCap },
    { to: '/notices', label: 'Noticeboard', icon: Megaphone },
    { to: '/campus-life', label: 'Campus Life', icon: Compass },
    { to: '/opportunities', label: 'Opportunities', icon: Briefcase },
    { to: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
    { to: '/utilities', label: 'Campus Utilities', icon: Coffee },
    { to: '/profile', label: 'My Profile', icon: User },
  ];

  return (
    <aside style={{
      width: '260px',
      backgroundColor: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '24px 16px',
      minHeight: 'calc(100vh - 70px)'
    }}>
      <div>
        {/* Role Indicator Banner */}
        <div style={{
          backgroundColor: 'rgba(113, 201, 206, 0.08)',
          border: '1px solid var(--border-highlight)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 14px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Shield size={20} color="#71C9CE" />
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--c-mid)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
              Active Mode
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {isAdmin ? 'Administrator Console' : 'Student Portal'}
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 16px',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 600 : 500,
                  backgroundColor: isActive ? 'rgba(113, 201, 206, 0.14)' : 'transparent',
                  color: isActive ? 'var(--c-lightest)' : 'var(--text-muted)',
                  border: isActive ? '1px solid var(--border-highlight)' : '1px solid transparent',
                  boxShadow: isActive ? '0 0 12px rgba(113, 201, 206, 0.15)' : 'none',
                  transition: 'all 0.18s ease'
                })}
              >
                {({ isActive }) => (
                  <>
                    <Icon size={19} color={isActive ? '#71C9CE' : 'currentColor'} />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Info / SQL Telemetry badge */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '14px',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '6px' }}>
          <Database size={15} color="#71C9CE" />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--c-primary)', textTransform: 'uppercase' }}>
            SQLite Backend
          </span>
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', lineHeight: 1.3 }}>
          26 Relational SQL tables connected via Express API.
        </p>
      </div>
    </aside>
  );
}
