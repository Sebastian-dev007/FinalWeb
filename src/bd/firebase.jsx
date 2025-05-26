import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDr2vbQqv3EihDZ4B8HtUssqqtOzJdOZHs",
  authDomain: "projectsdb-be3b9.firebaseapp.com",
  projectId: "projectsdb-be3b9",
  storageBucket: "projectsdb-be3b9.firebasestorage.app",
  messagingSenderId: "297281909642",
  appId: "1:297281909642:web:9a9102b7750082a46f0e73"
};


const app = getApps().find(app => app.name === 'mainApp') 
  || initializeApp(firebaseConfig, 'mainApp');

const db = getFirestore(app);

export { app, db };