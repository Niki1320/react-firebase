// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';   //sets up  authentication in project
import {  getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBp8JESlptlU28-N3vzeCLnkYt9yllmk-M",
  authDomain: "fir-practise-64c08.firebaseapp.com",
  projectId: "fir-practise-64c08",
  storageBucket: "fir-practise-64c08.appspot.com",
  messagingSenderId: "11355613779",
  appId: "1:11355613779:web:0dca293d4c66f2d4b434a6",
  measurementId: "G-T1R4YHBXSW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db=getFirestore(app);
export const storage=getStorage(app);