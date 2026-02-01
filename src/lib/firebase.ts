import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBikAs7almSN13Y2FmJc2RNxf_z79ARQzQ",
    authDomain: "lacordaire-hosting-hub.firebaseapp.com",
    projectId: "lacordaire-hosting-hub",
    storageBucket: "lacordaire-hosting-hub.firebasestorage.app",
    messagingSenderId: "308822494586",
    appId: "1:308822494586:web:a5c384f4c433a637e91ac3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };
