

import React, { useRef, useState } from "react";
import {
  LoadScript,
  StandaloneSearchBox
} from "@react-google-maps/api";
import { FaSearch } from "react-icons/fa";

const libraries = ["places"];

const PlaceSearchBox = () => {
  const searchBoxRef = useRef(null);

  const [noResults, setNoResults] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const onPlacesChanged = () => {
    const places = searchBoxRef.current.getPlaces();
    console.log("Selected place:", places[0]);
    if (places?.length === 0) {
      setNoResults(true);
    } else {
      setNoResults(false);
    }
  };

  return (
    <div className="primaryPageSizing">
      <LoadScript
        googleMapsApiKey="AIzaSyDf_2lHi1--TINfH0xic5Weagu2VdIARiU"
        libraries={libraries}
      >
        <h2 className="titleTextSecondary">
          Location
        </h2>
        <div className="flex flex-col sm:grid sm:grid-cols-2 2xl:grid-cols-3 w-full h-full relative">

        <div className="relative sm:w-[88%] md:w-[100%] rounded-full border border-black dark:border-white mt-3 mx-3">
          <StandaloneSearchBox
            onLoad={(ref) => (searchBoxRef.current = ref)}
            onPlacesChanged={onPlacesChanged}
            options={{
              componentRestrictions: { country: "au" },
              types: ['university', 'school', 'library'],
            }}
            onBlur={() => {
              setTimeout(() => {
                const places = searchBoxRef.current?.getPlaces() || [];
                if (inputValue.trim() !== "" && places.length === 0) {
                  setNoResults(true);
                }
              }, 300);
            }}
          >
            <input
              type="text"
              id="location-search"
              placeholder="Search country/ region/ city"
              className="w-[92%] px-3 py-2 rounded-full bg-transparent text-black dark:text-white  italic whitespace-nowrap overflow-hidden text-ellipsis outline-none"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </StandaloneSearchBox>

          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-800 dark:text-gray-400 pointer-events-none">
            <FaSearch size={22} />
          </div>
        </div>
</div>
        {noResults && (
          <div className="bg-transparent rounded px-3 py-2 mt-1 ml-1 text-[2.5vmin] italic text-gray-600 dark:text-gray-400 w-1/2">
            Location not found!
          </div>
        )}
      </LoadScript>
    </div>
  );
};

export default PlaceSearchBox;
