import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBlKoP6-M8tdrKq88bSdnWSnak5Gpddnpk",
    authDomain: "neoservice-ks-ua.firebaseapp.com",
    projectId: "neoservice-ks-ua",
    storageBucket: "neoservice-ks-ua.firebasestorage.app",
    messagingSenderId: "528941827813",
    appId: "1:528941827813:web:354ef989d200087634b60c"
};

// Ініціалізація додатку та Firestore
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

let currentUser = null;

// Відстеження стану авторизації
onAuthStateChanged(auth, (user) => {
    currentUser = user;
    const badge = document.getElementById('authStatusBadge');
    const adminPanoramaBtn = document.getElementById('adminPanoramaBtn');

    if (badge) {
        if (user) {
            badge.textContent = `👤 ${user.email.split('@')[0]}`;
            badge.className = "text-[10px] px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold";

            if (user.email === 'kostopilservice@gmail.com') {
                if (adminPanoramaBtn) adminPanoramaBtn.style.display = 'flex';
            } else {
                if (adminPanoramaBtn) adminPanoramaBtn.style.display = 'none';
            }
        } else {
            badge.textContent = "Гість";
            badge.className = "text-[10px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-slate-400";
            if (adminPanoramaBtn) adminPanoramaBtn.style.display = 'none';
        }
    }
});

// Глобальні функції для роботи з Firestore на всіх сторінках
window.getCurrentUser = () => currentUser || auth.currentUser;

// Збереження або оновлення документа в Firestore
window.saveToFirestore = async (collectionName, docId, data) => {
    try {
        const docRef = doc(db, collectionName, docId);
        await setDoc(docRef, data, { merge: true });
        console.log(`Дані успішно збережено в Firestore [${collectionName}/${docId}]`);
    } catch (e) {
        console.error("Помилка збереження в Firestore:", e);
        alert("Помилка збереження даних у хмару: " + e.message);
    }
};

// Передплата на зміни в реальному часі (Real-time listener)
window.listenToFirestoreDoc = (collectionName, docId, callback) => {
    const docRef = doc(db, collectionName, docId);
    return onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            callback(docSnap.data());
        } else {
            callback(null);
        }
    });
};