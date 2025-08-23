import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC80BInIvowJwlsNKzhmgjaiuas5-yatKA",
  authDomain: "hackgenesis-204a6.firebaseapp.com",
  projectId: "hackgenesis-204a6",
  storageBucket: "hackgenesis-204a6.firebasestorage.app",
  messagingSenderId: "949189003537",
  appId: "1:949189003537:web:53ef3c0a465297f7e4a4b0",
  measurementId: "G-E7MKPP68B5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
