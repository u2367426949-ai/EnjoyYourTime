# EnjoyYourTime — Guide de mise en ligne (Solution 2)

## Structure du projet
```
cleaning-website/
├── index.html          ← Site principal
├── netlify.toml        ← Configuration Netlify
├── css/style.css
├── js/main.js
├── images/             ← Mettre les photos ici
│   └── uploads/        ← Photos ajoutées via le CMS
├── data/               ← Contenu modifiable par le CMS
└── admin/
    ├── index.html      ← Panneau d'administration
    └── config.yml      ← Configuration du CMS
```

---

## Étape 1 — Créer les comptes gratuits

1. **GitHub** → https://github.com (stocker le code)
2. **Netlify** → https://netlify.com (héberger le site)
3. **Formspree** → https://formspree.io (recevoir les emails du formulaire)

---

## Étape 2 — Mettre le code sur GitHub

1. Créer un nouveau dépôt GitHub (ex: `enjoyyourtime-site`)
2. Uploader tous les fichiers du dossier `cleaning-website/`
3. Valider (commit)

---

## Étape 3 — Connecter Netlify

1. Sur Netlify → "Add new site" → "Import an existing project"
2. Choisir GitHub → sélectionner le dépôt `enjoyyourtime-site`
3. Laisser les paramètres par défaut → "Deploy site"
4. Le site est en ligne ! Netlify donne une URL du type `enjoyyourtime.netlify.app`

---

## Étape 4 — Connecter le formulaire (Formspree)

1. Sur formspree.io → "New form" → donner un nom (ex: "Contact EnjoyYourTime")
2. Copier l'ID fourni (ex: `xabcdefg`)
3. Dans `index.html`, remplacer `VOTRE_ID_FORMSPREE` par cet ID :
   ```html
   action="https://formspree.io/f/xabcdefg"
   ```
4. Dans les paramètres Formspree → ajouter l'email de réception

---

## Étape 5 — Activer le panneau d'administration

1. Sur Netlify → "Site configuration" → "Identity" → "Enable Identity"
2. Toujours dans Identity → "Git Gateway" → "Enable Git Gateway"
3. Inviter le client : "Invite users" → entrer son email
4. Le client reçoit un email, crée son mot de passe
5. L'admin est accessible sur : `https://votre-site.netlify.app/admin`

---

## Étape 6 — Nom de domaine (optionnel)

1. Acheter `enjoyyourtime.fr` sur OVH (~15€/an)
2. Sur Netlify → "Domain management" → "Add custom domain"
3. Suivre les instructions pour modifier les DNS chez OVH
4. Le HTTPS est automatique (Let's Encrypt)

---

## Emails professionnels

Recommandation : **Zoho Mail** (gratuit jusqu'à 5 comptes)
- enjoyyourtime76@gmail.com
- devis@enjoyyourtime.fr

Inscription : https://www.zoho.com/mail/
