import React from 'react';
import { useNavigate } from 'react-router-dom';
import StarYellowFill from '../images/icons/StarYellowFill.png';
import LocationPinIcon from '../images/icons/locationPin.png'; 

function ListItemRow({ item }) {
  const navigate = useNavigate();

  const displayRating = item.facilityRating && item.facilityRating > 0 ? item.facilityRating.toFixed(1) : '-';
  const ratingPercentage = item.facilityRating && item.facilityRating > 0 ? (item.facilityRating / 5) * 100 : 0;

  const categoryText = item.facilityDescription || '';
  const categoriesToShow = categoryText.split(',').slice(0, 1).join(', '); 
  const showEllipsis = categoryText.split(',').length > 1; 

  const handleClick = () => {
    if (item && item.id) {
      navigate(`/facility/${item.id}`);
    } else {
      console.error("ListItemRow: Missing item id for navigation", item);
    }
  };

  return (
    <div
      key={item.id}
      onClick={handleClick}
      className="flex items-center p-2 sm:p-3 bg-gray-100 dark:bg-gray-700 rounded-md shadow-sm w-full space-x-2 sm:space-x-3 cursor-pointer hover:shadow-lg hover:opacity-90 transition duration-200"
    >
      {/* name */}
      <div className="flex-1 min-w-0 pr-1 sm:pr-2"> 
        <p className="text-xs sm:text-sm md:text-base font-semibold text-gray-900 dark:text-gray-100 break-words">
          {item.facilityName}
        </p>
      </div>


      {/* type */}
      <div className="flex-shrink-0 w-14 sm:w-20 md:w-1/6 min-w-0 pr-1 sm:pr-2">
        <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 dark:text-gray-300 leading-tight">
            {categoriesToShow}
            {showEllipsis ? '...' : ''}
        </p>
      </div>

      {/* location */}
      <div className="flex-shrink-0 w-14 sm:w-20 md:w-1/6 min-w-0 flex items-center text-[10px] sm:text-xs md:text-sm text-gray-600 dark:text-gray-300 pr-1 sm:pr-2">
        <img src={LocationPinIcon} alt="Location" className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
        <span className="truncate">{item.facilityLocation}</span>
      </div>

      {/* rating */}
      <div className="flex-shrink-0 w-20 sm:w-24 md:w-1/4 flex items-center">
        {/* chart */}
        <div className="flex-grow bg-gray-300 dark:bg-gray-600 rounded-full h-2 sm:h-3 mr-1 sm:mr-2">
          <div
            className="bg-sc-red h-2 sm:h-3 rounded-full"
            style={{ width: `${ratingPercentage}%` }}
            role="progressbar"
            aria-valuenow={item.facilityRating || 0} aria-valuemin="0" aria-valuemax="5"
          />
        </div>
        <div className="flex-shrink-0 flex items-center font-bold text-xs sm:text-sm md:text-base text-gray-900 dark:text-gray-100 min-w-[35px] sm:min-w-[40px] md:min-w-[65px] justify-end">
          <span>{displayRating}</span>
          {displayRating !== '-' && (
            <>
              <img className="w-3 h-3 sm:w-4 md:w-5 sm:h-4 md:h-5 ml-1 block" src={StarYellowFill} alt="" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ListItemRow;