// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCe2Z86TkJe-HmXCvign6OpmCV5hxDy-CQ",
  authDomain: "behavior-monitor-d6db9.firebaseapp.com",
  projectId: "behavior-monitor-d6db9",
  storageBucket: "behavior-monitor-d6db9.firebasestorage.app",
  messagingSenderId: "85009520298",
  appId: "1:85009520298:web:b3b323170451d8bcbf62d3",
  measurementId: "G-WR62GLEDW9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const analytics = getAnalytics(app);