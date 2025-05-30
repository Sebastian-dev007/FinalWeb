import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIRESTORE_API_KEY,
  authDomain: process.env.FIRESTORE_AUTH_DOMAIN,
  projectId: process.env.FIRESTORE_PROJECT_ID,
  storageBucket: process.env.FIRESTORE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIRESTORE_MESSAGIN_SENDER_ID,
  appId: process.env.FIRESTORE_APP_ID,
};


const app = getApps().find(app => app.name === 'mainApp') 
  || initializeApp(firebaseConfig, 'mainApp');

const db = getFirestore(app);

export { app, db };