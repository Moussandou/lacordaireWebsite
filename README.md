# Lacordaire Hosting Hub

Une plateforme centralisée pour héberger et prévisualiser les sites web des élèves.

## 🚀 Fonctionnement Automatisé

Ce Hub est conçu pour être géré avec un minimum d'effort ("Zéro manual download").

### 1. Installation & Lancement
```bash
sh setup.sh
```

### 2. Flux de Travail
1.  **Les élèves envoient** leurs fichiers `.html` via la page **Soumettre**.
2.  **L'enseignant déploie** simplement le projet :
    ```bash
    npm run build
    firebase deploy
    ```
    *Note : La commande `build` récupère automatiquement tous les derniers fichiers envoyés par les élèves sur Firestore/Storage et les prépare pour l'hébergement.*

## 🛠 Structure & Automation

- **`scripts/sync-students.js`** : Script magique qui télécharge les projets du Storage vers `public/students/`.
- **`.github/workflows/deploy.yml`** : Déploiement automatique vers Firebase Hosting à chaque push sur `main` (si GitHub Secrets configurés).
- **`/src`** : Code React (Vite + Tailwind).

## 🔒 Configuration Sécurisée

Les clés API sont stockées dans le fichier **`.env`** (non suivi par Git).
Pour le déploiement automatique sur GitHub, assurez-vous de configurer les **GitHub Secrets** (voir le fichier `github_secrets.md` dans vos notes).

---
© 2026 Lacordaire Hosting
