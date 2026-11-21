// categories-sync.js — Єдиний реєстр категорій та навігації для всіх сторінок порталу

window.PORTAL_CATEGORIES = [
  { key: 'auto', emoji: '🚗', label: 'Автодіагностика & ECU', page: 'auto.html' },
  { key: 'pc', emoji: '💻', label: "Комп'ютери", page: 'service.html' },
  { key: 'office', emoji: '🖨️', label: 'Оргтехніка', page: 'baza.html' },
  { key: 'engineering', emoji: '⚙️', label: 'Інженерія & Схеми', page: 'engineering.html' },
  { key: 'radio', emoji: '📻', label: "Радіозв'язок", page: 'baza.html' },
  { key: 'ev', emoji: '🔋', label: 'Електротранспорт & АКБ', page: 'auto.html' },
  { key: 'law', emoji: '⚖️', label: 'Законодавство & Юриспруденція', page: 'baza.html' },
  { key: 'docs', emoji: '📑', label: 'Діловодство & Документи', page: 'service.html' },
  { key: 'business', emoji: '🏪', label: 'Місцевий бізнес & Послуги', page: 'shop.html' },
  { key: 'construction', emoji: '🏗️', label: 'Будівництво & Ремонт', page: 'service.html' },
  { key: 'security', emoji: '🛡️', label: 'Цифрова безпека & IT', page: 'baza.html' },
  { key: 'education', emoji: '🎓', label: 'Навчання & Освіта', page: 'baza.html' },
  { key: 'energy', emoji: '💡', label: 'Енергонезалежність & ДБЖ', page: 'engineering.html' },
  { key: 'youtube', emoji: '▶️', label: 'YouTube Відео', page: 'https://www.youtube.com/@NeoService-3' },
  { key: 'sponsored', emoji: '📢', label: 'Спонсоровано', page: 'service.html' }
];

// 1. Нормалізація будь-якої назви або ключа до єдиного стандарту
window.resolvePortalCategoryKey = function (raw, title = '') {
  const text = `${String(raw || '')} ${String(title || '')}`.toLowerCase().trim();
  if (!text) return 'all';

  const exact = window.PORTAL_CATEGORIES.find(
    c => c.key === String(raw || '').toLowerCase().trim() || c.label.toLowerCase() === text
  );
  if (exact) return exact.key;

  if (text.includes('навчання') || text.includes('освіт') || text.includes('education')) return 'education';
  if (text.includes('законодавств') || text.includes('юрист') || text.includes('право') || text.includes('law')) return 'law';
  if (text.includes('електротранспорт') || text.includes('акб') || text.includes('bms') || text.includes('ev')) return 'ev';
  if (text.includes('авто') || text.includes('ecu') || text.includes('діагност')) return 'auto';
  if (text.includes("комп'ютер") || text.includes('компютер') || text.includes('пк') || text === 'pc') return 'pc';
  if (text.includes('оргтехнік') || text.includes('принтер') || text.includes('office')) return 'office';
  if (text.includes('інженер') || text.includes('схем') || text.includes('pcb') || text.includes('engineering')) return 'engineering';
  if (text.includes('радіозв') || text.includes('радіо') || text.includes('radio')) return 'radio';
  if (text.includes('діловодств') || text.includes('документ') || text.includes('docs')) return 'docs';
  if (text.includes('будівництв') || text.includes('ремонт') || text.includes('construction')) return 'construction';
  if (text.includes('безпек') || text.includes('кібер') || text.includes('security')) return 'security';
  if (text.includes('енергонезалежн') || text.includes('дбж') || text.includes('інвертор') || text.includes('energy')) return 'energy';
  if (text.includes('youtube') || text.includes('відео')) return 'youtube';
  if (text.includes('спонсор') || text.includes('реклам') || text.includes('sponsored')) return 'sponsored';
  if (text.includes('бізнес') || text.includes('послуг') || text.includes('business')) return 'business';

  return 'all';
};

// 2. Генерація точного посилання на цільову сторінку з параметром ?category=ключ
window.buildCategoryTargetUrl = function (categoryKey, customPage = '') {
  const key = window.resolvePortalCategoryKey(categoryKey);
  const catObj = window.PORTAL_CATEGORIES.find(c => c.key === key);
  if (!catObj) return `baza.html?category=${encodeURIComponent(key)}`;

  if (catObj.page.startsWith('http')) {
    return catObj.page;
  }

  const targetPage = customPage || catObj.page;
  return `${targetPage}?category=${encodeURIComponent(catObj.key)}`;
};

// 3. Автоматична активація кнопки категорії на будь-якій сторінці при відкритті за ?category=...
window.applyPortalCategoryFromUrl = function (onCategorySelected) {
  const params = new URLSearchParams(window.location.search);
  const rawCat = params.get('category') || params.get('cat');
  if (!rawCat) return null;

  const key = window.resolvePortalCategoryKey(rawCat);
  const catObj = window.PORTAL_CATEGORIES.find(c => c.key === key);

  if (typeof onCategorySelected === 'function') {
    onCategorySelected(key, catObj);
  }

  // Підсвітити кнопку категорії на сторінці, якщо вона має data-category або відповідний текст
  const buttons = Array.from(document.querySelectorAll('[data-category], [data-filter], .cat-pill, .discover-tab'));
  buttons.forEach(btn => {
    const btnAttr = btn.getAttribute('data-category') || btn.getAttribute('data-filter') || '';
    const btnKey = btnAttr ? window.resolvePortalCategoryKey(btnAttr) : '';
    const btnText = (btn.textContent || '').toLowerCase();
    const isMatch =
      btnKey === key ||
      (catObj && btnText.includes(catObj.label.toLowerCase()));

    if (isMatch) {
      btn.classList.add('active', 'bg-blue-600', 'bg-[#1e3a8a]', 'text-white');
      btn.classList.remove('bg-slate-100', 'text-slate-700');
      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    } else if (btn.hasAttribute('data-category') || btn.classList.contains('cat-pill')) {
      btn.classList.remove('active', 'bg-blue-600', 'bg-[#1e3a8a]', 'text-white');
    }
  });

  return key;
};