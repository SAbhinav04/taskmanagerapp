document.addEventListener('DOMContentLoaded', () => {
  const taskForm = document.getElementById('taskForm');
  const taskList = document.getElementById('taskList');
  const statusFilter = document.getElementById('statusFilter');
  const logoutBtn = document.getElementById('logoutBtn');
  const welcomeUser = document.getElementById('welcomeUser');

  const API_URL = 'http://localhost:3000/api/tasks';

  const currentUser = localStorage.getItem('username');
  if (!currentUser) {
    window.location.href = 'login.html';
    return;
  }

  welcomeUser.textContent = currentUser;

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('username');
    window.location.href = 'login.html';
  });

  taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const due_date = document.getElementById('dueDate').value;

    if (!title || !description || !due_date) return alert('All fields required.');

    const task = { title, description, due_date, username: currentUser };

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
      });

      if (res.ok) {
        taskForm.reset();
        fetchTasks(statusFilter.value);
      } else {
        const error = await res.json();
        alert(error.message || 'Error adding task');
      }
    } catch (err) {
      alert('Network error');
    }
  });

  statusFilter.addEventListener('change', () => {
    fetchTasks(statusFilter.value);
  });

  async function fetchTasks(status = 'all') {
    try {
      const res = await fetch(`${API_URL}?status=${status}&username=${currentUser}`);
      const tasks = await res.json();
      renderTasks(tasks);
    } catch (err) {
      taskList.innerHTML = '<p class="text-red-500">Failed to load tasks</p>';
    }
  }

  function renderTasks(tasks) {
    taskList.innerHTML = '';

    if (!tasks || tasks.length === 0) {
      taskList.innerHTML = '<p class="text-gray-500">No tasks found.</p>';
      return;
    }

    tasks.forEach((task) => {
      const card = document.createElement('div');
      card.className = 'p-4 bg-gray-50 border rounded-lg shadow-sm';

      card.innerHTML = `
        <h2 class="text-lg font-semibold text-gray-800">${task.title}</h2>
        <p class="text-gray-600 mb-2">${task.description}</p>
        <p class="text-sm text-gray-500 mb-1">Due: ${formatDate(task.due_date)}</p>
        <label class="block font-semibold mb-1">Status:</label>
        <select class="p-1 border rounded w-full max-w-xs mb-2">
          <option value="pending" ${task.status === 'pending' ? 'selected' : ''}>Pending</option>
          <option value="in-progress" ${task.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
          <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Completed</option>
        </select>
        <button class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">Delete</button>
      `;

      const statusSelect = card.querySelector('select');
      statusSelect.addEventListener('change', async (e) => {
        try {
          const res = await fetch(`${API_URL}/${task.id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: e.target.value }),
          });
          if (!res.ok) throw new Error('Failed to update status');
          fetchTasks(statusFilter.value);
        } catch (err) {
          alert('Failed to update status');
        }
      });

      const deleteBtn = card.querySelector('button');
      deleteBtn.addEventListener('click', async () => {
        const confirmed = confirm(`Delete task "${task.title}"?`);
        if (!confirmed) return;

        try {
          const res = await fetch(`${API_URL}/${task.id}`, { method: 'DELETE' });
          if (!res.ok) throw new Error('Delete failed');
          fetchTasks(statusFilter.value);
        } catch (err) {
          alert('Delete error');
        }
      });

      taskList.appendChild(card);
    });
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  fetchTasks();
});
