// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "fir-blog-8109f.firebaseapp.com",
  projectId: "fir-blog-8109f",
  storageBucket: "fir-blog-8109f.appspot.com",
  messagingSenderId: "889233189341",
  appId: "1:889233189341:web:9ce2024f4abd0ada6f6e34"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);