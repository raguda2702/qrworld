import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAe7K-_kBmrhWexR0Y-1fm2HTKJ-38xIAc",
  authDomain: "qrworld-5366f.firebaseapp.com",
  projectId: "qrworld-5366f",
  storageBucket: "qrworld-5366f.firebasestorage.app",
  messagingSenderId: "970574471078",
  appId: "1:970574471078:web:d527e6b3198eeada98f967",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export { app };
export const auth = getAuth(app);
export const db = getFirestore(app);