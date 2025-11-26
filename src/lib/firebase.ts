import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAW5NJpnzkSLBm8YLTIW7SOipfGxIHUPgk",
  authDomain: "studio-9442656101-dd68d.firebaseapp.com",
  projectId: "studio-9442656101-dd68d",
  storageBucket: "studio-9442656101-dd68d.appspot.com",
  messagingSenderId: "99077314924",
  appId: "1:99077314924:web:0c309e8b3f382b02ecbb49"
};

const isConfigured = firebaseConfig.apiKey && 
                      firebaseConfig.projectId && 
                      firebaseConfig.apiKey !== '' &&
                      !firebaseConfig.apiKey.includes('Dummy');

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

if (isConfigured) {
  try {
    // Only initialize on the client side
    if (typeof window !== 'undefined') {
      app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
      auth = getAuth(app);
      db = getFirestore(app);
      storage = getStorage(app);
      console.log('Firebase initialized successfully');
    }
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
} else {
  if (typeof window !== 'undefined') {
    console.warn('Firebase is not configured. Please add your Firebase credentials to your environment variables.');
  }
}

export { auth, db, storage };
export default app;
