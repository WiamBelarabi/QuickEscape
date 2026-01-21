document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
  const status = document.getElementById('signupStatus');

  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.textContent = '';

    const username = document.getElementById('signupUsername').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;

    try {
      const response = await apiFetch('/api/signup', {
        method: 'POST',
        body: { username, email, password }
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
