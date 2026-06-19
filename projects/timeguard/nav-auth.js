(() => {
  const PROFILE_KEY = 'timeguard_profile_v1';

  function readProfile() {
    try {
      return JSON.parse(localStorage.getItem(PROFILE_KEY));
    } catch {
      return null;
    }
  }

  function logout() {
    localStorage.removeItem(PROFILE_KEY);
    location.href = 'login.html?v=12';
  }

  function normalizeHref(path) {
    const isNested = location.pathname.includes('/projects/timeguard/');
    return isNested ? path : `projects/timeguard/${path}`;
  }

  function renderAuthNav() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    const profile = readProfile();
    const authLinks = nav.querySelectorAll('[data-auth-link]');
    const userLinks = nav.querySelectorAll('[data-user-link]');

    authLinks.forEach((item) => item.classList.toggle('hidden', Boolean(profile)));
    userLinks.forEach((item) => item.classList.toggle('hidden', !profile));

    if (!profile || nav.querySelector('[data-auth-dynamic]')) return;

    const cabinet = document.createElement('a');
    cabinet.href = normalizeHref('cabinet.html?v=12');
    cabinet.textContent = 'Кабинет';
    cabinet.setAttribute('data-auth-dynamic', 'cabinet');

    const user = document.createElement('span');
    user.className = 'tag';
    user.textContent = profile.email || profile.name || 'Пользователь';
    user.setAttribute('data-auth-dynamic', 'user');

    const out = document.createElement('button');
    out.type = 'button';
    out.className = 'btn btn-secondary';
    out.textContent = 'Выйти';
    out.setAttribute('data-auth-dynamic', 'logout');
    out.addEventListener('click', logout);

    nav.append(cabinet, user, out);
  }

  document.addEventListener('DOMContentLoaded', renderAuthNav);
  window.addEventListener('storage', renderAuthNav);
  window.TimeGuardNav = { renderAuthNav };
})();
