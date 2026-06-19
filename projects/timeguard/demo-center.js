(() => {
  const $ = (id) => document.getElementById(id);
  const readTasks = () => {
    try { return JSON.parse(localStorage.getItem('timeguard_tasks_v1') || '[]'); } catch { return []; }
  };

  function say(message, type = '') {
    const box = $('healthResult');
    if (!box) return;
    box.textContent = message;
    box.className = `alert ${type}`;
    box.classList.remove('hidden');
  }

  async function runHealthCheck() {
    const localTasks = readTasks();
    const seedJustDone = sessionStorage.getItem('timeguard_seed_just_done') === '1';
    const demoCleared = sessionStorage.getItem('timeguard_demo_cleared') === '1';
    sessionStorage.removeItem('timeguard_seed_just_done');
    sessionStorage.removeItem('timeguard_demo_cleared');

    if ($('localTaskCount')) $('localTaskCount').textContent = localTasks.length;

    if (demoCleared) {
      if ($('sessionStatus')) $('sessionStatus').textContent = 'не проверялось';
      if ($('cloudTaskCount')) $('cloudTaskCount').textContent = '—';
      say('Пример очищен. Можно создать профиль и задачи с нуля.', 'ok');
      return;
    }

    if (!window.TimeGuardSupabase?.ready) {
      if ($('sessionStatus')) $('sessionStatus').textContent = 'Supabase не настроен';
      if ($('cloudTaskCount')) $('cloudTaskCount').textContent = '—';
      say('Supabase не настроен. Проверьте supabase-settings.js.', 'bad');
      return;
    }

    const session = await TimeGuardSupabase.getSession();
    if (!session?.user) {
      if ($('sessionStatus')) $('sessionStatus').textContent = 'Нет входа';
      if ($('cloudTaskCount')) $('cloudTaskCount').textContent = '—';
      const prefix = seedJustDone ? 'Пример подготовлен. ' : '';
      say(`${prefix}Локальная часть готова: ${localTasks.length} задач. Для cloud-проверки нужно войти через Supabase.`, localTasks.length ? 'ok' : 'bad');
      return;
    }

    if ($('sessionStatus')) $('sessionStatus').textContent = session.user.email || 'Вход выполнен';
    const result = await TimeGuardSupabase.client
      .from('tasks')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', session.user.id);

    if (result.error) {
      if ($('cloudTaskCount')) $('cloudTaskCount').textContent = 'ошибка';
      say(`Ошибка Supabase: ${result.error.message}`, 'bad');
      return;
    }

    if ($('cloudTaskCount')) $('cloudTaskCount').textContent = result.count ?? 0;
    const prefix = seedJustDone ? 'Пример подготовлен. ' : '';
    say(`${prefix}TimeGuard готов: локальных задач ${localTasks.length}, задач в Supabase ${result.count ?? 0}.`, 'ok');
  }

  document.addEventListener('DOMContentLoaded', () => {
    $('runHealthBtn')?.addEventListener('click', runHealthCheck);
    window.addEventListener('timeguard-demo-updated', runHealthCheck);
    runHealthCheck();
  });
})();
