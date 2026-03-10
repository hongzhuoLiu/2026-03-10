import React from "react";
import CompareCard from "./CompareCard";
import CrossBtnLight from "../../../images/icons/CrossLight.png";

const ComparePopup = ({ compareList, onClose }) => {
  const gridCols =
    compareList.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2";

  return (
    <div
      className="
        fixed top-0 left-0 w-screen h-screen
        flex justify-center items-center
        z-10
        bg-black bg-opacity-50
      "
    >
      <div
        className="
          bg-white dark:bg-gray-800
          text-black dark:text-white
          rounded-lg p-6
          w-11/12 max-w-6xl max-h-[90vh]
          overflow-y-auto
          transition-colors duration-300
        "
      >
        <div className="flex justify-end mb-4">
          <img
            src={CrossBtnLight}
            alt="Close"
            className="h-8 w-8 cursor-pointer dark:invert
            "
            
            onClick={onClose}
          />
        </div>

        <h2 className="text-2xl font-bold mb-4 text-center">Comparison</h2>

        {/* <div className={`grid grid-cols-1 ${gridCols} gap-6`}> */}
        <div
          className={`
    grid
    grid-cols-2        
    gap-2              
    sm:grid-cols-1     
    sm:gap-6           
    ${gridCols}        
    items-start
  `}
        >
          {compareList.map((item) => (
            <CompareCard
              key={`${item.type}-${item.id}`}
              itemId={item.id}
              itemType={item.type}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComparePopup;
