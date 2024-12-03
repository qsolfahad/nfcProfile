// firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBRy93wMPrqo9GsRqElqgdGk20Y721EMWw",
  projectId: "nfcapp-def75",
  messagingSenderId: "928920975892",
  appId: "1:928920975892:android:b779abf7ee772778d78501",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
