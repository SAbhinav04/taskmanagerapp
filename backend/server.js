const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const taskRoutes = require('./routes/tasks');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Serve static files from frontend folder
app.use(express.static(path.join(__dirname, '../frontend')));

// API routes
app.use('/api/tasks', taskRoutes);
app.use('/api', authRoutes);

// HTML routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/landing.html'));
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/login.html'));
});
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/register.html'));
});
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dashboard.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
