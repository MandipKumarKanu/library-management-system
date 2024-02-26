import React from "react";
import "./ConfirmationModal.css"; 

const ConfirmationModal = ({ isOpen, onCancel, onConfirm }) => {
  return (
    <div className={`confirmation-modal ${isOpen ? "open" : ""}`}>
      <div className="modal-content">
        <p>Are you sure you want to add this book?</p>
        <button onClick={onCancel}>Cancel</button>
        <button onClick={onConfirm}>Confirm</button>
      </div>
    </div>
  );
};

export default ConfirmationModal;
