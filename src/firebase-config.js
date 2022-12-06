// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCCaHMG6lf399cH2IitwC8rwLmi1a0BocY",
    authDomain: "contactapp-e6f98.firebaseapp.com",
    projectId: "contactapp-e6f98",
    storageBucket: "contactapp-e6f98.appspot.com",
    messagingSenderId: "698681540294",
    appId: "1:698681540294:web:68175c7be4f86ce63321c7"
  };
  
// Initialize Firebase
    const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
    export const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
    export const auth = getAuth(app)

