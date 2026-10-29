const express = require('express');
const router = express.Router();
const { query } = require('../db/database');

// GET /api/clubs
router.get('/', (req, res) => {
  const { studentId } = req.query;
  try {
    const sql = `
      SELECT c.*, 
        COUNT(cm.id) as members_count,
        MAX(CASE WHEN cm.student_id = ? THEN 1 ELSE 0 END) as is_member
      FROM clubs c
      LEFT JOIN club_memberships cm ON c.id = cm.club_id
      GROUP BY c.id
      ORDER BY members_count DESC
    `;
    const rows = query.all(sql, [studentId || '']);
    const formatted = rows.map(r => ({
      ...r,
      is_member: Boolean(r.is_member)
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/clubs/:id/join
router.post('/:id/join', (req, res) => {
  const clubId = req.params.id;
  const { studentId } = req.body;

  try {
    const existing = query.get('SELECT * FROM club_memberships WHERE club_id = ? AND student_id = ?', [clubId, studentId || 'STU-2024-8842']);
    if (existing) {
      return res.status(400).json({ error: 'Already a member of this club' });
    }

    query.run('INSERT INTO club_memberships (club_id, student_id) VALUES (?, ?)', [clubId, studentId || 'STU-2024-8842']);
    res.json({ success: true, message: 'Joined club successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/clubs/:id/leave
router.post('/:id/leave', (req, res) => {
  const clubId = req.params.id;
  const { studentId } = req.body;

  try {
    query.run('DELETE FROM club_memberships WHERE club_id = ? AND student_id = ?', [clubId, studentId || 'STU-2024-8842']);
    res.json({ success: true, message: 'Left club' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/clubs (Admin create club)
router.post('/', (req, res) => {
  const { name, category, lead_name, meeting_info, logo_icon, description } = req.body;
  const id = `clb-${Date.now().toString().slice(-4)}`;

  try {
    query.run(
      `INSERT INTO clubs (id, name, category, lead_name, meeting_info, logo_icon, description)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, name, category || 'Technical', lead_name, meeting_info, logo_icon || '🏛️', description]
    );
    res.json({ success: true, message: 'Club registered', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
