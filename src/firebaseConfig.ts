import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDTbgo_oEAk0Ue1y02dEO6UWye3cv8fZe0",
  authDomain: "rental-property-manageme-4ae88.firebaseapp.com",
  projectId: "rental-property-manageme-4ae88",
  storageBucket: "rental-property-manageme-4ae88.appspot.com",
  messagingSenderId: "374540706261",
  appId: "1:374540706261:web:7d4198096a5ab2e9a15d5c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

console.log('Firebase initialized');

export default app;