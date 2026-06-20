(() => {
  function ensureModal() {
    if (document.getElementById('conflictModal')) return;
    document.body.insertAdjacentHTML('beforeend', `
      <div id="conflictModal" class="modal hidden">
        <div class="modal-card">
          <button id="closeConflictModalBtn" class="close" type="button">×</button>
          <p class="eyebrow">Конфликт задач</p>
          <h2>Это время уже занято</h2>
          <p id="conflictModalText" class="lead">Новая задача пересекается с другой задачей.</p>
          <div class="alert bad" id="conflictModalDetails"></div>
          <div class="actions">
            <button class="btn btn-primary" id="replaceConflictTaskBtn" type="button">Заменить задачу</button>
            <button class="btn btn-secondary" id="chooseAnotherTimeBtn" type="button">Выбрать другое время</button>
          </div>
        </div>
      </div>
    `);
  }

  function close() {
    document.getElementById('conflictModal')?.classList.add('hidden');
  }

  function open(options = {}) {
    ensureModal();
    const modal = document.getElementById('conflictModal');
    const text = document.getElementById('conflictModalText');
    const details = document.getElementById('conflictModalDetails');
    const replaceBtn = document.getElementById('replaceConflictTaskBtn');
    const chooseBtn = document.getElementById('chooseAnotherTimeBtn');
    const closeBtn = document.getElementById('closeConflictModalBtn');
    const conflict = options.conflict || {};
    const next = options.next || {};

    if (text) {
      text.textContent = `Задача «${next.title || 'Новая задача'}» пересекается с уже существующей задачей.`;
    }
    if (details) {
      details.textContent = `Конфликт: «${conflict.title || 'Задача'}» ${conflict.start || conflict.start_time || ''}–${conflict.end || conflict.end_time || ''}. Замените её новой задачей или выберите другое время.`;
    }

    replaceBtn.onclick = () => {
      close();
      options.onReplace?.();
    };
    chooseBtn.onclick = () => {
      close();
      options.onChooseTime?.();
    };
    closeBtn.onclick = () => {
      close();
      options.onChooseTime?.();
    };

    modal?.classList.remove('hidden');
  }

  document.addEventListener('DOMContentLoaded', ensureModal);
  window.TimeGuardConflict = { open, close };
})();
