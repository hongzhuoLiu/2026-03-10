import React, { useState, useRef, useEffect } from 'react';
import {ReactComponent as NavUpArrow} from '../../images/icons/NavUpArrow.svg';

/**
 * @param {Array} options - An array of objects: [{ value: "latest", label: "Latest" }, ...]
 * @param {string} selectedValue - Currently selected value (e.g., "latest")
 * @param {function} onChange - Callback to notify parent of selected value
 */
function SortingDropdown({ options, selectedValue, onChange}) {
  const [isOpen, setIsOpen] = useState(false);

  // For closing dropdown when user clicks outside
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (value) => {
    onChange(value);
    setIsOpen(false);
  };

  // Find label for the currently selected value
  const selectedLabel = options.find(opt => opt.value === selectedValue)?.label;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Toggle Button */}
      <button
        type="button"
        onClick={handleToggle}
        className={`
          relative
          inline-flex items-center
          px-4 py-2 w-40
          bg-white dark:bg-gray-700
          text-sc-red dark:text-gray-200
          font-bold
          rounded-md shadow-md
          focus:outline-none 
          focus:ring-2 focus:ring-sc-red
          transition-colors duration-300
        `}
      >
        <span className="truncate">{selectedLabel}</span>
        <span
          className={`
            absolute right-3
            transition-transform duration-200
            ${isOpen ? '' : 'rotate-180'}
          `}
        >
          <NavUpArrow className="w-3 h-3 fill-sc-red dark:fill-gray-200" />
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="
            absolute right-0 mt-2 w-40
            bg-white dark:bg-gray-700
            rounded-md shadow-lg
            ring-1 ring-black ring-opacity-5
            z-10
          "
        >
          <ul className="py-1">
            {options.map((option) => {
              const isSelected = option.value === selectedValue;
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`
                      flex justify-between items-center w-full text-left px-4 py-2
                      text-rose-900 dark:text-gray-200
                      hover:bg-rose-100 dark:hover:bg-gray-600
                      focus:outline-none focus:bg-rose-200
                      transition-colors
                      ${isSelected ? 'font-bold bg-rose-50 dark:bg-gray-600' : 'font-normal'}
                    `}
                  >
                    <span>{option.label}</span>
                    {isSelected && <span className="text-sc-red dark:text-gray-200">✓</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SortingDropdown;