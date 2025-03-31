import React from "react";

const ThrottlingPopup = ({ isVisible, onClose }) => {
  if (!isVisible) return null; // Don't render if not visible

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-red-600 text-white p-6 rounded-lg text-center shadow-lg w-96">
        <h2 className="text-2xl font-bold">⚠️ Thermal Throttling Detected!</h2>
        <p className="mt-2">Your CPU is throttling due to high temperatures.</p>
        <button
          className="mt-4 px-4 py-2 bg-white text-red-600 font-semibold rounded-lg"
          onClick={onClose}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default ThrottlingPopup;
