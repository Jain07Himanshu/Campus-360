const express = require('express');
const router = express.Router();
const { query } = require('../db/database');

// GET /api/academics/timetable
router.get('/timetable', (req, res) => {
  try {
    const { day } = req.query;
    let sql = `
      SELECT t.*, c.subject, c.faculty, c.department 
      FROM timetable t
      JOIN courses c ON t.course_code = c.code
    `;
    const params = [];
    if (day) {
      sql += ' WHERE t.day_of_week = ?';
      params.push(day);
    }
    sql += ` ORDER BY CASE t.day_of_week 
      WHEN 'Monday' THEN 1 
      WHEN 'Tuesday' THEN 2 
      WHEN 'Wednesday' THEN 3 
      WHEN 'Thursday' THEN 4 
      WHEN 'Friday' THEN 5 
      WHEN 'Saturday' THEN 6 
      ELSE 7 END, t.period ASC`;

    const rows = query.all(sql, params);

    // Group by day of week
    const grouped = {};
    rows.forEach(item => {
      if (!grouped[item.day_of_week]) grouped[item.day_of_week] = [];
      grouped[item.day_of_week].push(item);
    });

    res.json(grouped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/academics/attendance/:studentId
router.get('/attendance/:studentId', (req, res) => {
  try {
    const sql = `
      SELECT a.*, c.subject, c.faculty 
      FROM attendance a
      JOIN courses c ON a.course_code = c.code
      WHERE a.student_id = ?
    `;
    const rows = query.all(sql, [req.params.studentId]);
    
    // Overall stats
    let totalAttended = 0;
    let totalClasses = 0;
    rows.forEach(r => {
      totalAttended += r.attended;
      totalClasses += r.total;
    });
    const overallPercentage = totalClasses > 0 ? ((totalAttended / totalClasses) * 100).toFixed(1) : 0;

    res.json({
      overallPercentage: Number(overallPercentage),
      totalAttended,
      totalClasses,
      subjects: rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/academics/materials
router.get('/materials', (req, res) => {
  try {
    const sql = `
      SELECT m.*, c.subject 
      FROM study_materials m
      LEFT JOIN courses c ON m.course_code = c.code
      ORDER BY m.upload_date DESC
    `;
    const rows = query.all(sql);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/academics/materials (Admin upload)
router.post('/materials', (req, res) => {
  const { title, course_code, semester, uploaded_by, file_type, size, download_url } = req.body;
  const id = `mat-${Date.now().toString().slice(-4)}`;
  const upload_date = new Date().toISOString().split('T')[0];

  try {
    query.run(
      `INSERT INTO study_materials (id, title, course_code, semester, uploaded_by, file_type, size, upload_date, download_url, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'published')`,
      [id, title, course_code || 'CS301', semester || 'Sem 6', uploaded_by || 'Faculty Member', file_type || 'PDF', size || '3.5 MB', upload_date, download_url || '#download']
    );
    res.json({ success: true, message: 'Study material uploaded successfully', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/academics/assignments
router.get('/assignments', (req, res) => {
  const { studentId } = req.query;
  try {
    let sql = `
      SELECT a.*, c.subject, c.faculty,
             sub.status as submission_status, sub.submission_link, sub.score, sub.submitted_date
      FROM assignments a
      JOIN courses c ON a.course_code = c.code
      LEFT JOIN assignment_submissions sub ON a.id = sub.assignment_id AND sub.student_id = ?
      ORDER BY a.due_date ASC
    `;
    const rows = query.all(sql, [studentId || 'STU-2024-8842']);
    
    // Add dueInDays calculation
    const today = new Date();
    const formatted = rows.map(r => {
      const due = new Date(r.due_date);
      const diffTime = due - today;
      const dueInDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      return {
        ...r,
        dueInDays,
        status: r.submission_status || 'pending'
      };
    });

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/academics/assignments/:id/submit (Student submit)
router.post('/assignments/:id/submit', (req, res) => {
  const { studentId, submissionLink, comments } = req.body;
  const assignmentId = req.params.id;
  const submittedDate = new Date().toISOString().split('T')[0];

  try {
    query.run(
      `INSERT OR REPLACE INTO assignment_submissions (assignment_id, student_id, submission_link, comments, submitted_date, status, score)
       VALUES (?, ?, ?, ?, ?, 'submitted', 'Pending Evaluation')`,
      [assignmentId, studentId || 'STU-2024-8842', submissionLink, comments || '', submittedDate]
    );
    res.json({ success: true, message: 'Assignment submitted successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/academics/assignments (Admin create)
router.post('/assignments', (req, res) => {
  const { title, course_code, due_date, total_marks, instructions } = req.body;
  const id = `asg-${Date.now().toString().slice(-4)}`;

  try {
    query.run(
      `INSERT INTO assignments (id, title, course_code, due_date, total_marks, instructions)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, title, course_code || 'CS301', due_date, total_marks || 20, instructions]
    );
    res.json({ success: true, message: 'Assignment published', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/academics/exams
router.get('/exams', (req, res) => {
  try {
    const sql = `
      SELECT e.*, c.subject, c.faculty 
      FROM exam_schedules e
      JOIN courses c ON e.course_code = c.code
      ORDER BY e.exam_date ASC
    `;
    const rows = query.all(sql);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
