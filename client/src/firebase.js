import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCs3Hmpmf7bU1fU2p9Ze-5x94eNYd9YwF0",
  authDomain: "pawmilly-2025.firebaseapp.com",
  projectId: "pawmilly-2025",
  storageBucket: "pawmilly-2025.firebasestorage.app",
  messagingSenderId: "73867654797",
  appId: "1:73867654797:web:0c7dd700beeb39afbd54c4",
  measurementId: "G-2XKJLSLDNN"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 