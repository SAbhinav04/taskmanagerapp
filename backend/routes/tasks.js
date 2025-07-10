const express = require('express');
const router = express.Router();
const db = require('../db');

// Get Tasks (with optional status and username filters)
router.get('/', (req, res) => {
  const { status, username } = req.query;

  let sql = 'SELECT * FROM tasks WHERE 1=1';
  const params = [];

  if (username) {
    sql += ' AND username = ?';
    params.push(username);
  }

  if (status && status !== 'all') {
    sql += ' AND status = ?';
    params.push(status);
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Add Task
router.post('/', (req, res) => {
  const { title, description, due_date, username } = req.body;
  if (!title || !description || !due_date || !username) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const sql = 'INSERT INTO tasks (title, description, due_date, username) VALUES (?, ?, ?, ?)';
  db.query(sql, [title, description, due_date, username], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Task added' });
  });
});

// Update Task Status
router.put('/:id/status', (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  const allowed = ['pending', 'in-progress', 'completed'];
  if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' });

  const sql = 'UPDATE tasks SET status = ? WHERE id = ?';
  db.query(sql, [status, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Status updated' });
  });
});

// Delete Task
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM tasks WHERE id = ?';
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.sendStatus(200);
  });
});

module.exports = router;
