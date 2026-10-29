import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Bell, 
  Sun, 
  Moon, 
  Search, 
  ShieldCheck, 
  UserCheck, 
  LogOut,
  Compass
} from 'lucide-react';
import { api } from '../services/api';

export default function Navbar({ onOpenAI, onToggleNotifications, unreadCount }) {
  const { user, role, isAdmin, theme, toggleTheme, switchRole, logout } = useAuth();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header style={{
      height: '70px',
      backgroundColor: 'var(--bg-topbar)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Brand & Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #71C9CE 0%, #A6E3E9 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#06131a',
            fontWeight: 800,
            fontSize: '1.2rem',
            boxShadow: '0 0 16px rgba(113, 201, 206, 0.4)'
          }}>
            360
          </div>
          <div>
            <span style={{ 
              fontSize: '1.25rem', 
              fontWeight: 800, 
              background: 'linear-gradient(90deg, #E3FDFD 0%, #CBF1F5 50%, #71C9CE 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px'
            }}>
              Campus 360
            </span>
            <span style={{ 
              display: 'block', 
              fontSize: '0.68rem', 
              color: 'var(--c-mid)', 
              fontWeight: 600, 
              letterSpacing: '1px',
              textTransform: 'uppercase'
            }}>
              Smart College OS
            </span>
          </div>
        </Link>
      </div>

      {/* Center: Search & Demo Role Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Role Toggle Switcher */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-highlight)',
          borderRadius: 'var(--radius-full)',
          padding: '3px',
          gap: '4px'
        }}>
          <button
            onClick={() => switchRole('student')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: role === 'student' ? 'var(--c-primary)' : 'transparent',
              color: role === 'student' ? '#07171e' : 'var(--text-muted)',
              transition: 'all 0.2s'
            }}
          >
            <UserCheck size={14} />
            Student Demo
          </button>
          <button
            onClick={() => switchRole('admin')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: role === 'admin' ? 'var(--c-primary)' : 'transparent',
              color: role === 'admin' ? '#07171e' : 'var(--text-muted)',
              transition: 'all 0.2s'
            }}
          >
            <ShieldCheck size={14} />
            Admin Demo
          </button>
        </div>

        {/* AI Assistant Quick Trigger */}
        <button
          onClick={onOpenAI}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(113, 201, 206, 0.15)',
            border: '1px solid var(--c-primary)',
            color: 'var(--c-lightest)',
            padding: '7px 16px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
            animation: 'pulseGlow 3s infinite'
          }}
        >
          <Sparkles size={16} color="#71C9CE" />
          Campus AI
        </button>
      </div>

      {/* Right Actions: Notifications, Theme, Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title="Toggle Dark / Light Theme"
          style={{
            background: 'none',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--c-mid)',
            cursor: 'pointer'
          }}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <button
          onClick={onToggleNotifications}
          style={{
            background: 'none',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--c-mid)',
            cursor: 'pointer',
            position: 'relative'
          }}
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              backgroundColor: '#f43f5e',
              color: 'white',
              fontSize: '0.65rem',
              fontWeight: 700,
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Identity Pill */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '5px 12px 5px 6px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer'
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--c-primary)',
              color: '#081820',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {user?.avatar || (isAdmin ? 'VM' : 'AT')}
            </div>
            <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {user?.name || (isAdmin ? 'Dr. Vikram Malhotra' : 'Alex Turner')}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--c-mid)', fontWeight: 500 }}>
                {isAdmin ? 'Senior Administrator' : user?.roll_no || '21BCSE042'}
              </div>
            </div>
          </div>

          {/* Profile Dropdown */}
          {profileMenuOpen && (
            <div style={{
              position: 'absolute',
              top: '48px',
              right: 0,
              width: '210px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-highlight)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-card)',
              padding: '8px',
              zIndex: 200
            }}>
              <Link
                to="/profile"
                onClick={() => setProfileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 12px',
                  color: 'var(--text-main)',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  borderRadius: '6px',
                  transition: 'background 0.2s'
                }}
              >
                <UserCheck size={16} color="#71C9CE" />
                View Full Profile
              </Link>
              <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', margin: '6px 0' }} />
              <button
                onClick={() => {
                  setProfileMenuOpen(false);
                  logout();
                  navigate('/login');
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 12px',
                  color: '#fb7185',
                  background: 'none',
                  border: 'none',
                  fontSize: '0.85rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
