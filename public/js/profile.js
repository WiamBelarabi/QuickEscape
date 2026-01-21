document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;

  const info = document.getElementById('profileInfo');
  const form = document.getElementById('profileForm');
  const status = document.getElementById('profileStatus');
  const usernameInput = document.getElementById('profileUsername');

  async function loadProfile() {
    try {
      const response = await apiFetch('/api/profile');
      const user = response.data;
      info.innerHTML = `
        <div><strong>Username:</strong> ${user.username}</div>
        <div><strong>Email:</strong> ${user.email || '-'}</div>
      `;
      usernameInput.value = user.username;
      setAuth({ username: user.username });
    } catch (err) {
      info.textContent = err.message;
    }
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.textContent = '';

    const username = usernameInput.value.trim();
    const password = document.getElementById('profilePassword').value;

    try {
      await apiFetch('/api/profile', {
        method: 'PUT',
        body: {
          username: username || undefined,
          password: password || undefined
        }
      });
      status.textContent = 'Profile updated.';
      document.getElementById('profilePassword').value = '';
      loadProfile();
    } catch (err) {
      status.textContent = err.message;
    }
  });

  loadProfile();
});
