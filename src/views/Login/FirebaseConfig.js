// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyB0eZF_-LsEuCeLaEmTF4BGf0JOnTinGXk",
//   authDomain: "web-proyect-c3a92.firebaseapp.com",
//   projectId: "web-proyect-c3a92",
//   storageBucket: "web-proyect-c3a92.firebasestorage.app",
//   messagingSenderId: "61395359320",
//   appId: "1:61395359320:web:452257cbfa33b771335c2d"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export default app;

// src/firebase/authApp.js → Para login con Google
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider, FacebookAuthProvider } from 'firebase/auth';





const firebaseAuthConfig = {
  apiKey: "AIzaSyB0eZF_-LsEuCeLaEmTF4BGf0JOnTinGXk",
  authDomain: "web-proyect-c3a92.firebaseapp.com",
  projectId: "web-proyect-c3a92",
  storageBucket: "web-proyect-c3a92.firebasestorage.app",
  messagingSenderId: "61395359320",
  appId: "1:61395359320:web:452257cbfa33b771335c2d"
};

const authApp = getApps().find(app => app.name === 'authApp') 
|| initializeApp(firebaseAuthConfig, 'authApp');

const auth = getAuth(authApp);
const provider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { auth, provider, githubProvider, facebookProvider };
