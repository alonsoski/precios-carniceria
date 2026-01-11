import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCEUPi6oNVa3zq6fq4wZJbtQVIF7TMAuKM",
  authDomain: "preciosapp-99dda.firebaseapp.com",
  databaseURL: "https://preciosapp-99dda-default-rtdb.firebaseio.com",
  projectId: "preciosapp-99dda",
  storageBucket: "preciosapp-99dda.firebasestorage.app",
  messagingSenderId: "744389274370",
  appId: "1:744389274370:web:e3671ed84641c2f43c701b"
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
