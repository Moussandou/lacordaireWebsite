import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// Configuration
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID
};

async function syncSubmissions() {
    console.log('🚀 Démarrage de la synchronisation des projets étudiants...');

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const studentsDir = path.join(__dirname, '../public/students');

    try {
        // Fetch projects from Firestore
        const querySnapshot = await getDocs(collection(db, 'projects'));
        const projects = querySnapshot.docs.map(doc => doc.data());

        console.log(`📦 ${projects.length} projets trouvés dans Firestore.`);

        for (const project of projects) {
            const { slug, htmlFileUrl, projectTitle } = project;

            if (!slug || !htmlFileUrl) {
                console.warn(`⚠️ Projet ignoré (manque slug ou URL) : ${projectTitle}`);
                continue;
            }

            const projectDir = path.join(studentsDir, slug);
            const indexPath = path.join(projectDir, 'index.html');

            // Create directory
            if (!fs.existsSync(projectDir)) {
                fs.mkdirSync(projectDir, { recursive: true });
            }

            console.log(`⏳ Téléchargement de "${projectTitle}" (${slug})...`);

            // Download HTML content
            const response = await fetch(htmlFileUrl);
            if (!response.ok) throw new Error(`Erreur lors du téléchargement de ${htmlFileUrl}`);

            const htmlContent = await response.text();

            // Save file
            fs.writeFileSync(indexPath, htmlContent);
            console.log(`✅ Dossier prêt : public/students/${slug}/index.html`);
        }

        console.log('\n✨ Synchronisation terminée !');
        console.log('👉 Vous pouvez maintenant lancer : npm run build && firebase deploy');

    } catch (error) {
        console.error('\n❌ Erreur lors de la synchronisation :', error.message);
        process.exit(1);
    }
}

syncSubmissions();
