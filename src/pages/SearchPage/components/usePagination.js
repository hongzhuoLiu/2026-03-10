// src/pages/SearchPage/components/usePagination.js
import { useState, useEffect, useMemo, useCallback } from "react";

export default function usePagination(results = [], pageSize = 10) {
  const safeResults = Array.isArray(results) ? results : [];

  // Current page (starts from 1)
  const [currentPage, setCurrentPage] = useState(1);

  // Page jump input field and error message (consistent with SearchPage)
  const [inputPage, setInputPage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Total pages (expected field name in SearchPage: totalPages)
  const totalPages = useMemo(() => {
    const m = Math.ceil(safeResults.length / pageSize);
    return m > 0 ? m : 1;
  }, [safeResults.length, pageSize]);

  // Reset to page 1 and clear input/error when results or page size changes
  useEffect(() => {
    setCurrentPage(1);
    setInputPage("");
    setErrorMsg("");
  }, [safeResults.lenth, pageSize]);

  // Calculate current page data (expected field name in SearchPage: paginatedData)
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = useMemo(
    () => safeResults.slice(startIndex, endIndex),
    [safeResults, startIndex, endIndex]
  );

  // Previous/Next page (optional: ready to use for buttons)
  const nextPage = useCallback(() => {
    setCurrentPage((p) => Math.min(p + 1, totalPages));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setCurrentPage((p) => Math.max(p - 1, 1));
  }, []);

  // Handle "Jump to page" button (SearchPage is using handleJumpPage / inputPage / setInputPage)
  const handleJumpPage = useCallback(() => {
    if (inputPage === "") {
      setErrorMsg("Please enter a page number.");
      return;
    }
    const n = Number(inputPage);
    if (!Number.isInteger(n) || n < 1 || n > totalPages) {
      setErrorMsg(`Page must be an integer between 1 and ${totalPages}.`);
      return;
    }
    setErrorMsg("");
    setCurrentPage(n);
  }, [inputPage, totalPages]);

  return {
    // Fields being destructured in SearchPage (keep unchanged)
    currentPage,
    setCurrentPage,
    inputPage,
    setInputPage,
    errorMsg,
    totalPages,
    paginatedData,

    // Additional convenience methods (optional to use)
    nextPage,
    prevPage,
  };
}