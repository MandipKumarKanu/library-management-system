import { useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";
import { app } from "../helper/firebaseConfig";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { db } from "../helper/firebaseConfig";
import { useNavigate } from "react-router-dom";

const auth = getAuth(app);

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);

      const userId = response.user.uid;
      localStorage.setItem("uid", userId);

      const usersDocRef = doc(collection(db, "users"), userId);
      const usersDoc = await getDoc(usersDocRef);
      console.log(usersDoc.data());

      if (usersDoc.exists()) {
        const userDetails = usersDoc.data();
        localStorage.setItem("userD", JSON.stringify(userDetails));
        // console.log(userDetails2)
        alert("Login successful!");
        navigate("/");
      } else {
        throw new Error();
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    error,
    loading,
    currentUser,
  };
};
