import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBAcHodjnoT0F1lGDk2ht57T-CcLYFEVhM",
  authDomain: "pick-easy-c46ba.firebaseapp.com",
  projectId: "pick-easy-c46ba",
  storageBucket: "pick-easy-c46ba.firebasestorage.app",
  messagingSenderId: "553003948498",
  appId: "1:553003948498:web:56508a391930e27641900b",
  measurementId: "G-CKCVCFC4Z5",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getAnalyticsInstance() {
  if (typeof window === "undefined") {
    return null;
  }

  const [{ isSupported, getAnalytics }] = await Promise.all([
    import("firebase/analytics"),
  ]);

  const supported = await isSupported();
  if (!supported) {
    return null;
  }

  return getAnalytics(app);
}

export { app, db, getAnalyticsInstance };

