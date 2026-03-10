import React, { useRef, useState, useEffect } from "react";
import {
  LoadScript,
  StandaloneSearchBox
} from "@react-google-maps/api";
import { FaSearch } from "react-icons/fa";

const libraries = ["places"];

const AddContentSearch = ({ onLocationSelected, initialValue = "", className = "", inputClassName = "" }) => {
  const searchBoxRef = useRef(null);
  
  const [noResults, setNoResults] = useState(false);
  const [inputValue, setInputValue] = useState(initialValue);
  
  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);
  
  const onPlacesChanged = () => {
    if (!searchBoxRef.current) return;
    
    const places = searchBoxRef.current.getPlaces();
    if (!places || places.length === 0) {
      setNoResults(true);
    } else {
      setNoResults(false);

      if (typeof onLocationSelected === 'function' && places.length > 0) {
        // Pass the selected place to the parent component
        onLocationSelected(places[0]);
        
        // Update the input value with the formatted address
        if (places[0].formatted_address) {
          setInputValue(places[0].formatted_address);
        }
      }
    }
  };

  // Handle manual input (when user types but doesn't select from dropdown)
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    // If the field is cleared, inform the parent component
    if (value === "" && typeof onLocationSelected === 'function') {
      onLocationSelected(null);
    }
  };
  
  return (
    <div className={className}>
      <LoadScript
        googleMapsApiKey="AIzaSyDf_2lHi1--TINfH0xic5Weagu2VdIARiU"
        libraries={libraries}
      >
        <div className="relative w-full">
          <StandaloneSearchBox
            onLoad={(ref) => (searchBoxRef.current = ref)}
            onPlacesChanged={onPlacesChanged}
            options={{
              componentRestrictions: { country: "au" },
              types: ['geocode', 'establishment']
            }}
            onBlur={() => {
              setTimeout(() => {
                const places = searchBoxRef.current?.getPlaces() || [];
                if (inputValue.trim() !== "" && places.length === 0) {
                  setNoResults(true);
                }
                
                // If user typed something but didn't select from dropdown,
                // still pass the text as a location
                if (inputValue.trim() !== "" && typeof onLocationSelected === 'function') {
                  // If no places were selected but there's text, use the text as location
                  if (places.length === 0) {
                    onLocationSelected({ formatted_address: inputValue });
                  }
                }
              }, 300);
            }}
          >
            <div className="relative w-full">
              <input
                type="text"
                id="location-search"
                placeholder="Search for country, state, or city..."
                className={`w-full pr-10 outline-none ${inputClassName}`}
                value={inputValue}
                onChange={handleInputChange}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-800 dark:text-gray-400 pointer-events-none">
                <FaSearch size={18} />
              </div>
            </div>
          </StandaloneSearchBox>
        </div>
        {noResults && (
          <div className="bg-transparent rounded px-3 py-2 mt-1 text-sm italic text-gray-600 dark:text-gray-400">
            Location not found!
          </div>
        )}
      </LoadScript>
    </div>
  );
};

export default AddContentSearch;