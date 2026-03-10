import React, { useState, useEffect } from "react";
import RatingDonutChart from "./RatingDonutChart";
import RatingDistributionFilter from "./RatingDistributionFilter";

const RatingAndDistribution = ({ averageScore, reviewCount, ratingData, onFilterChange }) => {
  const [selectedStars, setSelectedStars] = useState([1, 2, 3, 4, 5]);

  const handleFilterChange = (starsArray) => {
    console.log("Selected stars in RatingAndDistribution:", starsArray);
    setSelectedStars(starsArray);
    
    // Only call the parent's onFilterChange if we have a valid array
    if (onFilterChange && Array.isArray(starsArray)) {
      onFilterChange(starsArray);
    }
  };

  // Initialize with all stars selected, but don't reapply on every render
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange([1, 2, 3, 4, 5]);
    }
    // Only run this effect once on component mount
  }, []);

  return (
    <div className="flex flex-col sm:flex-row items-stretch justify-start w-full min-h-[200px] bg-white dark:bg-gray-800 rounded shadow">
      <div className="sm:w-[40%] w-full flex items-center justify-center p-2">
        <RatingDonutChart averageScore={averageScore} reviewCount={reviewCount} />
      </div>

      {/* Right side rating distribution */}
      <div className="flex-1 w-full p-2">
        <RatingDistributionFilter 
          ratingData={ratingData} 
          onFilterChange={handleFilterChange} 
          initialSelected={selectedStars}
        />
      </div>
    </div>
  );
};

export default RatingAndDistribution;