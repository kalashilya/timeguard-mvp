(() => {
  const TASKS_KEY = 'timeguard_tasks_v1';

  const readTasks = () => {
    try { return JSON.parse(localStorage.getItem(TASKS_KEY)) || []; } catch { return []; }
  };

  const saveTasks = (tasks) => localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  const toMinutes = (time) => { const [h, m] = String(time).split(':').map(Number); return h * 60 + m; };

  function makeCalendarUrl(task) {
    const day = task.date.replaceAll('-', '');
    const start = task.start.replace(':', '');
    const end = task.end.replace(':', '');
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: task.title || 'TimeGuard task',
      dates: `${day}T${start}00/${day}T${end}00`,
      details: task.notes || 'Задача из TimeGuard Planner'
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  function ensureModal() {
    if (document.getElementById('editTaskModal')) return;
    document.body.insertAdjacentHTML('beforeend', `
      <div id="editTaskModal" class="modal hidden">
        <div class="modal-card">
          <button id="closeEditTaskBtn" class="close">×</button>
          <p class="eyebrow">Редактирование</p>
          <h2>Изменить задачу</h2>
          <form id="editTaskForm" class="stack">
            <input id="editTaskId" type="hidden">
            <label class="field"><span>Дата</span><input id="editTaskDate" type="date" required></label>
            <label class="field"><span>Название</span><input id="editTaskTitle" required></label>
            <label class="field"><span>Начало</span><input id="editTaskStart" type="time" required></label>
            <label class="field"><span>Окончание</span><input id="editTaskEnd" type="time" required></label>
            <label class="field"><span>Приоритет</span><select id="editTaskPriority"><option value="high">Высокий</option><option value="medium">Средний</option><option value="low">Низкий</option></select></label>
            <label class="field"><span>Категория</span><select id="editTaskCategory"><option value="study">Учёба</option><option value="work">Работа</option><option value="meeting">Встреча</option><option value="personal">Личное</option><option value="health">Здоровье</option></select></label>
            <label class="field"><span>Комментарий</span><textarea id="editTaskNotes"></textarea></label>
            <div class="actions"><button class="btn btn-primary" type="submit">Сохранить изменения</button><button class="btn btn-secondary" id="cancelEditTaskBtn" type="button">Отмена</button></div>
          </form>
        </div>
      </div>
    `);
    document.getElementById('closeEditTaskBtn')?.addEventListener('click', closeModal);
    document.getElementById('cancelEditTaskBtn')?.addEventListener('click', closeModal);
    document.getElementById('editTaskForm')?.addEventListener('submit', saveEdit);
  }

  function closeModal() {
    document.getElementById('editTaskModal')?.classList.add('hidden');
  }

  function openEdit(id) {
    ensureModal();
    const task = readTasks().find((item) => item.id === id);
    if (!task) return;
    editTaskId.value = task.id;
    editTaskDate.value = task.date;
    editTaskTitle.value = task.title;
    editTaskStart.value = task.start;
    editTaskEnd.value = task.end;
    editTaskPriority.value = task.priority || 'medium';
    editTaskCategory.value = task.category || 'work';
    editTaskNotes.value = task.notes || '';
    editTaskModal.classList.remove('hidden');
  }

  function saveEdit(event) {
    event.preventDefault();
    const tasks = readTasks();
    const id = editTaskId.value;
    const next = {
      ...tasks.find((item) => item.id === id),
      date: editTaskDate.value,
      title: editTaskTitle.value.trim(),
      start: editTaskStart.value,
      end: editTaskEnd.value,
      priority: editTaskPriority.value,
      category: editTaskCategory.value,
      notes: editTaskNotes.value.trim()
    };

    if (!next.title || !next.date || !next.start || !next.end) {
      alert('Заполните дату, название, начало и окончание.');
      return;
    }
    if (toMinutes(next.end) <= toMinutes(next.start)) {
      alert('Окончание должно быть позже начала.');
      return;
    }

    const conflict = tasks.find((task) => task.id !== id && task.date === next.date && toMinutes(next.start) < toMinutes(task.end) && toMinutes(next.end) > toMinutes(task.start));
    if (conflict) {
      alert(`Изменение невозможно: задача пересекается с «${conflict.title}».`);
      return;
    }

    saveTasks(tasks.map((task) => task.id === id ? next : task));
    closeModal();
    location.reload();
  }

  function enhanceTimeline() {
    const timeline = document.getElementById('timeline');
    if (!timeline) return;
    const tasks = readTasks();
    timeline.querySelectorAll('.task').forEach((card) => {
      if (card.dataset.enhanced === '1') return;
      const deleteButton = card.querySelector('[data-delete]');
      const id = deleteButton?.dataset.delete;
      const task = tasks.find((item) => item.id === id);
      if (!id || !task) return;
      const actions = card.querySelector('.actions');
      if (!actions) return;
      const edit = document.createElement('button');
      edit.className = 'btn btn-ghost';
      edit.type = 'button';
      edit.textContent = 'Редактировать';
      edit.addEventListener('click', () => openEdit(id));
      const calendar = document.createElement('a');
      calendar.className = 'btn btn-ghost';
      calendar.href = makeCalendarUrl(task);
      calendar.target = '_blank';
      calendar.rel = 'noopener';
      calendar.textContent = 'Google Calendar';
      actions.insertBefore(edit, deleteButton);
      actions.insertBefore(calendar, deleteButton);
      card.dataset.enhanced = '1';
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    ensureModal();
    enhanceTimeline();
    const timeline = document.getElementById('timeline');
    if (timeline) new MutationObserver(enhanceTimeline).observe(timeline, { childList: true, subtree: true });
  });
})();
