import React, { useState, useEffect } from "react";
import StarYellow from "../../images/icons/StarYellowFill.png";

const RatingDistributionFilter = ({
  ratingData,
  onFilterChange,
  initialSelected = [1, 2, 3, 4, 5],
}) => {
  const [selectedStars, setSelectedStars] = useState(initialSelected);

  // Update local state when props change
  useEffect(() => {
    if (initialSelected && initialSelected.length > 0) {
      setSelectedStars(initialSelected);
    }
  }, [initialSelected]);

  const handleCheckboxChange = (star) => {
    const newSelectedStars = selectedStars.includes(star) 
      ? selectedStars.filter(s => s !== star) 
      : [...selectedStars, star].sort();
    
    setSelectedStars(newSelectedStars);
    
    // Make sure we don't call the callback with an empty array
    // At least one star must always be selected
    if (newSelectedStars.length > 0 && onFilterChange) {
      console.log("Sending filter change from RatingDistributionFilter:", newSelectedStars);
      onFilterChange(newSelectedStars);
    }
  };

  const maxCount = Math.max(...Object.values(ratingData), 1);

  return (
    <div className="table w-full h-full p-4">
      {[5, 4, 3, 2, 1].map((star) => {
        const count = ratingData[star] || 0;
        const percentage = count > 0 ? (count / maxCount) * 100 : 0;
        const progressBarColor =
          count > 0 ? "bg-sc-red" : "bg-gray-400 dark:bg-gray-600";

        return (
          <div key={star} className="table-row align-middle">

            <div className="table-cell align-middle pr-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedStars.includes(star)}
                  onChange={() => handleCheckboxChange(star)}
                  className="h-5 w-5 accent-sc-red"
                  id={`star-filter-${star}`}
                />
                <label 
                  htmlFor={`star-filter-${star}`}
                  className="ml-2 text-gray-800 dark:text-white cursor-pointer flex items-center"
                >
                  <span>{star}</span>
                  <img
                    src={StarYellow}
                    alt="StarYellow"
                    className="w-4 h-4 ml-1"
                  />
                </label>
              </div>
            </div>


            <div className="table-cell align-middle w-full px-2">
              <div className="bg-gray-200 dark:bg-gray-700 rounded h-4 overflow-hidden">
                <div
                  className={`${progressBarColor} h-full`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>


            <div className="table-cell align-middle text-right text-sm text-gray-800 dark:text-white pr-2 w-8 tabular-nums">
              {count}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RatingDistributionFilter;