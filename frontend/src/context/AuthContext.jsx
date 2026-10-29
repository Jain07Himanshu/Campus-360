import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Initial default user for seamless demo evaluation
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('campus360_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return {
      id: 'STU-2024-8842',
      name: 'Alex Turner',
      email: 'student@campus360.edu',
      role: 'student',
      department: 'Computer Science & Engineering',
      year_semester: '3rd Year (Sem 6)',
      roll_no: '21BCSE042',
      cgpa: 8.85,
      avatar: 'AT'
    };
  });

  const [theme, setTheme] = useState(() => localStorage.getItem('campus360_theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('campus360_theme', theme);
  }, [theme]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('campus360_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('campus360_user');
    }
  }, [user]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const login = async (email, password) => {
    try {
      const res = await api.login(email, password);
      if (res.success && res.user) {
        setUser(res.user);
        return { success: true };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    setUser(null);
  };

  // 1-Click quick role switcher for evaluation/demo
  const switchRole = async (targetRole) => {
    const email = targetRole === 'admin' ? 'admin@campus360.edu' : 'student@campus360.edu';
    try {
      const res = await api.login(email, 'student123'); // seed passwords
      if (res && res.user) {
        setUser(res.user);
      }
    } catch (err) {
      // Fallback local toggle if server is offline
      if (targetRole === 'admin') {
        setUser({
          id: 'ADM-2024-001',
          name: 'Dr. Vikram Malhotra',
          email: 'admin@campus360.edu',
          role: 'admin',
          department: 'Dean of Academic Affairs',
          designation: 'Senior Administrator & Professor',
          avatar: 'VM'
        });
      } else {
        setUser({
          id: 'STU-2024-8842',
          name: 'Alex Turner',
          email: 'student@campus360.edu',
          role: 'student',
          department: 'Computer Science & Engineering',
          year_semester: '3rd Year (Sem 6)',
          roll_no: '21BCSE042',
          cgpa: 8.85,
          avatar: 'AT'
        });
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      role: user?.role || 'student',
      isAdmin: user?.role === 'admin',
      theme,
      toggleTheme,
      login,
      logout,
      switchRole
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
