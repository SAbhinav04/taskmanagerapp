const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Server error: ${res.status} - ${text}`);
    }

    const data = await res.json();
    alert('Login successful');
    localStorage.setItem('username', username);
    window.location.href = '/dashboard.html';
  } catch (err) {
    alert('Login failed: ' + err.message);
    console.error(err);
  }
});
