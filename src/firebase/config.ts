// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "progetto-saw-5f45b.firebaseapp.com",
  projectId: "progetto-saw-5f45b",
  storageBucket: "progetto-saw-5f45b.firebasestorage.app",
  messagingSenderId: "240634341099",
  appId: "1:240634341099:web:be1b848ed2becf1c7040ae",
  measurementId: "G-6Y8B794GMZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === "failed-precondition") {
    console.warn("Persistenza non attiva: troppe schede aperte.");
  } else if (err.code === "unimplemented") {
    console.warn("Il browser non supporta la persistenza offline.");
  }
});

export {app, analytics, auth, db};