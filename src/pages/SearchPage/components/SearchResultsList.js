// src/pages/SearchPage/components/SearchResultsList.js
import React from "react";
import SearchResultCard from "./SearchResultCard";

export default function SearchResultsList({ results = [] }) {
  if (!Array.isArray(results) || results.length === 0) {
    return (
      <div className="py-6 text-center text-gray-500">
        No results found.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {results.map((item, idx) => (
        <SearchResultCard
          key={`${item?.type ?? "unknown"}-${item?.id ?? idx}`}
          item={item}
        />
      ))}
    </div>
  );
}