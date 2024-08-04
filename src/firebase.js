// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBmAWQZlTSfn6-nRgH1_2ILJM6doFuVKPg",
    authDomain: "vin-scanner-3c3ec.firebaseapp.com",
    databaseURL: "https://vin-scanner-3c3ec.firebaseio.com",
    projectId: "vin-scanner-3c3ec",
    storageBucket: "vin-scanner-3c3ec.appspot.com",
    messagingSenderId: "23382058222",
    appId: "1:233820582222:web:17bc69c9c5df58ddfcae1f"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
