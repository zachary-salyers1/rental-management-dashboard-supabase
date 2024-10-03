Firebase Settings:

#Project Overview: 
-Firebase will be used to store the property data and guest data. A firebase project has been set up with authentication, firebase database and storage. 
-The application must have authentication for each user, and within each user, they will have their own data. 
-The database must be able to store notes for each property and each guest. 



// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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