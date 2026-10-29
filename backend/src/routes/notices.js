const express = require('express');
const router = express.Router();
const { query } = require('../db/database');

// GET /api/notices
router.get('/', (req, res) => {
  const { category, urgent } = req.query;
  try {
    let sql = 'SELECT * FROM notices WHERE 1=1';
    const params = [];

    if (category && category !== 'all') {
      sql += ' AND category = ?';
      params.push(category);
    }
    if (urgent === 'true') {
      sql += ' AND is_urgent = 1';
    }

    sql += ' ORDER BY pinned DESC, date DESC';
    const rows = query.all(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/notices (Admin publish)
router.post('/', (req, res) => {
  const { title, category, department, content, author, is_urgent, pinned } = req.body;
  const id = `notif-${Date.now().toString().slice(-4)}`;
  const date = new Date().toISOString().split('T')[0];

  try {
    query.run(
      `INSERT INTO notices (id, title, category, department, content, author, date, time_ago, is_urgent, status, views, pinned)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'Just now', ?, 'published', 0, ?)`,
      [id, title, category || 'General', department || 'Academic Affairs', content, author || 'Administrator', date, is_urgent ? 1 : 0, pinned ? 1 : 0]
    );

    // Also add to notifications table
    query.run(
      `INSERT INTO notifications (id, title, message, timestamp, type, is_read, target_role, link)
       VALUES (?, ?, ?, 'Just now', 'notice', 0, 'all', '/notices')`,
      [`notif-sys-${Date.now().toString().slice(-4)}`, title, content.slice(0, 100) + '...']
    );

    res.json({ success: true, message: 'Notice published successfully', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/notices/:id/pin
router.patch('/:id/pin', (req, res) => {
  try {
    const notice = query.get('SELECT pinned FROM notices WHERE id = ?', [req.params.id]);
    if (!notice) return res.status(404).json({ error: 'Notice not found' });

    const newPinned = notice.pinned ? 0 : 1;
    query.run('UPDATE notices SET pinned = ? WHERE id = ?', [newPinned, req.params.id]);
    res.json({ success: true, pinned: newPinned });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/notices/:id
router.delete('/:id', (req, res) => {
  try {
    query.run('DELETE FROM notices WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Notice removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
