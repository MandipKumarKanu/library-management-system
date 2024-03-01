import React from "react";
import "./Dialog.css";

const Dialog = ({ isOpen, onClose, onSubmit, title, children }) => {
  return (
    <div className={`dialog ${isOpen ? "open" : ""}`}>
      <div className="dialog-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>{title}</h2>
        {children}
        <button onClick={onSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default Dialog;
