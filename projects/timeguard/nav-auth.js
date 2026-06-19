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

  function clearSupabaseAuthFallback() {
    Object.keys(localStorage).forEach((key) => {
      const lower = key.toLowerCase();
      if (lower.startsWith('sb-') && lower.includes('auth-token')) {
        localStorage.removeItem(key);
      }
    });
    localStorage.removeItem('supabase.auth.token');
  }

  async function logout() {
    try {
      if (window.TimeGuardSupabase?.ready) {
        await window.TimeGuardSupabase.signOut();
      }
    } catch (error) {
      console.warn('Supabase signOut failed', error);
    }
    localStorage.removeItem(PROFILE_KEY);
    clearSupabaseAuthFallback();
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

  function updateAuthCtas(profile) {
    document.querySelectorAll('a, button').forEach((item) => {
      if (item.closest('.nav')) return;
      if (item.getAttribute('data-auth-dynamic')) return;
      const href = (item.getAttribute('href') || '').toLowerCase();
      const text = (item.textContent || '').trim().toLowerCase();
      const isAuthCta = href.includes('login') || href.includes('register') || href.includes('signup') || text === 'войти' || text === 'регистрация' || text === 'создать аккаунт' || text === 'уже есть аккаунт? войти';
      if (isAuthCta) item.classList.toggle('hidden', Boolean(profile));
    });
  }

  function ensureProfileMenuCss() {
    if (document.querySelector('link[href*="profile-menu.css"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = pagePath('profile-menu.css?v=1');
    document.head.append(link);
  }

  function renderProfileMenu(nav, profile) {
    ensureProfileMenuCss();
    const first = (profile.name || profile.email || 'T').trim().charAt(0).toUpperCase();
    const plan = String(profile.plan || 'free').toUpperCase();
    const wrap = document.createElement('span');
    wrap.className = 'profile-menu-wrap';
    wrap.setAttribute('data-auth-dynamic', 'profile-menu');
    wrap.innerHTML = `<button class="profile-button" type="button" aria-label="Профиль"><span class="profile-avatar">${first}</span><span>${profile.email || profile.name || 'Профиль'}</span></button><div class="profile-menu-panel hidden"><div class="profile-menu-head"><span class="profile-avatar">${first}</span><div><div class="profile-menu-name">${profile.name || 'Пользователь TimeGuard'}</div><div class="profile-menu-email">${profile.email || 'email не указан'}</div></div></div><a class="profile-menu-item" href="${pagePath('cabinet.html?v=12')}"><span>Кабинет</span><strong>→</strong></a><a class="profile-menu-item" href="${pagePath('pricing.html?v=12')}"><span>Тариф</span><strong>${plan}</strong></a><button class="btn btn-secondary profile-menu-logout" type="button">Выйти</button></div>`;
    const button = wrap.querySelector('.profile-button');
    const panel = wrap.querySelector('.profile-menu-panel');
    button?.addEventListener('click', () => panel?.classList.toggle('hidden'));
    wrap.querySelector('.profile-menu-logout')?.addEventListener('click', logout);
    document.addEventListener('click', (event) => {
      if (!wrap.contains(event.target)) panel?.classList.add('hidden');
    });
    nav.append(wrap);
  }

  function renderAuthNav() {
    const nav = document.querySelector('.nav');
    const profile = readProfile();

    updateAuthCtas(profile);

    if (!nav) return;

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

    renderProfileMenu(nav, profile);
  }

  document.addEventListener('DOMContentLoaded', renderAuthNav);
  window.addEventListener('storage', renderAuthNav);
  window.TimeGuardNav = { renderAuthNav, logout };
})();
