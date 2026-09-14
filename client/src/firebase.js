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
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const hasFirebaseConfig = [
  firebaseConfig.apiKey,
  firebaseConfig.authDomain,
  firebaseConfig.projectId,
  firebaseConfig.appId
].every(Boolean);

if (!hasFirebaseConfig) {
  console.warn('Firebase configuration is missing; authentication is disabled.');
}

// Keep the public app usable when optional Firebase deployment variables are absent.
const app = hasFirebaseConfig ? initializeApp(firebaseConfig) : null;

// Analytics is optional and fails silently in environments that don't support it.
let analytics = null;
try {
  if (!app) throw new Error('Firebase is not configured.');
  analytics = getAnalytics(app);
} catch (err) {
  if (hasFirebaseConfig) {
    console.warn('Firebase Analytics unavailable:', err && err.message);
  }
}

// Authentication
const auth = app ? getAuth(app) : null;

const subscribeToAuth = auth
  ? onAuthStateChanged
  : (_auth, callback) => {
      callback(null);
      return () => {};
    };

const signOutUser = auth
  ? signOut
  : async () => {};

export {
  app,
  auth,
  analytics,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOutUser as signOut,
  subscribeToAuth as onAuthStateChanged,
  updateProfile
};