(() => {
  const TASKS_KEY = 'timeguard_tasks_v1';
  const $ = (id) => document.getElementById(id);
  const readTasks = () => {
    try { return JSON.parse(localStorage.getItem(TASKS_KEY) || '[]'); } catch { return []; }
  };
  const selectedDate = () => $('taskDate')?.value || new Date().toISOString().slice(0, 10);
  const labelPriority = (value) => ({ high: 'Высокий', medium: 'Средний', low: 'Низкий' }[value] || value);
  const labelCategory = (value) => ({ study: 'Учёба', work: 'Работа', meeting: 'Встреча', personal: 'Личное', health: 'Здоровье' }[value] || value);
  const toDate = (iso) => { const d = new Date(iso); return Number.isNaN(d.getTime()) ? new Date() : d; };
  const addDays = (iso, count) => { const d = toDate(iso); d.setDate(d.getDate() + count); return d.toISOString().slice(0, 10); };

  function ensurePanel() {
    if ($('upgradePanel')) return;
    const side = document.querySelector('.layout .stack');
    if (!side) return;
    const panel = document.createElement('section');
    panel.className = 'card pad';
    panel.id = 'upgradePanel';
    panel.innerHTML = `
      <p class="eyebrow">Pro tools</p>
      <h2>Контроль плана</h2>
      <div class="stats"><div><strong id="progressValue">0%</strong><span id="progressText">выполнено за день</span></div></div>
      <div class="stack" style="margin-top:14px">
        <label class="field"><span>Фильтр по приоритету</span><select id="filterPriority"><option value="all">Все</option><option value="high">Высокий</option><option value="medium">Средний</option><option value="low">Низкий</option></select></label>
        <label class="field"><span>Фильтр по категории</span><select id="filterCategory"><option value="all">Все</option><option value="study">Учёба</option><option value="work">Работа</option><option value="meeting">Встреча</option><option value="personal">Личное</option><option value="health">Здоровье</option></select></label>
        <button class="btn btn-secondary" id="exportTxtBtn" type="button">Экспорт TXT</button>
        <button class="btn btn-ghost" id="exportJsonBtn" type="button">Экспорт JSON</button>
      </div>`;
    side.appendChild(panel);
  }

  function ensureWeekPanel() {
    if ($('weekPanel')) return;
    const timelineCard = $('timeline')?.closest('.card');
    if (!timelineCard) return;
    const panel = document.createElement('div');
    panel.id = 'weekPanel';
    panel.className = 'cards';
    panel.style.margin = '16px 0';
    timelineCard.insertBefore(panel, $('alertBox'));
  }

  function dayTasks(date) {
    return readTasks().filter((task) => task.date === date).sort((a, b) => String(a.start).localeCompare(String(b.start)));
  }

  function renderProgress() {
    const list = dayTasks(selectedDate());
    const done = list.filter((task) => task.done).length;
    const percent = list.length ? Math.round((done / list.length) * 100) : 0;
    if ($('progressValue')) $('progressValue').textContent = `${percent}%`;
    if ($('progressText')) $('progressText').textContent = `${done} из ${list.length} задач выполнено`;
  }

  function renderWeek() {
    const panel = $('weekPanel');
    if (!panel) return;
    const start = selectedDate();
    const html = Array.from({ length: 7 }, (_, index) => {
      const date = addDays(start, index);
      const list = dayTasks(date);
      const done = list.filter((task) => task.done).length;
      return `<article class="card small-card"><h3>${date}</h3><p>${list.length} задач</p><p>${done} выполнено</p></article>`;
    }).join('');
    panel.innerHTML = html;
  }

  function applyFilters() {
    const priority = $('filterPriority')?.value || 'all';
    const category = $('filterCategory')?.value || 'all';
    const priorityLabel = priority === 'all' ? '' : labelPriority(priority);
    const categoryLabel = category === 'all' ? '' : labelCategory(category);
    document.querySelectorAll('#timeline .task').forEach((card) => {
      const text = card.textContent || '';
      const okPriority = !priorityLabel || text.includes(priorityLabel);
      const okCategory = !categoryLabel || text.includes(categoryLabel);
      card.style.display = okPriority && okCategory ? '' : 'none';
    });
  }

  function download(name, content, type) {
    const blob = new Blob([content], { type });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
  }

  function exportTxt() {
    const date = selectedDate();
    const list = dayTasks(date);
    const lines = [`TimeGuard Planner`, `Дата: ${date}`, `Задач: ${list.length}`, ''];
    list.forEach((task, index) => {
      lines.push(`${index + 1}. ${task.start}-${task.end} ${task.title}`);
      lines.push(`   Приоритет: ${labelPriority(task.priority)} · Категория: ${labelCategory(task.category)} · Статус: ${task.done ? 'выполнено' : 'в работе'}`);
      if (task.notes) lines.push(`   Комментарий: ${task.notes}`);
    });
    download(`timeguard-${date}.txt`, lines.join('\n'), 'text/plain;charset=utf-8');
  }

  function exportJson() {
    const date = selectedDate();
    const payload = { product: 'TimeGuard Planner', date, tasks: dayTasks(date) };
    download(`timeguard-${date}.json`, JSON.stringify(payload, null, 2), 'application/json;charset=utf-8');
  }

  function refresh() {
    ensurePanel();
    ensureWeekPanel();
    renderProgress();
    renderWeek();
    applyFilters();
  }

  document.addEventListener('DOMContentLoaded', () => {
    ensurePanel();
    ensureWeekPanel();
    $('filterPriority')?.addEventListener('change', applyFilters);
    $('filterCategory')?.addEventListener('change', applyFilters);
    $('exportTxtBtn')?.addEventListener('click', exportTxt);
    $('exportJsonBtn')?.addEventListener('click', exportJson);
    document.body.addEventListener('click', () => setTimeout(refresh, 100));
    document.body.addEventListener('change', () => setTimeout(refresh, 100));
    refresh();
    setInterval(refresh, 1500);
  });
})();
