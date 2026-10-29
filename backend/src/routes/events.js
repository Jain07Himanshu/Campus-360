const express = require('express');
const router = express.Router();
const { query } = require('../db/database');

// GET /api/events
router.get('/', (req, res) => {
  const { studentId, category } = req.query;
  try {
    let sql = `
      SELECT e.*, 
        COUNT(er.id) as registered_count,
        MAX(CASE WHEN er.student_id = ? THEN 1 ELSE 0 END) as is_registered,
        MAX(CASE WHEN er.student_id = ? THEN er.ticket_id ELSE NULL END) as my_ticket_id
      FROM events e
      LEFT JOIN event_registrations er ON e.id = er.event_id
    `;
    const params = [studentId || '', studentId || ''];

    if (category && category !== 'all') {
      sql += ' WHERE e.category = ?';
      params.push(category);
    }

    sql += ' GROUP BY e.id ORDER BY e.date ASC';
    const rows = query.all(sql, params);

    // Format tags
    const formatted = rows.map(r => ({
      ...r,
      tags: r.tags ? r.tags.split(',').map(t => t.trim()) : [],
      is_registered: Boolean(r.is_registered)
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/events (Admin create)
router.post('/', (req, res) => {
  const { title, category, date, end_date, time, venue, organizer, capacity, description, fee, tags } = req.body;
  const id = `evt-${Date.now().toString().slice(-4)}`;

  try {
    query.run(
      `INSERT INTO events (id, title, category, date, end_date, time, venue, organizer, capacity, description, fee, tags, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published')`,
      [id, title, category || 'Fest', date, end_date || date, time, venue, organizer || 'Student Affairs', capacity || 200, description, fee || 'Free', tags || '']
    );
    res.json({ success: true, message: 'Event created successfully', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/events/:id/register (Student register)
router.post('/:id/register', (req, res) => {
  const eventId = req.params.id;
  const { studentId } = req.body;
  const ticketId = `TCK-${eventId.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  try {
    const existing = query.get('SELECT * FROM event_registrations WHERE event_id = ? AND student_id = ?', [eventId, studentId || 'STU-2024-8842']);
    if (existing) {
      return res.status(400).json({ error: 'Already registered for this event', ticketId: existing.ticket_id });
    }

    query.run(
      'INSERT INTO event_registrations (event_id, student_id, ticket_id) VALUES (?, ?, ?)',
      [eventId, studentId || 'STU-2024-8842', ticketId]
    );

    res.json({ success: true, message: 'Registration confirmed!', ticketId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/events/:id/unregister
router.post('/:id/unregister', (req, res) => {
  const eventId = req.params.id;
  const { studentId } = req.body;

  try {
    query.run('DELETE FROM event_registrations WHERE event_id = ? AND student_id = ?', [eventId, studentId || 'STU-2024-8842']);
    res.json({ success: true, message: 'Registration cancelled' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
