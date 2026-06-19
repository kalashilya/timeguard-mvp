(() => {
  const PROFILE_KEY = 'timeguard_profile_v1';

  function readProfile() {
    try {
      return JSON.parse(localStorage.getItem(PROFILE_KEY));
    } catch {
      return null;
    }
  }

  function pagePath(path) {
    const isNested = location.pathname.includes('/projects/timeguard/');
    return isNested ? path : `projects/timeguard/${path}`;
  }

  function logout() {
    localStorage.removeItem(PROFILE_KEY);
    location.href = pagePath('login.html?v=12');
  }

  function isAuthLink(link) {
    const href = (link.getAttribute('href') || '').toLowerCase();
    const text = (link.textContent || '').toLowerCase();
    return href.includes('login') || href.includes('register') || href.includes('signup') || text.includes('войти') || text.includes('регистрация') || text.includes('создать аккаунт');
  }

  function hasCabinetLink(nav) {
    return Array.from(nav.querySelectorAll('a')).some((link) => (link.getAttribute('href') || '').includes('cabinet'));
  }

  function renderAuthNav() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    const profile = readProfile();

    nav.querySelectorAll('[data-auth-dynamic]').forEach((item) => item.remove());
    nav.querySelectorAll('[data-user-link]').forEach((item) => item.classList.toggle('hidden', !profile));
    nav.querySelectorAll('[data-auth-link]').forEach((item) => item.classList.toggle('hidden', Boolean(profile)));

    Array.from(nav.querySelectorAll('a')).forEach((link) => {
      if (isAuthLink(link)) link.classList.toggle('hidden', Boolean(profile));
    });

    if (!profile) return;

    if (!hasCabinetLink(nav)) {
      const cabinet = document.createElement('a');
      cabinet.href = pagePath('cabinet.html?v=12');
      cabinet.textContent = 'Кабинет';
      cabinet.setAttribute('data-auth-dynamic', 'cabinet');
      nav.append(cabinet);
    }

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

    nav.append(user, out);
  }

  document.addEventListener('DOMContentLoaded', renderAuthNav);
  window.addEventListener('storage', renderAuthNav);
  window.TimeGuardNav = { renderAuthNav };
})();
