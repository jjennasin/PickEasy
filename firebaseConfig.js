// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBAcHodjnoT0F1lGDk2ht57T-CcLYFEVhM",
  authDomain: "pick-easy-c46ba.firebaseapp.com",
  projectId: "pick-easy-c46ba",
  storageBucket: "pick-easy-c46ba.firebasestorage.app",
  messagingSenderId: "553003948498",
  appId: "1:553003948498:web:56508a391930e27641900b",
  measurementId: "G-CKCVCFC4Z5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);