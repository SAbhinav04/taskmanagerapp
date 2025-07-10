document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  const res = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  if (res.ok) {
    alert('Registered successfully. Please login.');
    window.location.href = '/login';
  } else {
    alert(data.error || 'Registration failed');
  }
});
registerBtn.addEventListener('click', async () => {
  const username = authUsername.value.trim();
  const password = authPassword.value.trim();
  if (!username || !password) return alert('Enter credentials');

  try {
    const res = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error);
    alert('Registration successful. Please log in.');
    window.location.href = 'login.html'; // ✅ redirect to login page
  } catch (err) {
    alert('Registration failed');
  }
});
