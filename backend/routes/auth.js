// routes/auth.js
const express = require('express');
const router = express.Router();
const db = require('../db'); // adjust path if needed

// Register a new user
router.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  // Check if username already exists
  const checkQuery = 'SELECT * FROM users WHERE username = ?';
  db.query(checkQuery, [username], (err, results) => {
    if (err) return res.status(500).json({ error: 'Server error' });

    if (results.length > 0) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    // Insert new user
    const insertQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(insertQuery, [username, password], (err2, result) => {
      if (err2) return res.status(500).json({ error: 'Error registering user' });

      return res.status(201).json({ message: 'User registered successfully' });
    });
  });
});

// Login user
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const loginQuery = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(loginQuery, [username, password], (err, results) => {
    if (err) return res.status(500).json({ error: 'Server error' });

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    return res.json({ message: 'Login successful', username });
  });
});

module.exports = router;
