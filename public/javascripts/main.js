document.addEventListener('DOMContentLoaded', () => {
  const signInBtn = document.getElementById('sign-in-btn');
  const signUpBtn = document.getElementById('sign-up-btn');
  const accessBtn = document.getElementById('access-btn');
  const logoutBtn = document.getElementById('logout-btn');

  if (signInBtn) {
    signInBtn.addEventListener('click', () => {
      window.location.href = '/login';
    });
  }

  if (signUpBtn) {
    signUpBtn.addEventListener('click', () => {
      window.location.href = '/register';
    });
  }

  if (accessBtn) {
    accessBtn.addEventListener('click', () => {
      window.location.href = '/public-posts';
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      window.location.href = '/logout';
    });
  }
});