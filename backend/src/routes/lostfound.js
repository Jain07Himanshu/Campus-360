const express = require('express');
const router = express.Router();
const { query } = require('../db/database');

// GET /api/lostfound
router.get('/', (req, res) => {
  const { type, status } = req.query;
  try {
    let sql = 'SELECT * FROM lost_found_items WHERE 1=1';
    const params = [];

    if (type && type !== 'all') {
      sql += ' AND type = ?';
      params.push(type);
    }
    if (status && status !== 'all') {
      sql += ' AND status = ?';
      params.push(status);
    }

    sql += ' ORDER BY item_date DESC';
    const items = query.all(sql, params);

    // Fetch claims for each item
    const formatted = items.map(item => {
      const claims = query.all('SELECT * FROM lost_found_claims WHERE item_id = ? ORDER BY claim_date DESC', [item.id]);
      return {
        ...item,
        claims
      };
    });

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/lostfound (Report lost or found)
router.post('/', (req, res) => {
  const { type, title, category, location, description, reporter_id, reporter_name } = req.body;
  const id = `lf-${Date.now().toString().slice(-4)}`;
  const item_date = new Date().toISOString().split('T')[0];

  try {
    query.run(
      `INSERT INTO lost_found_items (id, type, title, category, location, item_date, description, status, reporter_id, reporter_name)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, type || 'lost', title, category || 'Personal Items', location, item_date, description, type === 'found' ? 'found' : 'lost', reporter_id || 'STU-2024-8842', reporter_name || 'Alex Turner']
    );
    res.json({ success: true, message: 'Item recorded successfully', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/lostfound/:id/claim (Submit claim)
router.post('/:id/claim', (req, res) => {
  const itemId = req.params.id;
  const { claimant_id, claimant_name, claimant_dept, proof_description } = req.body;
  const id = `cl-${Date.now().toString().slice(-4)}`;
  const claim_date = new Date().toISOString().split('T')[0];

  try {
    query.run(
      `INSERT INTO lost_found_claims (id, item_id, claimant_id, claimant_name, claimant_dept, proof_description, claim_date, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [id, itemId, claimant_id || 'STU-2024-8842', claimant_name || 'Alex Turner', claimant_dept || 'Computer Engineering', proof_description, claim_date]
    );

    // Update item status to claim_pending
    query.run("UPDATE lost_found_items SET status = 'claim_pending' WHERE id = ?", [itemId]);

    res.json({ success: true, message: 'Ownership claim submitted to security desk for review', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/lostfound/claims/:claimId/status (Admin review)
router.patch('/claims/:claimId/status', (req, res) => {
  const { status, itemId } = req.body; // 'approved' or 'rejected'

  try {
    query.run('UPDATE lost_found_claims SET status = ? WHERE id = ?', [status, req.params.claimId]);

    if (status === 'approved' && itemId) {
      query.run("UPDATE lost_found_items SET status = 'returned' WHERE id = ?", [itemId]);
    } else if (status === 'rejected' && itemId) {
      // If no other pending claims, revert to 'found'
      const pending = query.get("SELECT count(*) as count FROM lost_found_claims WHERE item_id = ? AND status = 'pending'", [itemId]);
      if (pending.count === 0) {
        query.run("UPDATE lost_found_items SET status = 'found' WHERE id = ?", [itemId]);
      }
    }

    res.json({ success: true, message: `Claim marked as ${status}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
