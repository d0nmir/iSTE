import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {
  doc,
  onSnapshot,
  addDoc,
  collection,
  query,
  updateDoc,
  deleteDoc,
  getFirestore,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA3X2iRimFPdG8V7-Yx_IMZp_6vJCnVBKA",
  authDomain: "qyl-ec04b.firebaseapp.com",
  projectId: "qyl-ec04b",
  storageBucket: "qyl-ec04b.firebasestorage.app",
  messagingSenderId: "1067095140753",
  appId: "1:1067095140753:web:3df6b98c6d63220f2fd230",
  measurementId: "G-DE6L53Y2SL"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);
export { doc, onSnapshot, addDoc, collection, query, updateDoc, deleteDoc };
