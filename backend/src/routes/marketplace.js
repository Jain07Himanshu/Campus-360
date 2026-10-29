const express = require('express');
const router = express.Router();
const { query } = require('../db/database');

// GET /api/marketplace
router.get('/', (req, res) => {
  const { category, search } = req.query;
  try {
    let sql = "SELECT * FROM marketplace_items WHERE status = 'approved'";
    const params = [];

    if (category && category !== 'all') {
      sql += ' AND category = ?';
      params.push(category);
    }
    if (search) {
      sql += ' AND (title LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY item_date DESC';
    const rows = query.all(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/marketplace (Post item)
router.post('/', (req, res) => {
  const { title, category, price, condition_grade, seller_id, seller_name, seller_contact, description } = req.body;
  const id = `mkt-${Date.now().toString().slice(-4)}`;
  const item_date = new Date().toISOString().split('T')[0];

  try {
    query.run(
      `INSERT INTO marketplace_items (id, title, category, price, condition_grade, seller_id, seller_name, seller_contact, item_date, description, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved')`,
      [id, title, category || 'Textbooks', price || 100, condition_grade || 'Good', seller_id || 'STU-2024-8842', seller_name || 'Alex Turner', seller_contact || 'student@campus360.edu', item_date, description]
    );
    res.json({ success: true, message: 'Item posted to marketplace', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/marketplace/:id/status
router.patch('/:id/status', (req, res) => {
  const { status } = req.body;
  try {
    query.run('UPDATE marketplace_items SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ success: true, message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
