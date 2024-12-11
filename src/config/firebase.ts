// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDKKQE1p7GqTxghO66NorzcNswevJF8j70",
  authDomain: "react-social-94663.firebaseapp.com",
  projectId: "react-social-94663",
  storageBucket: "react-social-94663.firebasestorage.app",
  messagingSenderId: "949338064256",
  appId: "1:949338064256:web:fa27ebb1d62671a0582d65",
  measurementId: "G-ZB4YEFYHZM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);