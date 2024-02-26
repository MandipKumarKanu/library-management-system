import React from "react";
import "./dialog.css";

function ConfirmationDialog({ isOpen, onCancel, onConfirm, message }) {
  return (
    <div className="backdrop" style={{ display: isOpen ? "flex" : "none" }}>
      <dialog className="updateDialog" open={isOpen}>
        <p>
          Are you sure you want to {message}{" "}
          this?
        </p>{" "}
        <button onClick={onCancel}>Cancel</button>
        <button onClick={onConfirm}>Confirm</button>
      </dialog>
    </div>
  );
}

export default ConfirmationDialog;