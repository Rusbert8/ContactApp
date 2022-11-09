// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCqbpTw8S0LNeYYuCaom9HzkFwySg3OmRY",
  authDomain: "contactapp---react.firebaseapp.com",
  projectId: "contactapp---react",
  storageBucket: "contactapp---react.appspot.com",
  messagingSenderId: "857473392000",
  appId: "1:857473392000:web:79603871bfb8a945197565"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

