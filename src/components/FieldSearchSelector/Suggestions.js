import React from "react";

export default function Suggestions({
  search,
  options,
  selectedOptions,
  handleSelect,
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options
        .filter(
          (option) =>
            option.toLowerCase().includes(search.toLowerCase()) &&
            !selectedOptions.includes(option)
        )
        .map((option) => (
          <span
            key={option}
            onClick={() => handleSelect(option)}
            className="px-4 py-2 border border-black text-gray-600 dark:border-white dark:text-white rounded-full cursor-pointer text-md font-bold hover:bg-[#6b0221] hover:text-white"
          >
            {option}
          </span>
        ))}

      {options.filter(
        (option) =>
          option.toLowerCase().includes(search.toLowerCase()) &&
          !selectedOptions.includes(option)
      ).length === 0 && (
        <p className="w-full flex justify-center items-center text-gray-500">
          No results found
        </p>
      )}
    </div>
  );
}
