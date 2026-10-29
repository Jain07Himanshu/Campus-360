const express = require('express');
const router = express.Router();
const { query } = require('../db/database');

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password, role } = req.body;

  try {
    let sql = 'SELECT * FROM users WHERE email = ?';
    let params = [email];
    
    if (password) {
      sql += ' AND password = ?';
      params.push(password);
    }
    
    const user = query.get(sql, params);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials. Use demo logins: student@campus360.edu / student123 or admin@campus360.edu / admin123' });
    }

    // Attach student or administrator details
    let profileData = {};
    if (user.role === 'student') {
      const student = query.get('SELECT * FROM students WHERE id = ?', [user.id]);
      profileData = student || {};
    } else if (user.role === 'admin') {
      const admin = query.get('SELECT * FROM administrators WHERE id = ?', [user.id]);
      profileData = admin || {};
    }

    res.json({
      success: true,
      user: {
        ...user,
        ...profileData
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/profile/:id
router.get('/profile/:id', (req, res) => {
  try {
    const user = query.get('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let extra = {};
    if (user.role === 'student') {
      const student = query.get('SELECT * FROM students WHERE id = ?', [user.id]);
      const clubs = query.all(`
        SELECT c.* FROM clubs c
        JOIN club_memberships cm ON c.id = cm.club_id
        WHERE cm.student_id = ?
      `, [user.id]);
      const registeredEvents = query.all(`
        SELECT e.*, er.ticket_id FROM events e
        JOIN event_registrations er ON e.id = er.event_id
        WHERE er.student_id = ?
      `, [user.id]);

      extra = {
        ...student,
        clubs,
        registeredEvents
      };
    } else if (user.role === 'admin') {
      const admin = query.get('SELECT * FROM administrators WHERE id = ?', [user.id]);
      extra = admin || {};
    }

    res.json({
      success: true,
      user: { ...user, ...extra }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/users
router.get('/users', (req, res) => {
  try {
    const users = query.all('SELECT id, name, email, role, avatar, phone FROM users');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
