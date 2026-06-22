/* Charge le contenu édité via le CMS (fichier JSON) et l'injecte dans la page.
   Ne casse rien si le fichier est absent ou si un champ n'est pas encore rempli :
   le texte écrit en dur dans le HTML reste alors affiché. */
async function applyContent(jsonPath) {
  try {
    const res = await fetch(jsonPath, { cache: 'no-store' });
    if (!res.ok) return;
    const data = await res.json();

    document.querySelectorAll('[data-text]').forEach((el) => {
      const key = el.getAttribute('data-text');
      if (data[key] !== undefined && data[key] !== '') el.textContent = data[key];
    });

    document.querySelectorAll('[data-tel]').forEach((el) => {
      const key = el.getAttribute('data-tel');
      if (data[key]) el.setAttribute('href', 'tel:' + String(data[key]).replace(/[^\d+]/g, ''));
    });

    document.querySelectorAll('[data-mail]').forEach((el) => {
      const key = el.getAttribute('data-mail');
      if (data[key]) el.setAttribute('href', 'mailto:' + data[key]);
    });

    document.querySelectorAll('[data-img]').forEach((el) => {
      const key = el.getAttribute('data-img');
      if (data[key]) {
        el.setAttribute('src', data[key]);
        el.style.display = '';
      }
    });

    document.querySelectorAll('[data-list]').forEach((el) => {
      const key = el.getAttribute('data-list');
      const items = data[key];
      if (!Array.isArray(items) || items.length === 0) return;
      el.innerHTML = '';
      items.forEach((item) => {
        const li = document.createElement('li');
        if (typeof item === 'string') {
          li.className = el.getAttribute('data-item-class') || '';
          li.textContent = item;
        } else if (item && typeof item === 'object') {
          const k = document.createElement('span');
          k.className = 'k';
          k.textContent = item.label || '';
          const v = document.createElement('span');
          v.className = 'v';
          v.textContent = item.text || '';
          li.appendChild(k);
          li.appendChild(v);
        }
        el.appendChild(li);
      });
    });
  } catch (e) {
    console.warn('Contenu dynamique non chargé :', e);
  }
}
