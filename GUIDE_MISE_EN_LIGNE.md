# Guide — Mettre le nouveau site en ligne (gratuit, auto-éditable, sans Wix)

Ce guide t'accompagne pas à pas. Compte environ 45 minutes pour la mise en place initiale. Une fois fait, tu n'auras plus jamais besoin de revenir sur ces étapes techniques : tu éditeras ton contenu depuis une interface simple.

**Ce qu'on met en place :**
- **GitHub** (gratuit) : stocke les fichiers de ton site
- **Netlify** (gratuit) : héberge le site et le rend accessible sur Internet
- **DecapBridge** (gratuit) : te permet de te connecter à l'interface d'édition sans compétence technique
- **Decap CMS** : l'interface d'édition elle-même, accessible à `tonsite.com/admin/`

Le fichier `site.zip` que je t'ai envoyé contient tout ce dont tu as besoin. Décompresse-le sur ton ordinateur avant de commencer — tu dois voir un dossier `site` contenant `index.html`, `pro.html`, un dossier `admin`, `content`, `assets`.

---

## Étape 1 — Créer un compte GitHub et y déposer le site

1. Va sur [github.com](https://github.com) et crée un compte gratuit.
2. Clique sur **New repository** (bouton vert, en haut à droite ou sur la page d'accueil).
3. Donne-lui un nom, par exemple `site-julien-payet`. Laisse-le en **Public**. Ne coche aucune case d'initialisation (pas de README). Clique **Create repository**.
4. Sur la page du dépôt vide, clique **uploading an existing file** (lien dans le message d'accueil).
5. Fais glisser **tout le contenu** du dossier `site` (pas le dossier lui-même, son contenu : `index.html`, `pro.html`, `netlify.toml`, et les dossiers `admin`, `content`, `assets`).
6. En bas de page, clique **Commit changes**.

Ton site est maintenant stocké sur GitHub, mais pas encore en ligne.

---

## Étape 2 — Héberger le site avec Netlify

1. Va sur [netlify.com](https://netlify.com) et crée un compte gratuit (tu peux te connecter directement avec ton compte GitHub, c'est plus rapide).
2. Clique **Add new site** → **Import an existing project**.
3. Choisis **GitHub**, autorise l'accès si demandé, puis sélectionne ton dépôt `site-julien-payet`.
4. Sur l'écran de configuration, laisse les champs **Build command** et **Publish directory** vides (le fichier `netlify.toml` déjà inclus s'occupe de tout). Clique **Deploy site**.
5. Après une minute, Netlify te donne une adresse provisoire du type `nom-aleatoire-123.netlify.app`. Ouvre-la : tu dois voir ton nouveau site.

---

## Étape 3 — Activer l'édition sans code (DecapBridge)

1. Va sur [decapbridge.com](https://decapbridge.com) et crée un compte gratuit.
2. Dans le tableau de bord, clique **Create New Site** (ou équivalent).
3. Renseigne le dépôt GitHub au format `ton-pseudo/site-julien-payet`.
4. Il te sera demandé un **jeton d'accès GitHub** (access token) pour autoriser DecapBridge à écrire sur ton dépôt :
   - Sur GitHub : clique ta photo de profil (haut droite) → **Settings** → tout en bas, **Developer settings** → **Personal access tokens** → **Fine-grained tokens** → **Generate new token**.
   - Donne-lui un nom, pas de date d'expiration (ou une date lointaine), et dans **Repository access**, sélectionne uniquement ton dépôt `site-julien-payet`.
   - Dans les permissions, donne l'accès **Read and write** sur **Contents**.
   - Génère le token, copie-le (il ne sera affiché qu'une fois), colle-le dans DecapBridge.
5. Une fois le site créé dans DecapBridge, note les deux informations qu'il t'affiche : une **identity_url** et une **gateway_url**.

---

## Étape 4 — Connecter DecapBridge à ton site

1. Sur GitHub, ouvre le fichier `admin/config.yml` de ton dépôt et clique sur le crayon (**Edit this file**).
2. Remplace les deux lignes suivantes par les vraies valeurs obtenues à l'étape 3 :
   ```
   repo: VOTRE-PSEUDO-GITHUB/VOTRE-DEPOT
   identity_url: https://auth.decapbridge.com/sites/VOTRE-SITE-ID
   ```
3. En bas de page, clique **Commit changes**. Netlify republie automatiquement le site (1-2 minutes).

---

## Étape 5 — T'inviter toi-même comme éditeur

1. Dans DecapBridge, sur la page de ton site, trouve l'option pour **inviter un collaborateur par email**.
2. Invite ta propre adresse email.
3. Tu reçois un email DecapBridge : suis le lien, crée ton mot de passe (ou connecte-toi avec Google).

---

## Étape 6 — Tester l'édition

1. Va sur `nom-aleatoire-123.netlify.app/admin/` (ton adresse Netlify provisoire, suivie de `/admin/`).
2. Connecte-toi avec les identifiants DecapBridge créés à l'étape 5.
3. Tu dois voir deux collections : **Page d'accueil** et **Espace professionnels**, avec tous les champs de texte modifiables.
4. Modifie un texte au hasard pour tester, clique **Save** puis **Publish** (selon l'interface). Attends 1-2 minutes, recharge ton site : le changement doit apparaître.
5. C'est aussi ici que tu pourras uploader ta vraie photo dans le champ **Photo** de la page d'accueil, le jour où tu veux la mettre.

---

## Étape 7 — Brancher ton nom de domaine

**Côté Netlify :**
1. Site settings → **Domain management** → **Add a domain** → entre `julienpayetsexologie.com`.
2. Netlify t'indique une adresse IP à utiliser pour l'enregistrement A (souvent `75.2.60.5`, mais vérifie celle qui t'est donnée), et une adresse `....netlify.app` pour le CNAME `www`.

**Côté Wix (le domaine reste chez eux, on ne fait que le rediriger) :**
1. Connecte-toi à ton compte Wix → **Domaines**.
2. Clique sur l'icône **Actions du domaine** (les trois points) à côté de `julienpayetsexologie.com` → **Gérer les enregistrements DNS**.
3. Supprime les enregistrements **A** et **CNAME** existants qui pointent vers Wix (pour éviter tout conflit).
4. Ajoute un nouvel enregistrement **A** : laisse le champ hôte vide ou mets `@`, et mets l'adresse IP donnée par Netlify.
5. Ajoute un enregistrement **CNAME** pour `www` pointant vers l'adresse `....netlify.app` donnée par Netlify.
6. Enregistre.

**Patience :** la propagation DNS prend de quelques minutes à 48h. Netlify affiche un message d'attente puis confirme automatiquement une fois que c'est bon, et génère un certificat HTTPS gratuit.

---

## Étape 8 — Une fois tout vérifié

Quand `julienpayetsexologie.com` affiche bien le nouveau site (donne-lui 24-48h), tu peux résilier l'abonnement **Wix Premium / hébergement** — en gardant uniquement l'**enregistrement du nom de domaine**, qui lui continue d'être facturé séparément (en général quelques euros par an), ce qui est normal et inévitable où que soit ton domaine.

---

## Si tu bloques

Reviens me décrire l'écran ou le message d'erreur exact (une capture d'écran si possible) — je peux t'aider à débloquer chaque étape.
