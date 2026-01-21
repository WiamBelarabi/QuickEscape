document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const status = document.getElementById('loginStatus');

  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.textContent = '';

    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;

    try {
      const response = await apiFetch('/api/login', {
        method: 'POST',
        body: { username, password }
      });

      setAuth({
        token: response.token,
        role: response.data.role,
        username: response.data.username
      });

      window.location.href = '/trips';
    } catch (err) {
      status.textContent = err.message;
    }
  });
});
