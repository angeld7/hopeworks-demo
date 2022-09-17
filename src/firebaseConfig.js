import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZJ--bVVyTP2tIShQq3pfqBZ_Wfeu25qc",
  authDomain: "hopeworks-demo.firebaseapp.com",
  projectId: "hopeworks-demo",
  storageBucket: "hopeworks-demo.appspot.com",
  messagingSenderId: "524960197048",
  appId: "1:524960197048:web:69d44459660534a403074d"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
