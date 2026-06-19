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
    if ($('localTaskCount')) $('localTaskCount').textContent = localTasks.length;

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
      say('Локальная часть работает, но для cloud-проверки нужно войти через Supabase.', 'bad');
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
    say(`MVP готов к показу: локальных задач ${localTasks.length}, задач в Supabase ${result.count ?? 0}.`, 'ok');
  }

  document.addEventListener('DOMContentLoaded', () => {
    $('runHealthBtn')?.addEventListener('click', runHealthCheck);
    runHealthCheck();
  });
})();
