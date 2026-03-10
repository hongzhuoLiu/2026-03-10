import React from "react";

const RatingDonutChart = ({ averageScore, reviewCount }) => {
  const radius = 45;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const ratingFraction = averageScore / 5;
  const strokeDashoffset = circumference * (1 - ratingFraction);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="relative flex items-center justify-center w-[80%] h-[80%] max-w-[150px] max-h-[150px]">
        <svg
          className="-rotate-90 w-full h-full"
          viewBox="0 0 120 120"
          preserveAspectRatio="xMidYMid meet"
        >

          <circle
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx="60"
            cy="60"
            className="stroke-[#E5E7EB] dark:stroke-[#374151]"
          />

          <circle
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx="60"
            cy="60"
            style={{ transition: "stroke-dashoffset 0.3s" }}
            className="stroke-[#6b0221]"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl sm:text-xl md:text-4xl font-bold text-gray-800 dark:text-white">
            {averageScore}
          </span>
        </div>
      </div>

      <p className="text-sm sm:text-lg text-gray-500 dark:text-gray-300 text-center mt-2">
      Based on {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
      </p>
    </div>
  );
};

export default RatingDonutChart;
