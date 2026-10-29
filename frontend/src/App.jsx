import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { api } from './services/api';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import CampusAIModal from './components/CampusAIModal';
import NotificationDrawer from './components/NotificationDrawer';

import Dashboard from './pages/Dashboard';
import Academics from './pages/Academics';
import Notices from './pages/Notices';
import CampusLife from './pages/CampusLife';
import Opportunities from './pages/Opportunities';
import Marketplace from './pages/Marketplace';
import Utilities from './pages/Utilities';
import Profile from './pages/Profile';
import Login from './pages/Login';

import { Sparkles } from 'lucide-react';
import './styles/theme.css';

function MainLayout({ children }) {
  const { user, role } = useAuth();
  const [aiOpen, setAiOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();
  }, [role]);

  const loadNotifications = async () => {
    try {
      const data = await api.getNotifications(role);
      setNotifications(data);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReadAll = async () => {
    try {
      await api.readAllNotifications();
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        onOpenAI={() => setAiOpen(true)}
        onToggleNotifications={() => setNotificationsOpen(!notificationsOpen)}
        unreadCount={unreadCount}
      />

      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <main style={{ flex: 1, overflowX: 'hidden', backgroundColor: 'var(--bg-app)' }}>
          {children}
        </main>
      </div>

      {/* Floating Campus AI Button */}
      <button
        onClick={() => setAiOpen(true)}
        title="Ask Campus AI Assistant"
        style={{
          position: 'fixed',
          bottom: '26px',
          right: '26px',
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          backgroundColor: 'var(--c-primary)',
          color: '#07171e',
          border: 'none',
          boxShadow: '0 6px 20px rgba(113, 201, 206, 0.45)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 90,
          transition: 'transform 0.2s',
          animation: 'pulseGlow 3s infinite'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
      >
        <Sparkles size={24} />
      </button>

      {/* Campus AI Modal */}
      <CampusAIModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />

      {/* Notifications Drawer */}
      <NotificationDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onMarkRead={handleMarkRead}
        onReadAll={handleReadAll}
      />
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <MainLayout>{children}</MainLayout>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/academics" element={<ProtectedRoute><Academics /></ProtectedRoute>} />
          <Route path="/notices" element={<ProtectedRoute><Notices /></ProtectedRoute>} />
          <Route path="/campus-life" element={<ProtectedRoute><CampusLife /></ProtectedRoute>} />
          <Route path="/opportunities" element={<ProtectedRoute><Opportunities /></ProtectedRoute>} />
          <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
          <Route path="/utilities" element={<ProtectedRoute><Utilities /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
