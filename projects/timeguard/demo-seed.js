(() => {
  const TASKS_KEY = 'timeguard_tasks_v1';
  const PROFILE_KEY = 'timeguard_profile_v1';
  const STATS_KEY = 'timeguard_stats_v1';

  const today = () => new Date().toISOString().slice(0, 10);
  const addDays = (count) => {
    const date = new Date();
    date.setDate(date.getDate() + count);
    return date.toISOString().slice(0, 10);
  };
  const uid = () => `demo_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;

  const demoTasks = () => [
    { id: uid(), date: today(), title: 'Разобрать проект', start: '10:00', end: '11:30', priority: 'high', category: 'study', notes: 'Проверить продукт, README и сценарий показа', done: true, createdAt: new Date().toISOString() },
    { id: uid(), date: today(), title: 'Синхронизировать задачи', start: '12:00', end: '13:00', priority: 'high', category: 'work', notes: 'Показать синхронизацию и cloud-страницу', done: false, createdAt: new Date().toISOString() },
    { id: uid(), date: today(), title: 'Репетиция презентации', start: '16:00', end: '17:00', priority: 'medium', category: 'meeting', notes: 'Пройти продуктовый маршрут по шагам', done: false, createdAt: new Date().toISOString() },
    { id: uid(), date: addDays(1), title: 'Проверить экспорт плана', start: '11:00', end: '11:30', priority: 'medium', category: 'study', notes: 'Скачать TXT и JSON', done: false, createdAt: new Date().toISOString() },
    { id: uid(), date: addDays(2), title: 'Собрать обратную связь', start: '15:00', end: '16:00', priority: 'low', category: 'personal', notes: 'Записать идеи для следующей версии', done: false, createdAt: new Date().toISOString() }
  ];

  function show(message, type = '') {
    const box = document.getElementById('seedResult');
    if (!box) return;
    box.textContent = message;
    box.className = `alert ${type}`;
    box.classList.remove('hidden');
  }

  function seedDemoData() {
    const profile = {
      name: 'Пользователь TimeGuard',
      email: 'user@timeguard.local',
      role: 'user',
      plan: 'plus',
      createdAt: new Date().toISOString()
    };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    localStorage.setItem(TASKS_KEY, JSON.stringify(demoTasks()));
    localStorage.setItem(STATS_KEY, JSON.stringify({ conflicts: 1, lastSubmitAt: 0 }));
    sessionStorage.setItem('timeguard_seed_just_done', '1');
    show('Пример подготовлен: профиль, тариф, 5 задач и прогресс записаны в браузер.', 'ok');
    setTimeout(() => {
      window.dispatchEvent(new Event('timeguard-demo-updated'));
      window.TimeGuardNav?.renderAuthNav?.();
    }, 120);
  }

  function clearDemoData() {
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(TASKS_KEY);
    localStorage.removeItem(STATS_KEY);
    sessionStorage.setItem('timeguard_demo_cleared', '1');
    show('Пример очищен. Можно пройти сценарий с нуля.', 'ok');
    setTimeout(() => {
      window.dispatchEvent(new Event('timeguard-demo-updated'));
      window.TimeGuardNav?.renderAuthNav?.();
    }, 120);
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('seedDemoBtn')?.addEventListener('click', seedDemoData);
    document.getElementById('clearDemoBtn')?.addEventListener('click', clearDemoData);
  });
})();
