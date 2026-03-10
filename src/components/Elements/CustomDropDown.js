import { useState } from "react";

function CustomDropdown({ availableFields, loadingFields, handleAddInterest, userInterests }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedInterest, setSelectedInterest] = useState("Select an interest");
  
    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };
  
    const handleSelectInterest = (fieldId, fieldName) => {
      handleAddInterest({ id: fieldId, programFieldName: fieldName });
      setSelectedInterest(fieldName || "Select an interest");
      setIsOpen(false);
    };
  
    return (
      <div className="relative inline-block w-[95%] sm:w-1/3 mx-auto">
        <h3 className="editTextStyling">Add an Interest</h3>
          <button
              onClick={toggleDropdown}
              className="text-white bg-rose-900 hover:bg-rose-950 focus:ring-4 focus:outline-none focus:ring-blue-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex justify-between items-center w-full transition duration-300"
              type="button"
              disabled={userInterests.length >= 8}
          >
          {selectedInterest}
          <svg
            className="w-2.5 h-2.5 ms-3 ml-auto"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 4 4 4-4"
            />
          </svg>
        </button>
  
        {/* Dropdown menu */}
        {isOpen && (
          <div 
              className="absolute z-20 bg-white divide-y divide-gray-100 rounded-lg shadow w-full dark:bg-gray-700 mt-2" 
              style={{ top: '100%' }}
          >
              <ul
              className="py-2 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdownInterestButton"
              >
              {!loadingFields && availableFields.length > 0 ? (
                  availableFields.map((field) => (
                  <li key={field.id}>
                      <button
                      onClick={() => handleSelectInterest(field.id, field.attributes.subjectFieldName)}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                      {field.attributes.subjectFieldName}
                      </button>
                  </li>
                  ))
              ) : (
                  <li>
                  <button
                      onClick={() => handleSelectInterest("")}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                      No interests available
                  </button>
                  </li>
              )}
              </ul>
          </div>
          )}
      </div>
    );
  }

export default CustomDropdown;