// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyABOlWibygl-UWRz5FxJSHQ019ewRKJ9Yg",
  authDomain: "cestas-da-nanda.firebaseapp.com",
  projectId: "cestas-da-nanda",
  storageBucket: "cestas-da-nanda.firebasestorage.app",
  messagingSenderId: "239033989954",
  appId: "1:239033989954:web:7da455a15fba68aafca6db",
  measurementId: "G-B4QFM9B6BY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app)
export { auth, db};