  import { initializeApp } from "firebase/app";
  import { getStorage } from "firebase/storage";
  import { getFirestore, collection, addDoc } from "firebase/firestore";
  import {getAuth, deleteUser, signOut} from "firebase/auth"


  const firebaseConfig = {
    apiKey: "AIzaSyAjvXB7t8OWhI1-UQMh7ypXI6Mg0vti5T8",
    authDomain: "librarymanagementsys-2afac.firebaseapp.com",
    projectId: "librarymanagementsys-2afac",
    storageBucket: "librarymanagementsys-2afac.appspot.com",
    messagingSenderId: "508117991570",
    appId: "1:508117991570:web:9ca721f9747bbe2a6c664b",
    measurementId: "G-VJ1JKCPHYH",
  };

  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app)
  const db = getFirestore(app);
  const auth = getAuth(app)

  export {app, storage, db, auth, deleteUser, signOut }