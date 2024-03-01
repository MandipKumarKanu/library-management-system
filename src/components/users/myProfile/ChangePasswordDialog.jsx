import React, { useState } from "react";
import "./ChangePasswordDialog.css"; // Import your stylesheet
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { auth } from "../../../helper/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

function ChangePasswordDialog({ isOpen, onClose }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, newPassword);
      setNewPassword("");
      setConfirmPassword("");
      setCurrentPassword("");
      setPasswordError(null);
      onClose();
      alert("Password changed successfully!");
    } catch (error) {
      console.error("Error changing password:", error);
      setPasswordError("Error changing password. Please check your current password and try again.");
    }
  };

  return (
    <div className={`dialog-overlay ${isOpen ? "open" : ""}`}>
      <div className="dialog">
        <span className="close-btn" onClick={onClose}>
          &times;
        </span>
        <h2>Change Password</h2>
        <label>Current Password:</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
        <label>New Password:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <label>Confirm Password:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {passwordError && <p className="password-error">{passwordError}</p>}
        <button onClick={handlePasswordChange}>Change Password</button>
      </div>
    </div>
  );
}

export default ChangePasswordDialog;
