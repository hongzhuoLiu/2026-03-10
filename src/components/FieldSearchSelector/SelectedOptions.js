

import React from "react";
import { IoCloseCircleOutline } from "react-icons/io5";

export default function SelectedOptions({ selectedOptions, handleRemove }) {
  return (
    <div className="flex flex-wrap gap-2 font-bold text-md p-2">
    {selectedOptions.map((option) => (
      <div key={option} className="flex items-center text-gray-600 dark:text-white bg-transparent px-4 py-2 rounded-full border border-gray-800 dark:border-gray-300 text-md">
        <span>{option}</span>
        <button
          onClick={() => handleRemove(option)}
          className="ml-2 pt-0.5 text-black flex mt-0.5 items-center justify-center"
        >
          <IoCloseCircleOutline className="dark:text-white text-black" size={'20px'} />
        </button>
      </div>
    ))}
  </div>
  
  );
}
