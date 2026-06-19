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
      say('Supabase is not configured yet.');
      return;
    }

    const session = await TimeGuardSupabase.getSession();
    if (!session?.user) {
      say('Please register or log in first.');
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
    let ok = 0;
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
      if (!error) ok += 1;
    }

    say(`Synced ${ok} task(s) with Supabase.`);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('syncSupabaseBtn');
    if (btn) btn.addEventListener('click', syncLocalTasks);
  });

  window.TimeGuardSync = { syncLocalTasks };
})();
