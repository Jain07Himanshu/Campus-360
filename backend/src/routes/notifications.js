const express = require('express');
const router = express.Router();
const { query } = require('../db/database');

// GET /api/notifications
router.get('/', (req, res) => {
  const { role } = req.query;
  try {
    let sql = 'SELECT * FROM notifications WHERE target_role = "all"';
    const params = [];
    if (role) {
      sql += ' OR target_role = ?';
      params.push(role);
    }
    sql += ' ORDER BY id DESC';

    const rows = query.all(sql, params);
    res.json(rows.map(r => ({ ...r, is_read: Boolean(r.is_read) })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/notifications/:id/read
router.patch('/:id/read', (req, res) => {
  try {
    query.run('UPDATE notifications SET is_read = 1 WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/notifications/read-all
router.post('/read-all', (req, res) => {
  try {
    query.run('UPDATE notifications SET is_read = 1');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
