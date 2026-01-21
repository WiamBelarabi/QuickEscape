document.addEventListener('DOMContentLoaded', () => {
  const token = getToken();
  const role = getRole();

  document.querySelectorAll('.auth-only').forEach((el) => {
    el.style.display = token ? '' : 'none';
  });

  document.querySelectorAll('.guest-only').forEach((el) => {
    el.style.display = token ? 'none' : '';
  });

  document.querySelectorAll('.admin-only').forEach((el) => {
    el.style.display = token && role === 'admin' ? '' : 'none';
  });

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        if (token) {
          await apiFetch('/api/logout', { method: 'POST' });
        }
      } catch (err) {
        // ignore logout API errors
      }
      clearAuth();
      window.location.href = '/';
    });
  }
});
