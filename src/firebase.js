import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBLYBR2HD8uYaRB6BXMBEjivd01b2aZLHs",
    authDomain: "binguardian-78d01.firebaseapp.com",
    projectId: "binguardian-78d01",
    storageBucket: "binguardian-78d01.appspot.com",
    messagingSenderId: "72895769733",
    appId: "1:72895769733:web:b7549202b4184e9cfdcdec"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };