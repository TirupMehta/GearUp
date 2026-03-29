import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyASLfNv5nGmeCNXqG6Gqkxw5JrP6V9TxlA",
  authDomain: "shopgeniedb.firebaseapp.com",
  projectId: "shopgeniedb",
  storageBucket: "shopgeniedb.firebasestorage.app",
  messagingSenderId: "148425560845",
  appId: "1:148425560845:web:9c66e868a492dc05039644"
};

// Initialize only once (prevents "already initialized" error in StrictMode)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const auth = getAuth(app);
