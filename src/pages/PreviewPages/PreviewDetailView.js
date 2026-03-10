import React, { useEffect } from 'react';
import ChevronLight from '../../images/icons/ChevronLeft.png';
import ChevronDark from '../../images/icons/ChevronLeftDark.png';

function PreviewDetailView({ 
  uniName, 
  itemName, 
  itemGrad, 
  itemDesc, 
  onClose, 
  universityId,
  orgName,
  orgDescription,
  institution,
  location,
  rating,
  orgWebsite,
  contentType,
  destLogo,
  destHeaderImage
}) {
  // Prevent background scrolling when this view is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const isGenericOrg = contentType && ["accommodation", "health", "fitness", "eateries", "clubs", "culture"].includes(contentType);
  const isDestination = uniName === "Destination";

  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="relative bg-white dark:bg-gray-900 w-full h-[80vh] rounded-lg px-6 mx-6 overflow-y-auto">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute z-10 text-5xl top-4 right-4 text-gray-700 dark:text-gray-200"
        >
          ✖
        </button>

        <div className="flex items-center mt-2">
          <img className="h-6 sm:h-10 cursor-pointer mr-1 block dark:hidden" src={ChevronLight} alt="Back arrow" />
          <img className="h-6 sm:h-10 cursor-pointer mr-1 hidden dark:block" src={ChevronDark} alt="Back arrow" />
          <h1 className="w-full text-left text-xl sm:text-3xl font-bold ml-2 text-sc-red dark:text-gray-300">{uniName}</h1>
        </div>

        <div className="mt-4">
          <h3 className="text-gray-400 text-xl sm:text-3xl font-bold">{itemName}</h3>
          <h4 className="text-gray-500 text-base sm:text-2xl">{itemGrad}</h4>

          {/* Display images for destinations */}
          {isDestination && destLogo && (
            <div className="mt-4">
              <img src={destLogo} alt="Destination Logo" className="h-16 object-contain mb-2" />
            </div>
          )}
          
          {isDestination && destHeaderImage && (
            <div className="mt-4">
              <img src={destHeaderImage} alt="Destination Header" className="w-full h-48 object-cover rounded-lg mb-4" />
            </div>
          )}

          {/* Display location and other details for destinations */}
          {isDestination && (
            <div className="mt-6 space-y-4">
              {location && (
                <div className="border-b pb-2">
                  <h4 className="text-gray-600 dark:text-gray-300 font-semibold">Location</h4>
                  <p className="text-gray-800 dark:text-gray-200">{location}</p>
                </div>
              )}
              
              {orgWebsite && (
                <div className="border-b pb-2">
                  <h4 className="text-gray-600 dark:text-gray-300 font-semibold">Website</h4>
                  <p className="text-gray-800 dark:text-gray-200">{orgWebsite}</p>
                </div>
              )}
            </div>
          )}

          {isGenericOrg && (
            <>
              <div className="mt-6 space-y-4">
                {universityId && (
                  <div className="border-b pb-2">
                    <h4 className="text-gray-600 dark:text-gray-300 font-semibold">Associated university ID</h4>
                    <p className="text-gray-800 dark:text-gray-200">{universityId}</p>
                  </div>
                )}
                
                {institution && (
                  <div className="border-b pb-2">
                    <h4 className="text-gray-600 dark:text-gray-300 font-semibold">University Name</h4>
                    <p className="text-gray-800 dark:text-gray-200">{institution}</p>
                  </div>
                )}
                
                {location && (
                  <div className="border-b pb-2">
                    <h4 className="text-gray-600 dark:text-gray-300 font-semibold">Location</h4>
                    <p className="text-gray-800 dark:text-gray-200">{location}</p>
                  </div>
                )}
                
                {rating > 0 && (
                  <div className="border-b pb-2">
                    <h4 className="text-gray-600 dark:text-gray-300 font-semibold">Rating</h4>
                    <p className="text-gray-800 dark:text-gray-200">{rating} / 5</p>
                  </div>
                )}
                
                {orgDescription && (
                  <div className="border-b pb-2">
                    <h4 className="text-gray-600 dark:text-gray-300 font-semibold">Description</h4>
                    <p className="text-gray-800 dark:text-gray-200">{orgDescription}</p>
                  </div>
                )}
                
                {orgWebsite && (
                  <div className="border-b pb-2">
                    <h4 className="text-gray-600 dark:text-gray-300 font-semibold">Website</h4>
                    <p className="text-gray-800 dark:text-gray-200">{orgWebsite}</p>
                  </div>
                )}
              </div>
            </>
          )}
          
          <div className="mt-6">
            <h4 className="text-gray-600 dark:text-gray-300 font-semibold">
              {isGenericOrg ? "Additional information" : "Description"}
            </h4>
            <p className="text-gray-900 dark:text-gray-200 text-sm font-normal mt-2">{itemDesc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreviewDetailView;