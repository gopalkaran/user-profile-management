// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCkXjBCDEoLB3fq1DgrJ08anLwDdM5eLjg",
  authDomain: "user-profile-webapp.firebaseapp.com",
  projectId: "user-profile-webapp",
  storageBucket: "user-profile-webapp.appspot.com",
  messagingSenderId: "946160176476",
  appId: "1:946160176476:web:797ca3c21ad60fa3074599"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// export default db;
export default app;