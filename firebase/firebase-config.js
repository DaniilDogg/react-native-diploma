// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB0zILVpLhdqJJx0r0kn4qxxeFWeq4UkBM",
  authDomain: "react-native-diploma.firebaseapp.com",
  projectId: "react-native-diploma",
  storageBucket: "react-native-diploma.appspot.com",
  messagingSenderId: "544493558756",
  appId: "1:544493558756:web:147b28fd19a6e11ed6c5f1",
  measurementId: "G-EEXEK44SHN"
};

// Initialize FireBaseApp
const app = initializeApp(firebaseConfig);
//Auth
export const auth = getAuth(app)
//Firestore
export const firestore = getFirestore(app)
//FirebaseStorage
export const storage = getStorage(app)