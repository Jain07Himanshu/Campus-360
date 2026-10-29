import React from 'react';
import { Bell, CheckCheck, X, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotificationDrawer({ isOpen, onClose, notifications, onMarkRead, onReadAll }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '70px',
      right: '24px',
      width: '380px',
      maxHeight: '480px',
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border-highlight)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-card)',
      zIndex: 250,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      {/* Drawer Header */}
      <div style={{
        padding: '14px 18px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(113, 201, 206, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={18} color="#71C9CE" />
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
            System Notifications
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={onReadAll}
            title="Mark all as read"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--c-primary)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <CheckCheck size={14} />
            Read all
          </button>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Notifications list */}
      <div style={{ overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
            No new notifications.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => onMarkRead(n.id)}
              style={{
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: n.is_read ? 'transparent' : 'rgba(166, 227, 233, 0.08)',
                border: n.is_read ? '1px solid transparent' : '1px solid var(--border-highlight)',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: n.is_read ? 'var(--text-muted)' : 'var(--c-lightest)' }}>
                  {n.title}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--c-mid)' }}>
                  {n.timestamp}
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                {n.message}
              </p>
              {n.link && (
                <Link
                  to={n.link}
                  onClick={onClose}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.72rem',
                    color: 'var(--c-primary)',
                    marginTop: '6px',
                    textDecoration: 'none',
                    fontWeight: 600
                  }}
                >
                  View details <ExternalLink size={11} />
                </Link>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
