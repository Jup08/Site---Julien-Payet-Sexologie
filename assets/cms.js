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

/* ============================================================
   APPARENCE (couleurs & polices) — piloté depuis Decap CMS,
   fichier content/theme.json. N'affecte rien si le fichier est
   absent : les valeurs par défaut du CSS restent actives.
   ============================================================ */

const POLICES_GOOGLE = {
  titre: {
    "Newsreader": "family=Newsreader:ital,opsz,wght@0,72,400;0,72,500;1,72,400;0,144,600",
    "Fraunces": "family=Fraunces:wght@400;500;600",
    "Playfair Display": "family=Playfair+Display:wght@400;500;600;700",
    "Lora": "family=Lora:ital,wght@0,400;0,500;0,600;1,400",
    "Cormorant Garamond": "family=Cormorant+Garamond:wght@400;500;600;700"
  },
  texte: {
    "Public Sans": "family=Public+Sans:wght@400;500;600;700",
    "Inter": "family=Inter:wght@400;500;600;700",
    "Work Sans": "family=Work+Sans:wght@400;500;600;700",
    "Karla": "family=Karla:wght@400;500;600;700",
    "Source Sans 3": "family=Source+Sans+3:wght@400;500;600;700"
  }
};

function chargerPoliceGoogle(parametre) {
  const href = 'https://fonts.googleapis.com/css2?' + parametre + '&display=swap';
  if (document.querySelector('link[href="' + href + '"]')) return;
  const lien = document.createElement('link');
  lien.rel = 'stylesheet';
  lien.href = href;
  document.head.appendChild(lien);
}

async function applyTheme(jsonPath) {
  try {
    const res = await fetch(jsonPath, { cache: 'no-store' });
    if (!res.ok) return;
    const data = await res.json();
    const racine = document.documentElement.style;

    if (data.bg) racine.setProperty('--bg', data.bg);
    if (data.bg_alt) racine.setProperty('--bg-alt', data.bg_alt);
    if (data.ink) racine.setProperty('--ink', data.ink);
    if (data.ink_soft) racine.setProperty('--ink-soft', data.ink_soft);
    if (data.accent) racine.setProperty('--accent', data.accent);
    if (data.accent_soft) racine.setProperty('--accent-soft', data.accent_soft);

    if (data.font_titre && POLICES_GOOGLE.titre[data.font_titre]) {
      chargerPoliceGoogle(POLICES_GOOGLE.titre[data.font_titre]);
      racine.setProperty('--font-titre', "'" + data.font_titre + "', serif");
    }
    if (data.font_texte && POLICES_GOOGLE.texte[data.font_texte]) {
      chargerPoliceGoogle(POLICES_GOOGLE.texte[data.font_texte]);
      racine.setProperty('--font-texte', "'" + data.font_texte + "', sans-serif");
    }
  } catch (e) {
    console.warn('Apparence non chargée :', e);
  }
}
