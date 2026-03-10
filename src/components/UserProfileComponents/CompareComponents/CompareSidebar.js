import React, { useState } from 'react';
import CompareSidebarCard from './CompareSidebarCard';
import CrossBtnLight from '../../../images/icons/CrossLight.png';
import ChevronLeftDark from '../../../images/icons/compare_handle_left.png';

const CompareSidebar = ({
  compareList,
  compareType,
  onRemove,
  onCompare,
  onClose,
  onItemClick
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const PANEL_W = 256;

  return (
    <div className="fixed top-0 right-0 h-full z-50 pointer-events-none">
      

      <div
        style={{

          transform: collapsed 
            ? `translateX(${PANEL_W}px)` 
            : 'translateX(0)',
          transition: 'transform 0.3s ease'
        }}
        className="
          pointer-events-auto            
          absolute top-0 right-0
          w-64 h-full                   
          bg-white dark:bg-gray-900
          text-black dark:text-white
          p-4 shadow-lg overflow-y-auto
        "
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Compare List</h2>
          <img
            src={CrossBtnLight}
            className="h-6 w-6 cursor-pointer dark:invert"
            alt="Close"
            onClick={onClose}
          />
        </div>

        {/* Items */}
        <div className="space-y-4 mb-4">
          {compareList.map(item => (
            <div
              key={`${item.type}-${item.id}`}
              className="bg-gray-100 dark:bg-gray-800 rounded-md p-2 transition-colors duration-300"
            >
              <CompareSidebarCard
                itemId={item.id}
                itemType={item.type}
                onRemove={onRemove}
                onItemClick={onItemClick}
              />
            </div>
          ))}
        </div>


        <button
          onClick={onCompare}
          disabled={compareList.length < 2}
          className={`
            w-full py-2 px-4 rounded-md border-2 transition-colors duration-200
            ${compareList.length >= 2
              ? 'bg-sc-red text-white border-transparent hover:bg-white hover:text-sc-red hover:border-sc-red dark:hover:bg-gray-100 dark:hover:text-sc-red'
              : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed border-transparent'
            }
          `}
        >
          Compare ({compareList.length})
        </button>
      </div>


      <button
        onClick={() => setCollapsed(prev => !prev)}
        style={{

          transform: collapsed
            ? 'translateY(-50%)'
            : `translate(-${PANEL_W}px, -50%)`,
          transition: 'transform 0.3s ease'
        }}
        className="
          pointer-events-auto             
          absolute top-1/2 right-0        
          h-14 w-9                        
          bg-white dark:bg-gray-900      
          rounded-l-full shadow-lg
          flex items-center justify-center
          -translate-y-1/2
        "
      >
        <img
          src={ChevronLeftDark}
          className={`
            h-5 w-5
            filter invert-0 dark:invert  
            transition-transform duration-200
            ${collapsed ? '' : 'rotate-180'}  
          `}
          alt="toggle sidebar"
        />
      </button>
    </div>
  );
};

export default CompareSidebar;
