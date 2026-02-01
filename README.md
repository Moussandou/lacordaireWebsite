# Lacordaire Hosting Hub

Une plateforme centralisée pour héberger et prévisualiser les sites web des élèves. Construit avec Vite, React, TailwindCSS et Firebase.

## 🚀 Pour Commencer

Si vous venez de récupérer le projet, installez d'abord les dépendances.

### 1. Installation
Exécutez cette commande dans votre terminal :
```bash
sh setup.sh
```
Ou manuellement :
```bash
npm install
npm run dev
```

### 2. Déploiement
Pour mettre en ligne le Hub :
```bash
npm run build
firebase deploy
```

## 🛠 Structure du Projet

- **`/src/pages`** : Les pages principales (`Home.tsx`, `Submit.tsx`).
- **`/src/components`** : Composants réutilisables (`ProjectCard.tsx`, `Layout.tsx`).
- **`/src/lib`** : Configuration Firebase (Firestore + Storage).
- **`/public/students`** : (Action Manuelle) Déposez les dossiers des élèves ici pour les héberger définitivement.

## 🔥 Fonctionnalités Firebase
Ce projet utilise :
- **Firestore** : Pour stocker les détails du projet (Nom, Titre, Description).
- **Storage** : Pour recevoir les fichiers `.html` des élèves via le formulaire.
- **Hosting** : Pour servir le Hub et les sites "validés".

> **Note** : Le formulaire d'envoi dépose le fichier HTML dans le **Storage**. L'enseignant doit ensuite récupérer ce fichier et le placer dans le dossier `public/students/` avant de redéployer pour que le site soit visible publiquement.
