// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";

// Your web app's Firebase configuration.
// For Firebase JS SDK v7.20.0 and later, measurementId is optional.
// These values are also overridable per-environment via Vite env vars
// (VITE_FIREBASE_*) so staging/production builds can use their own project.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA70YdiZ4AD399CjnhdUfXjeBe2wlzGcvI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "debugique.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "debugique",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "debugique.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "467588002534",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:467588002534:web:810ba85e082ad7db404127",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-8BHC3Y695K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Analytics is optional and fails silently in environments that don't support it.
let analytics = null;
try {
  analytics = getAnalytics(app);
} catch (err) {
  console.warn("Firebase Analytics unavailable:", err && err.message);
}

// Authentication
const auth = getAuth(app);

export {
  app,
  auth,
  analytics,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
};