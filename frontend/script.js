const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const statusFilter = document.getElementById('statusFilter');
document.addEventListener('DOMContentLoaded', () => {
  const taskForm = document.getElementById('taskForm');
  const logoutBtn = document.getElementById('logoutBtn');
  const appSection = document.getElementById('appSection');

  if (!taskForm || !logoutBtn || !appSection) return; // Prevent running on other pages

  // Continue with the rest of your dashboard logic...
});


const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginSection = document.getElementById('loginSection');
const appSection = document.getElementById('appSection');
const welcomeUser = document.getElementById('welcomeUser');
const logoutBtn = document.getElementById('logoutBtn');

const API_URL = 'http://localhost:3000/api/tasks';
const LOGIN_URL = 'http://localhost:3000/api/login';
const REGISTER_URL = 'http://localhost:3000/api/register';
// Top of script.js
if (!localStorage.getItem('username')) {
  window.location.href = 'login.html';
}

let currentUser = null;

// On load
window.onload = () => {
  const storedUser = localStorage.getItem('username');
  if (storedUser) {
    currentUser = storedUser;
    showAppSection();
    fetchTasks();
  }
};

// Show App Section
function showAppSection() {
  loginSection.classList.add('hidden');
  appSection.classList.remove('hidden');
  welcomeUser.textContent = currentUser;
}

// Login Handler
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  try {
    const res = await fetch(LOGIN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error || 'Login failed');

    currentUser = username;
    localStorage.setItem('username', username);
    loginForm.reset();
    showAppSection();
    fetchTasks();
  } catch (err) {
    alert('Login error');
  }
});

// Register Handler
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('registerUsername').value.trim();
  const password = document.getElementById('registerPassword').value.trim();

  try {
    const res = await fetch(REGISTER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error || 'Registration failed');

    alert('Registration successful. You can now log in.');
    registerForm.reset();
  } catch (err) {
    alert('Registration error');
  }
});

// Logout
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('username');
  currentUser = null;
  appSection.classList.add('hidden');
  loginSection.classList.remove('hidden');
});

// Status Filter
statusFilter.addEventListener('change', () => {
  fetchTasks(statusFilter.value);
});

// Add Task
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
    console.error(err);
    alert('Network error');
  }
});

// Fetch Tasks
async function fetchTasks(status = 'all') {
  try {
    const res = await fetch(`${API_URL}?status=${status}&username=${currentUser}`);
    const tasks = await res.json();
    renderTasks(tasks);
  } catch (err) {
    console.error(err);
    taskList.innerHTML = '<p class="text-red-500">Failed to load tasks</p>';
  }
}

// Render Tasks
function renderTasks(tasks) {
  taskList.innerHTML = '';

  if (!tasks || tasks.length === 0) {
    taskList.innerHTML = '<p class="text-gray-500">No tasks found.</p>';
    return;
  }

  tasks.forEach((task) => {
    const title = task.title || 'Untitled';
    const description = task.description || '';
    const dueDate = task.due_date || 'N/A';
    const status = task.status || 'pending';

    const card = document.createElement('div');
    card.className = 'p-4 bg-gray-50 border rounded-lg shadow-sm';

    card.innerHTML = `
      <h2 class="text-lg font-semibold text-gray-800">${title}</h2>
      <p class="text-gray-600 mb-2">${description}</p>
      <p class="text-sm text-gray-500 mb-1">Due: ${formatDate(dueDate)}</p>
      <label for="status-${task.id}" class="block font-semibold mb-1">Status:</label>
      <select id="status-${task.id}" class="p-1 border rounded w-full max-w-xs mb-2">
        <option value="pending" ${status === 'pending' ? 'selected' : ''}>Pending</option>
        <option value="in-progress" ${status === 'in-progress' ? 'selected' : ''}>In Progress</option>
        <option value="completed" ${status === 'completed' ? 'selected' : ''}>Completed</option>
      </select>
      <button id="delete-${task.id}" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">Delete</button>
    `;

    taskList.appendChild(card);

    const statusSelect = card.querySelector(`#status-${task.id}`);
    if (statusSelect) {
      statusSelect.addEventListener('change', async (e) => {
        const newStatus = e.target.value;

        try {
          const res = await fetch(`${API_URL}/${task.id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
          });
          if (!res.ok) throw new Error('Failed to update status');
          fetchTasks(statusFilter.value);
        } catch (error) {
          alert('Error updating status');
          console.error(error);
        }
      });
    }

    const deleteBtn = card.querySelector(`#delete-${task.id}`);
    if (deleteBtn) {
      deleteBtn.addEventListener('click', async () => {
        const confirmed = confirm(`Delete task "${title}"?`);
        if (!confirmed) return;

        try {
          const res = await fetch(`${API_URL}/${task.id}`, {
            method: 'DELETE',
          });
          if (!res.ok) throw new Error('Delete failed');
          fetchTasks(statusFilter.value);
        } catch (err) {
          alert('Error deleting task');
          console.error(err);
        }
      });
    }
  });
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}
window.location.href = 'dashboard.html';
