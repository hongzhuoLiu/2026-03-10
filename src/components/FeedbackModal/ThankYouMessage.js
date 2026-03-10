import React from 'react';
import checkmarkIcon from '../../images/icons/checkmark.png';

const ThankYouMessage = ({ onClose }) => (
  <div
    onClick={onClose}
    className="relative w-full h-full flex flex-col items-center justify-center text-center text-gray-800 dark:text-white cursor-pointer px-6 py-8"
  >
    {/* Close button
    <button
      onClick={(e) => {
        e.stopPropagation(); // Prevent the click event from bubbling up to the parent div
        onClose();
      }}
      className="absolute top-2 right-2 text-gray-600 dark:text-white hover:text-gray-800 dark:hover:text-gray-400 text-2xl focus:outline-none"
    >
      &times;
    </button> */}

    <h2 className="text-2xl font-semibold mb-4">
      Thank you for your feedback.
    </h2>
    <p className="text-lg mb-6">Your feedback is greatly appreciated!</p>
    <img src={checkmarkIcon} alt="Checkmark" className="w-22 h-22 mt-4" />
  </div>
);

export default ThankYouMessage;
