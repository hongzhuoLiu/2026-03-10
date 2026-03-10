import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import SearchBar from "./components/SearchBar";
import SearchResultsList from "./components/SearchResultsList";
import useCombinedSearchData from "./components/useCombinedSearchData";
import RefineResultsPanel from "./components/RefineResultsPanel";
import useSearchEngine from "./components/useSearchEngine";
import usePagination from "./components/usePagination";

function SearchPage() {
  // ---------------------------
  // System + manual dark/BW mode handling
  // ---------------------------
  useEffect(() => {
    const mqDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
    const mqForced = window.matchMedia('(forced-colors: active)');
    const mqContrastMore = window.matchMedia('(prefers-contrast: more)');

    const applyTheme = () => {
      // Dark mode flag on <html>
      if (mqDarkMode.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // Auto B/W when system is in high-contrast or contrast-more
      if (mqForced.matches || mqContrastMore.matches) {
        document.documentElement.classList.add('bw');
      } else {
        // only remove auto BW if user hasn't manually enabled it
        try {
          if (localStorage.getItem('sc_bw') !== '1') {
            document.documentElement.classList.remove('bw');
          }
        } catch {
          document.documentElement.classList.remove('bw');
        }
      }
    };

    // (1) URL param fallback (?bw=1 / ?bw=0)
    try {
      const url = new URL(window.location.href);
      const bwParam = url.searchParams.get('bw');
      if (bwParam === '1') {
        document.documentElement.classList.add('bw');
        localStorage.setItem('sc_bw', '1');
      } else if (bwParam === '0') {
        document.documentElement.classList.remove('bw');
        localStorage.setItem('sc_bw', '0');
      }
    } catch {}

    // (2) LocalStorage fallback (remember last choice)
    try {
      if (localStorage.getItem('sc_bw') === '1') {
        document.documentElement.classList.add('bw');
      }
    } catch {}

    // (3) Apply system signals initially + listen for changes
    applyTheme();

    const add = (mql, fn) => {
      if (mql.addEventListener) mql.addEventListener('change', fn);
      else if (mql.addListener) mql.addListener(fn);
    };
    const remove = (mql, fn) => {
      if (mql.removeEventListener) mql.removeEventListener('change', fn);
      else if (mql.removeListener) mql.removeListener(fn);
    };

    add(mqDarkMode, applyTheme);
    add(mqForced, applyTheme);
    add(mqContrastMore, applyTheme);

    return () => {
      remove(mqDarkMode, applyTheme);
      remove(mqForced, applyTheme);
      remove(mqContrastMore, applyTheme);
    };
  }, []);

  // ---------------------------
  // Search state
  // ---------------------------
  const ALL_FILTER_KEYS = [
    'university', 'program', 'subject',
    'review', 'blog', 'qna',
    'destination', 'helpful-links'
  ];

  const matchByFilters = (item, filters) => {
    if (!filters || filters.length === 0) return false;
    if (item.type === 'university') return filters.includes('university');
    if (item.type === 'program') return filters.includes('program');
    if (item.type === 'subject') return filters.includes('subject');
    if (item.type === 'destination') return filters.includes('destination');
    if (item.type === 'helpful-links') return filters.includes('helpful-links');
    if (item.type === 'post' && item.postType) return filters.includes(item.postType);
    return false;
  };

  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q');
  const keyword = (query || '').trim().toLowerCase();

  const initDoneRef = useRef(false);

  const { allResults } = useCombinedSearchData();

  const [inputValue, setInputValue] = useState(keyword);
  const [committedQuery, setCommittedQuery] = useState(keyword);

  const [selectedFilters, setSelectedFilters] = useState([]);
  const [liveCountSource, setLiveCountSource] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);

  const { filteredSearch, generateSuggestions, search } = useSearchEngine(allResults, selectedFilters);

  useEffect(() => {
    if (!allResults || allResults.length === 0) {
      setFilteredResults([]);
      setLiveCountSource([]);
      return;
    }
    const baseResults = committedQuery.trim() ? search(committedQuery.trim()) : allResults;
    setLiveCountSource(baseResults);
    const filtered = baseResults.filter(item => matchByFilters(item, selectedFilters));
    setFilteredResults(filtered);
  }, [selectedFilters, committedQuery, allResults, search]);

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const toggleFilter = (type) => {
    setSelectedFilters(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  const getFilterCounts = () => {
    const counts = {
      university: 0,
      program: 0,
      review: 0,
      blog: 0,
      qna: 0,
      destination: 0,
      'helpful-links': 0,
    };

    const source = liveCountSource;
    for (const item of source) {
      if (item.type === "university") counts.university++;
      else if (item.type === "program") counts.program++;
      else if (item.type === "destination") counts.destination++;
      else if (item.type === "helpful-links") counts['helpful-links']++;
      else if (item.type === "post" && item.postType) {
        if (counts.hasOwnProperty(item.postType)) counts[item.postType]++;
      }
    }
    return counts;
  };

  const filterCounts = getFilterCounts();

  useEffect(() => {
    if (!initDoneRef.current && allResults && allResults.length > 0) {
      setSelectedFilters(ALL_FILTER_KEYS);
      initDoneRef.current = true;
    }
  }, [allResults?.length]);

  const {
    currentPage,
    setCurrentPage,
    inputPage,
    setInputPage,
    errorMsg,
    totalPages,
    paginatedData: paginatedResults,
    handleJumpPage
  } = usePagination(filteredResults, 10);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleResultClick = (item) => {
    const card = document.querySelector(`[data-id="${item.id}"]`);
    if (card) card.style.opacity = '0.7';

    switch (item.type) {
      case 'university':
        navigate(`/universities/${item.id}`);
        break;
      case 'program':
        navigate(`/universities/${item.universityId}/program/${item.id}`);
        break;
      case 'post':
        if (item.universityId) {
          navigate(`/universities/${item.universityId}`);
        } else {
          switch (item.postType) {
            case 'review':
              navigate(`/review/${item.id}`);
              break;
            case 'blog':
              navigate(`/blog/${item.id}`);
              break;
            case 'qna':
              navigate(`/qna/${item.id}`);
              break;
            default:
              break;
          }
        }
        break;
      case 'destination':
        navigate(`/destination/${item.id}`);
        break;
      case 'helpful-links':
        navigate(`/facility/${item.id}`);
        break;
      default:
        break;
    }
  };

  const handleSearch = () => {
    const kw = inputValue.toLowerCase().trim();
    const currentParams = new URLSearchParams(location.search);
    const currentQuery = currentParams.get('q') || '';

    setCommittedQuery(kw);

    if (kw !== currentQuery.toLowerCase()) {
      navigate(`/search?q=${encodeURIComponent(kw)}`, { replace: true });
    }
  };

  const generateSuggestionsWrapped = (kw) => {
    const s = generateSuggestions(kw);
    setSuggestions(s);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setShowSuggestions(false);

    const kw = suggestion.toLowerCase().trim();
    setCommittedQuery(kw);

    const currentParams = new URLSearchParams(location.search);
    const currentQuery = currentParams.get('q') || '';
    if (kw !== currentQuery.toLowerCase()) {
      navigate(`/search?q=${encodeURIComponent(kw)}`, { replace: true });
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    generateSuggestionsWrapped(value);
    setShowSuggestions(true);
  };

  const renderPaginationNumbers = () => {
    const visiblePages = [];
    const totalPageCount = totalPages;
    const current = currentPage;

    visiblePages.push(1);

    if (totalPageCount <= 7) {
      for (let i = 2; i < totalPageCount; i++) visiblePages.push(i);
    } else {
      if (current > 4) visiblePages.push('...');
      const start = Math.max(2, current - 1);
      const end = Math.min(current + 1, totalPageCount - 1);
      for (let i = start; i <= end; i++) visiblePages.push(i);
      if (current < totalPageCount - 3) visiblePages.push('...');
    }

    if (totalPageCount > 1) visiblePages.push(totalPageCount);

    return visiblePages.map((pageNum, index) => {
      if (pageNum === '...') {
        return <span key={`ellipsis-${index}`} className="ellipsis">…</span>;
      }
      const isActive = pageNum === current;
      return (
        <button
          key={pageNum}
          onClick={() => setCurrentPage(pageNum)}
          className={`btn ${isActive ? 'btn--brand' : 'btn--ghost'}`}
        >
          {pageNum}
        </button>
      );
    });
  };

  const toggleBW = () => {
    const html = document.documentElement;
    const next = !html.classList.contains('bw');
    html.classList.toggle('bw', next);
    try { localStorage.setItem('sc_bw', next ? '1' : '0'); } catch {}
  };

  return (
    <div className="search-root">
      {/* Header */}
      <div className="header">
        <img src="https://backend-dev.studentschoice.blog/uploads/SC_Logo_White_BG_9a444e920e.png" alt="search" className="logo" />
        <h1 className="header__title">SEARCH</h1>
      </div>

      <SearchBar
        inputValue={inputValue}
        suggestions={suggestions}
        showSuggestions={showSuggestions}
        onInputChange={handleInputChange}
        onSearch={handleSearch}
        onSuggestionClick={handleSuggestionClick}
        onInputBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
      />

      <div className="spacer" />

      {/* Mobile filter toggle */}
      <div className="mobile-filter-toggle">
        <button
          onClick={() => {
            const panel = document.querySelector('.refine-results-mobile');
            if (panel) panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
          }}
          className="btn btn--ghost toggle-filters"
        >
          Show Filters
        </button>

        <RefineResultsPanel
          isMobile={true}
          selectedFilters={selectedFilters}
          toggleFilter={toggleFilter}
          filterCounts={filterCounts}
        />
      </div>

      {/* Main content */}
      <div className="search-content">
        <div className="left">
          <h1 className="section-title">Search Results</h1>
          <SearchResultsList results={paginatedResults} />

          {/* Pagination */}
          <div className="pagination">
            <button
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn btn--ghost"
            >
              &lt;
            </button>

            {renderPaginationNumbers()}

            <button
              onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="btn btn--ghost"
            >
              &gt;
            </button>
          </div>
        </div>

        {/* Desktop refine results */}
        <RefineResultsPanel
          selectedFilters={selectedFilters}
          toggleFilter={toggleFilter}
          filterCounts={filterCounts}
        />
      </div>

      {/* Styles */}
      <style>{`
        /* -----------------------
           Theme tokens
        ----------------------- */
        :root { 
          color-scheme: light dark;
          /* Tailwind parity — light mode */
          --bg: #ffffff;          /* bg-white */
          --fg: #111827;          /* gray-900 */
          --card-bg: #ffffff;     /* white */
          --border: #e5e7eb;      /* gray-200 */
          --muted: #6b7280;       /* gray-500 */
          --brand: #7A0019;       /* sc-red */
        }
        :root.dark {
          /* Tailwind parity — dark mode */
          --bg: #111827;          /* gray-900 */
          --fg: #e5e7eb;          /* gray-200 text */
          --card-bg: #4b5563;     /* gray-600 */
          --border: #374151;      /* gray-700 */
          --muted: #9ca3af;       /* gray-400 */
        }

        /* -----------------------
           Layout
        ----------------------- */
        .search-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          padding: 40px;
          background: var(--bg);
          color: var(--fg);
          position: relative;
        }
        .header {
          display: flex; align-items: center; margin-bottom: 30px;
          border-bottom: 2px solid var(--brand); padding-bottom: 10px;
        }
        .logo { width: 50px; margin-right: 15px; }
        .header__title { font-size: 28px; font-weight: 700; color: var(--fg); border-left: 2px solid var(--brand); padding-left: 15px; }

        .spacer { height: 40px; }

        .mobile-filter-toggle { margin-bottom: 20px; display: none; }
        .toggle-filters { width: 100%; max-width: 240px; margin: 0 auto; }

        .search-content { display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; }
        .left { flex: 1; min-width: 300px; max-width: 1000px; }
        .section-title { color: var(--brand); font-size: 28px; font-weight: 700; margin-bottom: 20px; text-align: left; }

        /* Cards */
        .search-card { padding: 20px; border: 1px solid var(--border); border-radius: 16px; background: var(--card-bg); box-shadow: none; cursor: pointer; transition: transform .2s ease, box-shadow .2s ease; }
        .search-card:hover { box-shadow: 0 4px 8px rgba(0,0,0,.1); transform: translateY(-2px); }

        /* Buttons */
        .btn { padding: 6px 12px; font-size: 16px; border-radius: 6px; font-weight: 700; cursor: pointer; border: 2px solid var(--brand); background: transparent; color: var(--brand); }
        .btn:disabled { cursor: default; opacity: .6; }
        .btn--brand { background: var(--brand); color: #fff; }
        .btn--ghost { background: transparent; color: var(--brand); }

        .pagination { margin-top: 30px; display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; }
        .ellipsis { padding: 6px 12px; color: var(--muted); }

        /* Filter buttons in RefineResultsPanel can use .filter-btn + .active */
        .filter-btn.active { background: var(--brand) !important; color: #fff !important; }

        /* BW support via system */
        @media (forced-colors: active) {
          html, body, .search-root { filter: grayscale(1) !important; }
        }
        @media (prefers-contrast: more) {
          html, body, .search-root { filter: grayscale(1) !important; }
        }

        /* Manual/URL BW toggle */
        :root.bw html,
        :root.bw body,
        :root.bw .search-root,
        html.bw,
        body.bw,
        .search-root.bw {
          filter: grayscale(1) !important;
        }
        /* Avoid double filter making text blurry */
        :root.bw .search-root * { filter: none; }

        /* Responsive */
        @media (max-width: 768px) {
          .refine-results-desktop { display: none !important; }
          .mobile-filter-toggle { display: flex; flex-direction: column; align-items: center; }
          .search-content { justify-content: center; }
          .section-title { text-align: left !important; }
          .refine-results-mobile { width: 100%; max-width: 600px; margin: 0 auto; }
        }
        @media (min-width: 769px) {
          .mobile-filter-toggle { display: none; }
          .refine-results-mobile { display: none !important; }
        }

        /* BW floating switch (dev aid) */
        .bw-switch { position: fixed; right: 12px; bottom: 12px; padding: 8px 10px; border-radius: 10px; border: 2px solid var(--brand); background: var(--card-bg); font-weight: 700; cursor: pointer; z-index: 9999; }
      `}</style>

      {/* B/W switch (optional in production) */}
      <button aria-label="Toggle Black & White" className="bw-switch btn" onClick={toggleBW} title="Toggle Black & White">B/W</button>
    </div>
  );
}

export default SearchPage;
