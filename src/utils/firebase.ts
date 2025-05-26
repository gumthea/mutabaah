// utils/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDlOub_SxM0lqXBme-GqyJh0-tMIqU4ueE",
  authDomain: "backend-repo-5f2b7.firebaseapp.com",
  projectId: "backend-repo-5f2b7",
  storageBucket: "backend-repo-5f2b7.firebasestorage.app",
  messagingSenderId: "152711606818",
  appId: "1:152711606818:web:30022e32e9e5b95a3ad07b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
