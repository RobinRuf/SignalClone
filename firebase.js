import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCm2D28_9GkN_EdbI6paBBu7CPpK-xf-xI",
  authDomain: "destiny-4e479.firebaseapp.com",
  projectId: "destiny-4e479",
  storageBucket: "destiny-4e479.appspot.com",
  messagingSenderId: "522621483156",
  appId: "1:522621483156:web:4100cdb2b6885b2b841c81"
};

let app;

if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();

export { db, auth };