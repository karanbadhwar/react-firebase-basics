import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCO1iOb5wCTWKUATF75NGS3efio82siGsY",
  authDomain: "fir-basics-react-41fd3.firebaseapp.com",
  projectId: "fir-basics-react-41fd3",
  storageBucket: "fir-basics-react-41fd3.appspot.com",
  messagingSenderId: "361482643161",
  appId: "1:361482643161:web:695ddb9400b31d3feac0c8",
  measurementId: "G-FTW5PJ8QP6",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);
export const storage = getStorage(app);
