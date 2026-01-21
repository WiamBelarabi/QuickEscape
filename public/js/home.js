document.addEventListener('DOMContentLoaded', () => {
  const heroUser = document.getElementById('heroUser');
  const username = getUser();
  if (heroUser && username) {
    heroUser.textContent = `Welcome back, ${username}. Ready for your next trip?`;
  }
});
