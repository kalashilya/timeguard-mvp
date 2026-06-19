(() => {
  async function syncLocalTasks() {
    const resultBox = document.getElementById('syncResult');
    const say = (text) => {
      if (resultBox) {
        resultBox.textContent = text;
        resultBox.classList.remove('hidden');
      } else {
        alert(text);
      }
    };

    if (!window.TimeGuardSupabase?.ready) {
      say('Supabase не настроен. Проверьте supabase-settings.js.');
      return;
    }

    const session = await TimeGuardSupabase.getSession();
    if (!session?.user) {
      say('Сначала зарегистрируйтесь или войдите через Supabase.');
      return;
    }

    const profileRaw = localStorage.getItem('timeguard_profile_v1');
    const profile = profileRaw ? JSON.parse(profileRaw) : {};
    await TimeGuardSupabase.upsertProfile({
      id: session.user.id,
      email: session.user.email,
      full_name: profile.name || session.user.user_metadata?.name || 'TimeGuard User',
      role: profile.role || 'user',
      plan: profile.plan || 'free'
    });

    const tasks = JSON.parse(localStorage.getItem('timeguard_tasks_v1') || '[]');
    if (!tasks.length) {
      say('Supabase подключён, профиль найден, но локальных задач пока нет. Откройте планировщик, добавьте 1–2 задачи и снова нажмите синхронизацию.');
      return;
    }

    let ok = 0;
    let failed = 0;
    for (const item of tasks) {
      const payload = {
        user_id: session.user.id,
        local_id: item.id,
        task_date: item.date,
        title: item.title,
        start_time: item.start,
        end_time: item.end,
        priority: item.priority,
        category: item.category,
        notes: item.notes || '',
        done: Boolean(item.done)
      };
      const { error } = await TimeGuardSupabase.client.from('tasks').upsert(payload, { onConflict: 'user_id,local_id' });
      if (error) {
        failed += 1;
        console.error('TimeGuard Supabase sync error:', error);
      } else {
        ok += 1;
      }
    }

    say(`Синхронизация завершена: ${ok} задач отправлено в Supabase, ошибок: ${failed}.`);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('syncSupabaseBtn');
    if (btn) btn.addEventListener('click', syncLocalTasks);
  });

  window.TimeGuardSync = { syncLocalTasks };
})();
