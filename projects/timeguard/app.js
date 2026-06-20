(() => {
  const page = document.body.dataset.page || 'app';
  const keys = { profile: 'timeguard_profile_v1', tasks: 'timeguard_tasks_v1', stats: 'timeguard_stats_v1', demoSession: 'timeguard_demo_session_id' };
  const limits = { free: { perDay: 5, daysAhead: 3 }, plus: { perDay: 30, daysAhead: 14 }, team: { perDay: 100, daysAhead: 60 } };
  const $ = (id) => document.getElementById(id);
  const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const uid = () => Math.random().toString(16).slice(2) + Date.now().toString(16);
  const todayIso = () => new Date().toISOString().slice(0, 10);
  const toMinutes = (time) => { const [h, m] = String(time).split(':').map(Number); return h * 60 + m; };
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c]));
  let profile = read(keys.profile, null);
  let tasks = read(keys.tasks, []);
  let stats = read(keys.stats, { conflicts: 0, lastSubmitAt: 0 });
  let selectedDate = todayIso();

  function save() { write(keys.profile, profile); write(keys.tasks, tasks); write(keys.stats, stats); window.TimeGuardNav?.renderAuthNav?.(); }
  function plan() { return String(profile?.plan || 'free').toLowerCase(); }
  function planLimit() { return limits[plan()] || limits.free; }
  function toast(message) { const el = $('toast'); if (!el) return; el.textContent = message; el.classList.remove('hidden'); clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.add('hidden'), 2600); }
  function showAlert(message, type = 'bad') { const el = $('alertBox'); if (!el) return; el.textContent = message; el.className = `alert ${type}`; el.classList.remove('hidden'); }
  function hideAlert() { $('alertBox')?.classList.add('hidden'); }
  function tasksByDate(date) { return tasks.filter(t => t.date === date).sort((a, b) => toMinutes(a.start) - toMinutes(b.start) || priorityWeight(a.priority) - priorityWeight(b.priority)); }
  function priorityWeight(p) { return { high: 0, medium: 1, low: 2 }[p] ?? 1; }
  function isFutureLimitBlocked(date) { const start = new Date(todayIso()); const target = new Date(date); const diff = Math.round((target - start) / 86400000); return diff > planLimit().daysAhead; }
  function findConflict(candidate) { return tasksByDate(candidate.date).find(t => t.id !== candidate.id && toMinutes(candidate.start) < toMinutes(t.end) && toMinutes(candidate.end) > toMinutes(t.start)); }

  function getDemoSessionId() {
    let sessionId = localStorage.getItem(keys.demoSession);
    if (!sessionId) {
      sessionId = crypto?.randomUUID ? crypto.randomUUID() : uid();
      localStorage.setItem(keys.demoSession, sessionId);
    }
    return sessionId;
  }

  function cloudClient() {
    return window.TimeGuardSupabase?.ready ? window.TimeGuardSupabase.client : null;
  }

  async function getCloudSession() {
    try {
      return await window.TimeGuardSupabase?.getSession?.();
    } catch (error) {
      console.error('TimeGuard Supabase session error:', error);
      return null;
    }
  }

  async function ensureCloudProfile(session) {
    const client = cloudClient();
    const user = session?.user;
    if (!client || !user) return;

    const cloudProfile = {
      id: user.id,
      email: user.email || profile?.email || 'demo@timeguard.local',
      full_name: profile?.name || user.user_metadata?.name || user.user_metadata?.full_name || 'Пользователь TimeGuard',
      role: profile?.role || 'user',
      plan: plan(),
      is_paid: plan() !== 'free',
      updated_at: new Date().toISOString()
    };

    const { error } = await client.from('profiles').upsert(cloudProfile, { onConflict: 'id' });
    if (error) console.error('TimeGuard profile sync error:', error);
  }

  async function saveEventToSupabase(eventType, payload = {}, userId = null) {
    const client = cloudClient();
    if (!client) return;

    const enrichedPayload = {
      ...payload,
      demo_session_id: getDemoSessionId(),
      page,
      local_created_at: new Date().toISOString()
    };

    try {
      if (userId) {
        const result = await client.from('task_events').insert({
          user_id: userId,
          event_type: eventType,
          payload: enrichedPayload
        });

        if (!result.error) return;
        console.warn('task_events insert failed, trying analytics_events:', result.error);
      }

      const fallback = await client.from('analytics_events').insert({
        event_type: eventType,
        event_payload: enrichedPayload,
        demo_session_id: getDemoSessionId()
      });

      if (fallback.error) console.error('analytics_events insert error:', fallback.error);
    } catch (error) {
      console.error('TimeGuard event sync error:', error);
    }
  }

  async function saveTaskToSupabase(task) {
    const client = cloudClient();
    if (!client) {
      console.warn('Supabase client is not ready. Task saved only locally.');
      return;
    }

    try {
      const session = await getCloudSession();
      const user = session?.user;

      if (user) {
        await ensureCloudProfile(session);

        const cloudTask = {
          user_id: user.id,
          local_id: task.id,
          task_date: task.date,
          title: task.title,
          start_time: task.start,
          end_time: task.end,
          priority: task.priority || 'medium',
          category: task.category || 'personal',
          notes: task.notes || '',
          done: Boolean(task.done),
          updated_at: new Date().toISOString()
        };

        const result = await client
          .from('tasks')
          .upsert(cloudTask, { onConflict: 'user_id,local_id' })
          .select();

        if (result.error) {
          console.error('Supabase authenticated task sync error:', result.error);
        } else {
          console.log('Task saved to Supabase:', result.data);
          await saveEventToSupabase('task_created', { task_id: task.id, title: task.title, date: task.date, start: task.start, end: task.end }, user.id);
          return;
        }
      }

      const demoTask = {
        title: task.title,
        task_date: task.date,
        start_time: task.start,
        end_time: task.end,
        priority: task.priority || 'medium',
        category: task.category || 'personal',
        note: task.notes || '',
        is_done: Boolean(task.done),
        demo_session_id: getDemoSessionId()
      };

      const fallback = await client.from('tasks').insert(demoTask).select();
      if (fallback.error) {
        console.error('Supabase demo task sync error:', fallback.error);
        showAlert(`Локально задача сохранена, но Supabase не принял запись: ${fallback.error.message}`, 'bad');
        return;
      }

      console.log('Demo task saved to Supabase:', fallback.data);
      await saveEventToSupabase('task_created', { task_id: task.id, title: task.title, date: task.date, start: task.start, end: task.end });
    } catch (error) {
      console.error('TimeGuard task sync error:', error);
      showAlert('Локально задача сохранена, но отправка в Supabase не прошла. Откройте Console.', 'bad');
    }
  }

  async function updateTaskStatusInSupabase(task) {
    const client = cloudClient();
    if (!client) return;

    try {
      const session = await getCloudSession();
      const user = session?.user;
      if (!user) return;

      const result = await client
        .from('tasks')
        .update({ done: Boolean(task.done), updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('local_id', task.id);

      if (result.error) console.error('Supabase task status update error:', result.error);
      await saveEventToSupabase(task.done ? 'task_completed' : 'task_reopened', { task_id: task.id, title: task.title }, user.id);
    } catch (error) {
      console.error('TimeGuard task status sync error:', error);
    }
  }

  function renderProfile() { if ($('profileRoleBadge')) $('profileRoleBadge').textContent = profile ? 'аккаунт' : 'гость'; if ($('planBadge')) $('planBadge').textContent = String(plan()).toUpperCase(); if ($('profileName')) $('profileName').value = profile?.name || ''; if ($('profileEmail')) $('profileEmail').value = profile?.email || ''; if ($('profileSummary') && profile) { $('profileSummary').textContent = `${profile.name || 'Пользователь'} · ${profile.email || 'email не указан'} · тариф ${String(profile.plan || 'free').toUpperCase()}`; $('profileSummary').classList.remove('hidden'); } }
  function renderStats() { if ($('tasksTodayCount')) $('tasksTodayCount').textContent = tasksByDate(selectedDate).length; if ($('conflictCount')) $('conflictCount').textContent = stats.conflicts || 0; if ($('daysCount')) $('daysCount').textContent = new Set(tasks.map(t => t.date)).size; }
  function renderTimeline() { const list = tasksByDate(selectedDate); if ($('taskDate')) $('taskDate').value = selectedDate; if ($('selectedDateTitle')) $('selectedDateTitle').textContent = `План на ${selectedDate}`; if ($('emptyState')) $('emptyState').classList.toggle('hidden', list.length > 0); if (!$('timeline')) return; $('timeline').innerHTML = list.map(task => `<article class="task ${task.done ? 'done' : ''}"><time>${task.start}–${task.end}</time><div><h3>${esc(task.title)}</h3><p>${esc(task.notes || 'Без комментария')}</p><span class="badge">${labelPriority(task.priority)}</span><span class="badge">${labelCategory(task.category)}</span></div><div class="actions"><button class="btn btn-ghost" data-done="${task.id}">${task.done ? 'Вернуть' : 'Готово'}</button><button class="btn btn-ghost" data-delete="${task.id}">Удалить</button></div></article>`).join(''); document.querySelectorAll('[data-done]').forEach(btn => btn.addEventListener('click', () => toggleDone(btn.dataset.done))); document.querySelectorAll('[data-delete]').forEach(btn => btn.addEventListener('click', () => deleteTask(btn.dataset.delete))); }
  function renderDayView() { const box = $('dayView'); if (!box) return; const list = tasksByDate(selectedDate); if ($('visualDateTitle')) $('visualDateTitle').textContent = `Расписание на ${selectedDate}`; const hours = Array.from({ length: 15 }, (_, i) => i + 8); box.innerHTML = hours.map(hour => { const start = hour * 60; const end = start + 60; const items = list.filter(task => toMinutes(task.start) >= start && toMinutes(task.start) < end); return `<div class="day-row"><div class="day-hour">${String(hour).padStart(2, '0')}:00</div><div class="day-events">${items.length ? items.map(task => `<div class="day-event ${task.priority || 'medium'} ${task.done ? 'done' : ''}"><small>${task.start}–${task.end} · ${labelPriority(task.priority)} · ${labelCategory(task.category)}</small><strong>${esc(task.title)}</strong></div>`).join('') : '<span class="day-empty-slot">Свободно</span>'}</div></div>`; }).join(''); }
  function labelPriority(p) { return { high: 'Высокий', medium: 'Средний', low: 'Низкий' }[p] || p; }
  function labelCategory(c) { return { study: 'Учёба', work: 'Работа', meeting: 'Встреча', personal: 'Личное', health: 'Здоровье' }[c] || c; }
  function renderAll() { renderProfile(); renderStats(); renderTimeline(); renderDayView(); }

  function toggleDone(id) { const changed = tasks.find(t => t.id === id); tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t); save(); renderAll(); const updated = tasks.find(t => t.id === id) || changed; if (updated) updateTaskStatusInSupabase(updated); }
  function deleteTask(id) { tasks = tasks.filter(t => t.id !== id); save(); renderAll(); toast('Задача удалена'); }

  function commitNewTask(task, form, message = 'Задача добавлена. План дня обновлён.') {
    tasks.push(task);
    stats.lastSubmitAt = Date.now();
    selectedDate = task.date;
    save();
    form?.reset();
    if ($('taskDate')) $('taskDate').value = selectedDate;
    renderAll();
    showAlert(message, 'ok');
    saveTaskToSupabase(task);
  }

  function showConflictDialog(task, conflict, form) {
    stats.conflicts = Number(stats.conflicts || 0) + 1;
    save();
    renderStats();
    saveEventToSupabase('time_conflict_blocked', { next_title: task.title, next_date: task.date, next_start: task.start, next_end: task.end, conflict_title: conflict.title, conflict_start: conflict.start, conflict_end: conflict.end });

    const replace = () => {
      tasks = tasks.filter(item => item.id !== conflict.id);
      commitNewTask(task, form, `Задача «${conflict.title}» заменена на «${task.title}».`);
    };
    const chooseTime = () => {
      showAlert('Выберите другое время для новой задачи.', 'bad');
      $('taskStart')?.focus();
    };

    if (window.TimeGuardConflict?.open) {
      window.TimeGuardConflict.open({ conflict, next: task, onReplace: replace, onChooseTime: chooseTime });
      return;
    }

    const shouldReplace = confirm(`Конфликт задач: «${task.title}» пересекается с «${conflict.title}» (${conflict.start}–${conflict.end}). Заменить существующую задачу новой?`);
    if (shouldReplace) replace(); else chooseTime();
  }

  function addTaskFromForm(event) {
    event.preventDefault();
    hideAlert();
    const now = Date.now();
    if (now - Number(stats.lastSubmitAt || 0) < 2500) { showAlert('Слишком быстро. Подождите пару секунд перед повторным добавлением.'); return; }
    const task = { id: uid(), date: $('taskDate').value, title: $('taskTitle').value.trim(), start: $('taskStart').value, end: $('taskEnd').value, priority: $('taskPriority').value, category: $('taskCategory').value, notes: $('taskNotes').value.trim(), done: false, createdAt: new Date().toISOString() };
    if (!$('robotCheck').checked) { showAlert('Поставьте отметку «Я не робот» перед сохранением.'); return; }
    if (!task.date || !task.title || !task.start || !task.end) { showAlert('Заполните дату, название, начало и окончание задачи.'); return; }
    if (toMinutes(task.end) <= toMinutes(task.start)) { showAlert('Окончание задачи должно быть позже начала.'); return; }
    if (isFutureLimitBlocked(task.date)) { openPaywall(); return; }
    if (tasksByDate(task.date).length >= planLimit().perDay) { openPaywall(); return; }
    const conflict = findConflict(task);
    if (conflict) { showConflictDialog(task, conflict, event.target); return; }
    commitNewTask(task, event.target);
  }

  function openPaywall() { $('paywallModal')?.classList.remove('hidden'); toast('Достигнут Free-лимит'); saveEventToSupabase('paywall_opened', { plan: plan(), selectedDate }); }
  function closePaywall() { $('paywallModal')?.classList.add('hidden'); }
  function shiftDate(days) { const d = new Date(selectedDate); d.setDate(d.getDate() + days); selectedDate = d.toISOString().slice(0, 10); renderAll(); }
  function fillDemo() { const date = todayIso(); const examples = [{ title: 'Разобрать проект', start: '10:00', end: '11:30', priority: 'high', category: 'study', notes: 'Подготовить структуру' }, { title: 'Рабочая встреча', start: '12:00', end: '13:00', priority: 'medium', category: 'meeting', notes: 'Обсудить задачи на день' }, { title: 'Тренировка', start: '18:30', end: '19:30', priority: 'low', category: 'health', notes: 'Не забыть форму' }]; const demoTasks = examples.map(item => ({ id: uid(), date, done: false, createdAt: new Date().toISOString(), ...item })); tasks = tasks.filter(t => t.date !== date).concat(demoTasks); selectedDate = date; save(); renderAll(); demoTasks.forEach(task => saveTaskToSupabase(task)); toast('Примерный день добавлен'); }
  function clearDay() { tasks = tasks.filter(t => t.date !== selectedDate); save(); renderAll(); toast('День очищен'); }
  function bindApp() { selectedDate = todayIso(); if ($('taskDate')) $('taskDate').value = selectedDate; $('profileForm')?.addEventListener('submit', (e) => { e.preventDefault(); profile = { name: $('profileName').value.trim() || 'Пользователь TimeGuard', email: $('profileEmail').value.trim() || 'user@example.com', role: profile?.role || 'user', plan: profile?.plan || 'free', createdAt: profile?.createdAt || new Date().toISOString() }; save(); ensureCloudProfileFromForm(); renderAll(); toast('Профиль сохранён'); }); $('taskForm')?.addEventListener('submit', addTaskFromForm); $('fillDemoBtn')?.addEventListener('click', fillDemo); $('clearDayBtn')?.addEventListener('click', clearDay); $('prevDateBtn')?.addEventListener('click', () => shiftDate(-1)); $('nextDateBtn')?.addEventListener('click', () => shiftDate(1)); $('todayBtn')?.addEventListener('click', () => { selectedDate = todayIso(); renderAll(); }); $('closePaywallBtn')?.addEventListener('click', closePaywall); $('stayFreeBtn')?.addEventListener('click', closePaywall); }
  async function ensureCloudProfileFromForm() { const session = await getCloudSession(); if (session?.user) await ensureCloudProfile(session); }
  function cabinet() { const box = $('cabinetProfile'); if (box) box.textContent = profile ? `${profile.name} · ${profile.email}` : 'Профиль ещё не создан'; if ($('cabinetPlan')) $('cabinetPlan').textContent = String(plan()).toUpperCase(); const grouped = [...new Set(tasks.map(t => t.date))].sort(); $('cabinetEmpty')?.classList.toggle('hidden', grouped.length > 0); if ($('cabinetPlans')) $('cabinetPlans').innerHTML = grouped.map(date => `<article class="card small-card"><h3>${date}</h3><p>${tasksByDate(date).length} задач</p><p>${tasksByDate(date).filter(t => t.done).length} выполнено</p></article>`).join(''); }
  function pricing() { document.querySelectorAll('[data-plan]').forEach(btn => btn.addEventListener('click', () => { localStorage.setItem('timeguard_selected_plan', btn.dataset.plan); location.href = `payment-success.html?plan=${btn.dataset.plan}`; })); }
  function payment() { const params = new URLSearchParams(location.search); const newPlan = params.get('plan') || localStorage.getItem('timeguard_selected_plan') || 'plus'; if ($('activatedPlan')) $('activatedPlan').textContent = newPlan.toUpperCase(); $('activatePlanBtn')?.addEventListener('click', () => { profile = profile || { name: 'Пользователь TimeGuard', email: 'user@example.com', role: 'user' }; profile.plan = newPlan; save(); toast('Тариф активирован'); setTimeout(() => location.href = 'cabinet.html?v=12', 800); }); }
  function admin() { const allowed = profile?.role === 'admin'; $('adminDenied')?.classList.toggle('hidden', allowed); $('adminContent')?.classList.toggle('hidden', !allowed); if (allowed) { $('adminUsers').textContent = profile ? 1 : 0; $('adminTasks').textContent = tasks.length; $('adminDays').textContent = new Set(tasks.map(t => t.date)).size; $('adminDone').textContent = tasks.filter(t => t.done).length; } }
  if (page === 'app') { bindApp(); renderAll(); }
  if (page === 'cabinet') cabinet();
  if (page === 'pricing') pricing();
  if (page === 'payment') payment();
  if (page === 'admin') admin();
})();