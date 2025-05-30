import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: FIRESTORE_API_KEY,
  authDomain: FIRESTORE_AUTH_DOMAIN,
  projectId: FIRESTORE_PROJECT_ID,
  storageBucket: FIRESTORE_STORAGE_BUCKET,
  messagingSenderId: FIRESTORE_MESSAGIN_SENDER_ID,
  appId: FIRESTORE_APP_ID
};


const app = getApps().find(app => app.name === 'mainApp') 
  || initializeApp(firebaseConfig, 'mainApp');

const db = getFirestore(app);

export { app, db };