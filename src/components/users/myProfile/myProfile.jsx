import React, { useState, useEffect } from "react";
import { db, storage } from "../../../helper/firebaseConfig";
import "./myProfile.css";
import ChangePasswordDialog from "./ChangePasswordDialog";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function MyProfile() {
  const userId = localStorage.getItem("uid");
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userDocRef = doc(db, "users", userId);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          setUserProfile(userDocSnapshot.data());
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const openChangePasswordDialog = () => {
    setIsDialogOpen(true);
  };

  const closeChangePasswordDialog = () => {
    setIsDialogOpen(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
  };

  const handleImageUpload = async () => {
    try {
      if (profileImage) {
        const storageRef = ref(storage, `profile_images/${userId}`);
        await uploadBytes(storageRef, profileImage);

        const downloadURL = await getDownloadURL(storageRef);

        const userDocRef = doc(db, "users", userId);
        await updateDoc(userDocRef, { profileImg: downloadURL });

        setUserProfile((prevProfile) => ({
          ...prevProfile,
          profileImg: downloadURL,
        }));
      }
    } catch (error) {
      console.error("Error uploading profile image:", error);
    }
  };

  return (
    <div className="my-profile-container">
      <h2>My Profile</h2>
      {userProfile && (
        <div>
          <p>
            <strong>Name:</strong> {userProfile.name}
          </p>
          <p>
            <strong>Email:</strong> {userProfile.email}
          </p>
          <p>
            <strong>Profile Image:</strong>{" "}
            {userProfile.profileImg ? (
              <img src={userProfile.profileImg} alt="Profile" />
            ) : (
              "No image"
            )}
          </p>

          {!userProfile.profileImg && (
            <>
              <input type="file" onChange={handleImageChange} accept="image/*" />
              <button onClick={handleImageUpload}>Upload Profile Image</button>
            </>
          )}

          <button onClick={openChangePasswordDialog}>Change Password</button>
        </div>
      )}

      <ChangePasswordDialog
        isOpen={isDialogOpen}
        onClose={closeChangePasswordDialog}
      />
    </div>
  );
}

export default MyProfile;
