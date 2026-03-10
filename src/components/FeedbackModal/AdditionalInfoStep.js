import React from 'react';

const AdditionalInfoStep = ({ additionalInfo, onAdditionalInfoChange }) => (
  <>
    <h2 className="text-lg font-semibold mt-4 mb-2 text-gray-800 dark:text-white">
      What other kind of information would you like to see on Students Choice?
    </h2>
    <textarea
      className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
      value={additionalInfo}
      onChange={(e) => onAdditionalInfoChange(e.target.value)}
      placeholder="Your suggestions..."
    />
  </>
);

export default AdditionalInfoStep;
