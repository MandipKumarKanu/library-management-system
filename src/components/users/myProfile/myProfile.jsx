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
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [imageSelected, setImageSelected] = useState(false);

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
    setImageSelected(true);
    setProfileImage(file);
  };

  const handleImageUpdate = async () => {
    try {
      if (profileImage) {
        setLoadingUpdate(true);

        const storageRef = ref(storage, `profile_images/${userId}`);
        await uploadBytes(storageRef, profileImage);

        const downloadURL = await getDownloadURL(storageRef);

        const userDocRef = doc(db, "users", userId);
        await updateDoc(userDocRef, { profileImg: downloadURL });

        setUserProfile((prevProfile) => ({
          ...prevProfile,
          profileImg: downloadURL,
        }));

        localStorage.setItem("profileImg", downloadURL)
      }
      setImageSelected(false);
    } catch (error) {
      console.error("Error updating profile image:", error);
    } finally {
      setLoadingUpdate(false);
    }
  };

  return (
    <div className="my-profile-container">
      {loading ? (
        "loading"
      ) : (
        <>
          {userProfile && (
            <>
              <h2>My Profile</h2>
              <div className="profile-container">
                <div className="lp">
                  <div className="lp-img">
                    <img
                      src={
                        imageSelected && profileImage instanceof Blob
                          ? URL.createObjectURL(profileImage)
                          : userProfile.profileImg || "/images/user.webp"
                      }
                      alt="Profile"
                      className="profile-image"
                    />

                    <input
                      type="file"
                      onChange={handleImageChange}
                      accept="image/*"
                      id="file-input"
                      name="file-input"
                    />

                    <label id="file-input-label" htmlFor="file-input">
                      {imageSelected ? (
                        <button onClick={handleImageUpdate}>
                          <span>
                            {loadingUpdate
                              ? "Updating..."
                              : "Update Profile Image"}
                          </span>
                        </button>
                      ) : (
                        "Select a Profile Picture"
                      )}
                    </label>
                  </div>
                </div>

                <div className="rp">
                  <p>
                    <strong>Name:</strong> {userProfile.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {userProfile.email}
                  </p>
                  <p>
                    <strong>Profile Image:</strong>
                  </p>

                  <button onClick={openChangePasswordDialog}>
                    Change Password
                  </button>
                </div>
              </div>
            </>
          )}

          <ChangePasswordDialog
            isOpen={isDialogOpen}
            onClose={closeChangePasswordDialog}
          />
        </>
      )}
    </div>
  );
}

export default MyProfile;
