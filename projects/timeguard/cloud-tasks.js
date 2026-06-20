(() => {
  const $ = (id) => document.getElementById(id);
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c]));
  const labelPriority = (value) => ({ high: 'Высокий', medium: 'Средний', low: 'Низкий' }[value] || value || 'Средний');
  const labelCategory = (value) => ({ study: 'Учёба', work: 'Работа', meeting: 'Встреча', personal: 'Личное', health: 'Здоровье' }[value] || value || 'Личное');

  function say(message, type = '') {
    const box = $('cloudStatus');
    if (!box) return;
    box.textContent = message;
    box.className = `alert ${type}`;
    box.classList.remove('hidden');
  }

  function render(tasks, userEmail) {
    if ($('cloudUser')) $('cloudUser').textContent = userEmail || '—';
    if ($('cloudTotal')) $('cloudTotal').textContent = tasks.length;
    if ($('cloudDone')) $('cloudDone').textContent = tasks.filter((task) => task.done).length;
    $('cloudEmpty')?.classList.toggle('hidden', tasks.length > 0);
    const list = $('cloudTasks');
    if (!list) return;
    list.innerHTML = tasks.map((task) => `
      <article class="task ${task.done ? 'done' : ''}">
        <time>${esc(task.start_time)}–${esc(task.end_time)}</time>
        <div>
          <h3>${esc(task.title)}</h3>
          <p>${esc(task.notes || 'Без комментария')}</p>
          <span class="badge">${esc(task.task_date)}</span>
          <span class="badge">${labelPriority(task.priority)}</span>
          <span class="badge">${labelCategory(task.category)}</span>
        </div>
        <div class="tag">${task.done ? 'готово' : 'активно'}</div>
      </article>`).join('');
  }

  async function loadCloudTasks() {
    if (!window.TimeGuardSupabase?.ready) {
      say('Облачная синхронизация временно недоступна. Проверьте настройки проекта.', 'bad');
      return;
    }

    const session = await TimeGuardSupabase.getSession();
    if (!session?.user) {
      say('Сначала войдите в аккаунт, затем вернитесь на эту страницу.', 'bad');
      return;
    }

    say('Загружаю задачи из облака...');
    const result = await TimeGuardSupabase.client
      .from('tasks')
      .select('id, task_date, title, start_time, end_time, priority, category, notes, done, created_at')
      .eq('user_id', session.user.id)
      .order('task_date', { ascending: true })
      .order('start_time', { ascending: true });

    if (result.error) {
      console.error('TimeGuard cloud load error:', result.error);
      say(`Ошибка загрузки из облака: ${result.error.message}`, 'bad');
      return;
    }

    render(result.data || [], session.user.email);
    say(`Загружено из облака: ${(result.data || []).length} задач.`, 'ok');
  }

  document.addEventListener('DOMContentLoaded', () => {
    $('loadCloudBtn')?.addEventListener('click', loadCloudTasks);
    loadCloudTasks();
  });
})();
