import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../API.js'; 

function UniversityLogoGrid() {
  const [universities, setUniversities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${BASE_URL}/api/university-pages?populate[universityLogo][fields][0]=alternativeText&populate[universityLogo][fields][1]=formats&pagination[pageSize]=12`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseData = await response.json();
        setUniversities(responseData.data || []);
      } catch (error) {
        console.error('Error fetching university logos:', error);
        setUniversities([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); 

  const handleUniClick = (id) => {
    navigate(`/universities/${id}`); 
  };

  const handleAllUniClick = () => {
    console.log("All universities clicked");
  };

  return (
    <div className="my-6 px-4 sm:px-0"> 
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
        Universities
      </h2>
      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 2xl:grid-cols-9 gap-2 sm:gap-3">
        {/* "All Universities"  */}
        <button
          onClick={handleAllUniClick}
          className="flex items-center justify-center h-16 sm:h-20 bg-gray-200 dark:bg-gray-600 rounded-md shadow-sm hover:shadow-md transition text-gray-700 dark:text-gray-100 font-semibold text-sm p-1 text-center"
          aria-label="View all universities"
        >
          All universities
        </button>

        {/* Logo */}
        {isLoading
          ? 
            [...Array(11)].map((_, index) => ( 
              <div key={`skeleton-${index}`} className="h-16 sm:h-20 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse"></div>
            ))
          : 
            universities.map((uni) => {
              const attributes = uni.attributes;
              const logoData = attributes?.universityLogo?.data?.attributes;
              const logoUrl = logoData?.formats?.thumbnail?.url || logoData?.url;
              const uniName = attributes?.universityName || 'University';

              if (!logoUrl) {
                return (
                  <button
                    key={uni.id}
                    onClick={() => handleUniClick(uni.id)}
                    className="flex items-center justify-center h-16 sm:h-20 bg-gray-200 dark:bg-gray-500 rounded-md shadow-sm hover:shadow-md transition text-gray-700 dark:text-gray-100 font-semibold text-xs p-1 overflow-hidden text-center"
                    title={uniName} 
                  >
                    {uniName.substring(0, 10)}{uniName.length > 10 ? '...' : ''}
                  </button>
                );
              }
              return (
                <button
                  key={uni.id}
                  onClick={() => handleUniClick(uni.id)}
                  className="flex items-center justify-center h-16 sm:h-20 bg-white dark:bg-gray-300 rounded-md shadow-sm hover:shadow-md transition p-1 sm:p-2"
                  title={uniName}
                  aria-label={`View details for ${uniName}`}
                >
                  <img
                    src={`${BASE_URL}${logoUrl}`}
                    alt={logoData?.alternativeText || `${uniName} Logo`}
                    className="max-h-full max-w-full object-contain"
                    loading="lazy"
                  />
                </button>
              );
            })}
      </div>
    </div>
  );
}

export default UniversityLogoGrid;