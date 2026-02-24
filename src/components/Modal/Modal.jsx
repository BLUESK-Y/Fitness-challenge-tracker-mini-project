import React from "react";
import "./modal.css";

const Modal = ({ isOpen, onClose, children }) => {
  // If modal is closed, render nothing
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-box"
        onClick={(e) => e.stopPropagation()} // prevents closing when clicking inside
      >
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        {children}
      </div>
    </div>
  );
};

export default Modal;