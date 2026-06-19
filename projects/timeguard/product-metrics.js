(() => {
  function addProductMetrics() {
    const main = document.querySelector('main');
    if (!main || document.getElementById('productMetricsSection')) return;
    const section = document.createElement('section');
    section.className = 'section';
    section.id = 'productMetricsSection';
    section.innerHTML = `
      <div class="container">
        <div class="section-title">
          <div><p class="eyebrow">Гипотеза и метрики</p><h2>Как проверяется ценность TimeGuard</h2></div>
          <p>Продукт должен сокращать время ручной проверки расписания и уменьшать количество конфликтов задач.</p>
        </div>
        <div class="cards">
          <article class="card small-card"><div class="feature-icon">🎯</div><h3>Гипотеза</h3><p class="lead">TimeGuard сокращает проверку расписания с 10–15 минут до 3–5 минут за счёт автоматической проверки пересечений.</p></article>
          <article class="card small-card"><div class="feature-icon">📈</div><h3>Метрики</h3><p class="lead">Время составления плана, количество заблокированных конфликтов, повторные визиты, синхронизации с Cloud.</p></article>
          <article class="card small-card"><div class="feature-icon">💬</div><h3>Проверка</h3><p class="lead">Пользователь проходит сценарий: регистрация, план, конфликт, редактирование, кабинет, синхронизация, Cloud.</p></article>
        </div>
      </div>
    `;
    main.append(section);
  }
  document.addEventListener('DOMContentLoaded', addProductMetrics);
})();
