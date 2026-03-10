import React, { useState } from 'react';

const DropDownButton = ({ onSelection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [buttonText, setButtonText] = useState('Reviews');

  const options = [
    { text: 'Reviews', id: 'review' },
    { text: 'Blog', id: 'blog' },
    { text: 'Ask Questions', id: 'qna' },
    { text: 'Helpful Links', id: 'helpfulLinks' } 
  ];

  const toggleDropdown = () => setIsOpen(!isOpen);

  const chooseOption = (option) => {
    setButtonText(option.text);
    setIsOpen(false);
    onSelection(option.id);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="bg-white dark:bg-gray-600 border-none rounded-md mt-2 px-5 py-2.5 cursor-pointer shadow-lg text-sc-red dark:text-gray-300 font-bold flex items-center justify-between w-11/12 mx-auto outline-none"
      >
        {buttonText} 
        <span
          className={`ml-2 inline-block transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`}
        >
          &#x25BC;
        </span>
      </button>
      {isOpen && (
        <div className="absolute bg-white dark:bg-gray-600 border-none rounded-md shadow-lg mt-1 ml-4 w-11/12 z-10">
          {options.map((option, index) => (
            <div
              key={index}
              className="py-2.5 cursor-pointer text-center bg-white dark:bg-gray-600 rounded-md text-sc-red dark:text-gray-300 font-bold"
              onClick={() => chooseOption(option)}
            >
              {option.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropDownButton;
