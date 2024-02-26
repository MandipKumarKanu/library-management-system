import React, { useState, useEffect } from "react";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../../../helper/firebaseConfig";

function Getdata() {
  const userId = localStorage.getItem("uid");
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userBookCollection = collection(db, "pending_approve"); // Corrected collection name
        const userBookDoc = doc(userBookCollection, userId);

        const userBookData = await getDoc(userBookDoc);

        setUserData(userBookData.data()); // Access data property of the snapshot
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  useEffect(() => {
    // Log userData after it has been updated
    console.log(userData);
  }, [userData]);

  return <div></div>;
}

export default Getdata;
