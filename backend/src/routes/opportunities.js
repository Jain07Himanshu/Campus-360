const express = require('express');
const router = express.Router();
const { query } = require('../db/database');

// GET /api/opportunities
router.get('/', (req, res) => {
  const { studentId, type } = req.query;
  try {
    let sql = `
      SELECT o.*,
        MAX(CASE WHEN oi.student_id = ? AND oi.action_type = 'saved' THEN 1 ELSE 0 END) as is_saved,
        MAX(CASE WHEN oi.student_id = ? AND oi.action_type = 'applied' THEN 1 ELSE 0 END) as is_applied
      FROM opportunities o
      LEFT JOIN opportunity_interactions oi ON o.id = oi.opportunity_id
    `;
    const params = [studentId || '', studentId || ''];

    if (type && type !== 'all') {
      sql += ' WHERE o.type = ?';
      params.push(type);
    }

    sql += ' GROUP BY o.id ORDER BY o.deadline ASC';
    const rows = query.all(sql, params);

    const formatted = rows.map(r => ({
      ...r,
      is_saved: Boolean(r.is_saved),
      is_applied: Boolean(r.is_applied)
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/opportunities (Admin create)
router.post('/', (req, res) => {
  const { title, type, company, stipend, location, deadline, description, eligibility, apply_url } = req.body;
  const id = `opp-${Date.now().toString().slice(-4)}`;

  try {
    query.run(
      `INSERT INTO opportunities (id, title, type, company, stipend, location, deadline, description, eligibility, apply_url, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published')`,
      [id, title, type || 'Internship', company, stipend, location || 'Remote', deadline, description, eligibility, apply_url || '#apply']
    );
    res.json({ success: true, message: 'Opportunity posted successfully', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/opportunities/:id/interact (Save or Apply)
router.post('/:id/interact', (req, res) => {
  const oppId = req.params.id;
  const { studentId, action } = req.body; // action: 'saved' or 'applied'

  try {
    const existing = query.get(
      'SELECT * FROM opportunity_interactions WHERE opportunity_id = ? AND student_id = ? AND action_type = ?',
      [oppId, studentId || 'STU-2024-8842', action]
    );

    if (existing) {
      // Toggle off if it's 'saved'
      if (action === 'saved') {
        query.run(
          'DELETE FROM opportunity_interactions WHERE opportunity_id = ? AND student_id = ? AND action_type = ?',
          [oppId, studentId || 'STU-2024-8842', action]
        );
        return res.json({ success: true, active: false, message: 'Removed from bookmarks' });
      }
      return res.status(400).json({ error: 'Already applied' });
    }

    query.run(
      'INSERT INTO opportunity_interactions (opportunity_id, student_id, action_type) VALUES (?, ?, ?)',
      [oppId, studentId || 'STU-2024-8842', action]
    );

    res.json({ success: true, active: true, message: action === 'applied' ? 'Application submitted!' : 'Saved to bookmarks' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
