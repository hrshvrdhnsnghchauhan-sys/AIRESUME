import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA1R8vfFvbeLCyQvzgY8G0atiz-A295k1U",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "vanitra-ai-resume-3c50c.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "vanitra-ai-resume-3c50c",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "vanitra-ai-resume-3c50c.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "911683171979",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:911683171979:web:3dbfcbcbc861024f90c68e"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
