const db = require('../db');

const Task = {
  getAll: (callback) => {
    db.query('SELECT * FROM tasks', callback);
  },
  create: (task, callback) => {
    db.query('INSERT INTO tasks SET ?', task, callback);
  },
  updateStatus: (id, status, callback) => {
    db.query('UPDATE tasks SET status = ? WHERE id = ?', [status, id], callback);
  },
  delete: (id, callback) => {
    db.query('DELETE FROM tasks WHERE id = ?', [id], callback);
  }
};

module.exports = Task;
