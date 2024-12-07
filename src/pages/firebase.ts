// firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const { VITE_API_KEY,VITE_PROJECT_ID,VITE_MESSAGING_SENDER_ID,VITE_APP_ID } = import.meta.env;

const firebaseConfig = {
  apiKey:VITE_API_KEY ,
  projectId: VITE_PROJECT_ID,
  messagingSenderId: VITE_MESSAGING_SENDER_ID,
  appId: VITE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
