const express = require('express');
const router = express.Router();
const { query } = require('../db/database');

// GET /api/utilities/canteen
router.get('/canteen', (req, res) => {
  try {
    const rows = query.all('SELECT * FROM canteen_menu ORDER BY price ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/utilities/locations
router.get('/locations', (req, res) => {
  try {
    const rows = query.all('SELECT * FROM campus_locations ORDER BY building, name');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/utilities/routes
router.get('/routes', (req, res) => {
  try {
    const rows = query.all('SELECT * FROM transport_routes');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/utilities/emergency
router.get('/emergency', (req, res) => {
  try {
    const rows = query.all('SELECT * FROM emergency_contacts');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/utilities/grievances
router.get('/grievances', (req, res) => {
  try {
    const rows = query.all('SELECT * FROM feedback_grievances ORDER BY submission_date DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/utilities/grievances (Student report issue)
router.post('/grievances', (req, res) => {
  const { category, title, description, student_name } = req.body;
  const id = `ISSUE-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
  const submission_date = new Date().toISOString().split('T')[0];

  try {
    query.run(
      `INSERT INTO feedback_grievances (id, category, title, description, submission_date, student_name, status, admin_notes)
       VALUES (?, ?, ?, ?, ?, ?, 'submitted', NULL)`,
      [id, category || 'General', title, description, submission_date, student_name || 'Alex Turner']
    );
    res.json({ success: true, message: 'Grievance ticket created successfully', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/utilities/grievances/:id/status (Admin resolve/update)
router.patch('/grievances/:id/status', (req, res) => {
  const { status, admin_notes } = req.body;
  try {
    query.run(
      'UPDATE feedback_grievances SET status = ?, admin_notes = ? WHERE id = ?',
      [status || 'resolved', admin_notes || 'Resolved by Dean Office.', req.params.id]
    );
    res.json({ success: true, message: 'Ticket updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
