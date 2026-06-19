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
    const profileResult = await TimeGuardSupabase.upsertProfile({
      id: session.user.id,
      email: session.user.email,
      full_name: profile.name || session.user.user_metadata?.name || 'TimeGuard User',
      role: profile.role || 'user',
      plan: profile.plan || 'free'
    });

    if (profileResult?.error) {
      console.error('TimeGuard profile sync error:', profileResult.error);
      say(`Ошибка профиля Supabase: ${profileResult.error.message}`);
      return;
    }

    const tasks = JSON.parse(localStorage.getItem('timeguard_tasks_v1') || '[]');
    if (!tasks.length) {
      say('Supabase подключён, профиль найден, но локальных задач пока нет. Откройте планировщик, добавьте 1–2 задачи и снова нажмите синхронизацию.');
      return;
    }

    let ok = 0;
    let failed = 0;
    let lastError = '';

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

      let result = await TimeGuardSupabase.client
        .from('tasks')
        .upsert(payload, { onConflict: 'user_id,local_id' });

      if (result.error && String(result.error.message || '').includes('local_id')) {
        const fallbackPayload = { ...payload };
        delete fallbackPayload.local_id;
        result = await TimeGuardSupabase.client.from('tasks').insert(fallbackPayload);
      }

      if (result.error) {
        failed += 1;
        lastError = result.error.message || 'unknown error';
        console.error('TimeGuard Supabase sync error:', result.error);
      } else {
        ok += 1;
      }
    }

    if (failed) {
      say(`Синхронизация частично выполнена: ${ok} задач отправлено, ошибок: ${failed}. Последняя ошибка: ${lastError}`);
      return;
    }

    say(`Синхронизация завершена: ${ok} задач отправлено в Supabase, ошибок: 0.`);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('syncSupabaseBtn');
    if (btn) btn.addEventListener('click', syncLocalTasks);
  });

  window.TimeGuardSync = { syncLocalTasks };
})();
