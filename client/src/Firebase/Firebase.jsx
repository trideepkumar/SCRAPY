// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
 
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ,
  authDomain: "realestate-eb399.firebaseapp.com",
  projectId: "realestate-eb399",
  storageBucket: "realestate-eb399.appspot.com",
  messagingSenderId: "302670226647",
  appId: "1:302670226647:web:91e59eb4b8af1636527c92",
  measurementId: "G-7VQTKXBBW1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);