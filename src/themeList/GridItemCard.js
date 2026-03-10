import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import StarYellowFill from '../images/icons/StarYellowFill.png';
import LocationPinIcon from '../images/icons/locationPin.png'; 
function GridItemCard({ item }) {
  const navigate = useNavigate(); 

  const displayRating = item.facilityRating && item.facilityRating > 0 ? item.facilityRating.toFixed(1) : '-';

   const handleClick = () => {
    if (item && item.id) {
      navigate(`/facility/${item.id}`);
    } else {
      console.error("GridItemCard: Missing item id for navigation", item);
    }
  };

  return (
    // --- Changed div to button and added onClick ---
    <button // <-- Use button for click interaction
      key={item.id}
      onClick={handleClick} // <-- Add onClick
      type="button" // Explicitly set type for button
      className="flex flex-col h-32 sm:h-36 p-3 sm:p-4
                 bg-gray-100 dark:bg-gray-800
                 rounded-xl
                 shadow hover:shadow-lg // Enhance hover effect
                 transition duration-200
                 text-gray-900 dark:text-gray-100
                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sc-red dark:focus:ring-offset-gray-900 // Add focus style
                 w-full text-left" // Ensure it fills grid cell, text align might not matter if centered below
    >
      {/* name */}
      <div className="flex-grow flex items-center justify-center text-center mb-1 sm:mb-2">
        <h3 className="text-base sm:text-xl font-semibold leading-tight text-sc-red dark:text-gray-100"> {/* Restored name color */}
          {item.facilityName}
        </h3>
      </div>

      {/* bottom */}
      <div className="flex justify-between items-center mt-auto pt-1 sm:pt-2 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-300">
          <img src={LocationPinIcon} alt="Location" className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
          <span className="truncate">{item.facilityLocation}</span>
        </div>

        {/* rating */}
        <div className="flex items-center text-xs sm:text-sm font-bold">
          <span>{displayRating}</span>
          {displayRating !== '-' && (
            <>
              <img className="w-3 h-3 sm:w-4 sm:h-4 ml-1 block" src={StarYellowFill} alt="" />
            </>
          )}
        </div>
      </div>
    </button>
  );
}

export default GridItemCard;