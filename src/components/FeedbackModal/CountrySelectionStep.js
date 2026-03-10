import React from "react";

const CountrySelectionStep = ({ selectedCountries, onCountryChange }) => (
  <>
    <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
      Which countries are you considering for your higher education?
    </h2>
    {[
      "The United States of America",
      "United Kingdom",
      "Australia",
      "New Zealand",
      "Canada",
    ].map((country) => (
      <div key={country} className="flex items-center mb-2">
        <input
          type="checkbox"
          value={country}
          checked={selectedCountries.includes(country)}
          onChange={() => onCountryChange(country)}
          className="form-checkbox h-5 w-5 text-red-600 dark:text-red-400"
        />
        <label className="ml-2 text-gray-800 dark:text-white">{country}</label>
      </div>
    ))}
  </>
);

export default CountrySelectionStep;
