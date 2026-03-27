// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3qfjW3XI_xGCvexxJE07F9K2n7vUA2z8",
  authDomain: "chamados-app-ec833.firebaseapp.com",
  projectId: "chamados-app-ec833",
  storageBucket: "chamados-app-ec833.firebasestorage.app",
  messagingSenderId: "581122538124",
  appId: "1:581122538124:web:14331fd49a8ae361e8d9a9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
    
export { db };