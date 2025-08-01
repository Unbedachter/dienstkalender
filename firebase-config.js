// Firebase Konfiguration
const firebaseConfig = {
    apiKey: "AIzaSyC2eaRqLzeX3SSK2ZkTF3nxwhWptQ4TZ4Q",
    authDomain: "dienstkalender-ae77f.firebaseapp.com",
    projectId: "dienstkalender-ae77f",
    storageBucket: "dienstkalender-ae77f.firebasestorage.app",
    messagingSenderId: "965672799953",
    appId: "1:965672799953:web:83f55c7eb67d2ea22fbff0"
};

// Firebase initialisieren
firebase.initializeApp(firebaseConfig);

// Firestore Datenbank referenzieren
const db = firebase.firestore();

// Firebase Auth referenzieren
const auth = firebase.auth(); 