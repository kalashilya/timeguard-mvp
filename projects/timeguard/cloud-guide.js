(() => {
  function addCloudGuide() {
    const main = document.querySelector('main .container');
    if (!main || document.getElementById('cloudGuideSection')) return;
    const section = document.createElement('section');
    section.className = 'section';
    section.id = 'cloudGuideSection';
    section.innerHTML = `
      <div class="section-title">
        <div><p class="eyebrow">Как работает Cloud</p><h2>Понятный сценарий синхронизации</h2></div>
        <p>Cloud показывает не локальные задачи из браузера, а данные текущего пользователя, загруженные из Supabase.</p>
      </div>
      <div class="cards">
        <article class="card small-card"><div class="step-number">1</div><h3>Создать план</h3><p>Добавьте задачи в планировщике и проверьте, что нет пересечений по времени.</p></article>
        <article class="card small-card"><div class="step-number">2</div><h3>Синхронизировать</h3><p>Откройте кабинет и отправьте локальные задачи в Supabase.</p></article>
        <article class="card small-card"><div class="step-number">3</div><h3>Открыть Cloud</h3><p>Нажмите «Загрузить из Supabase», чтобы увидеть задачи из базы.</p></article>
      </div>
    `;
    main.append(section);
  }
  document.addEventListener('DOMContentLoaded', addCloudGuide);
})();
