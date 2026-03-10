// src/pages/SearchPage/components/SearchBar.js
import React, { useEffect, useRef, useState } from "react";

export default function SearchBar({
  inputValue,
  suggestions = [],
  showSuggestions = false,
  onInputChange,
  onSuggestionClick,
  onInputBlur,
  onSearch,
}) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const listRef = useRef(null);

  // Keep consistent with SearchPage's left results column width
  const MAX_WIDTH = 1000; // ← Align with results area maxWidth: '1000px'

  useEffect(() => {
    setActiveIndex(-1);
  }, [suggestions]);

  const handleKeyDown = (e) => {
    const n = suggestions.length;
    if (e.key === "ArrowDown" && n > 0) {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % n);
    } else if (e.key === "ArrowUp" && n > 0) {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + n) % n);
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < n) {
        e.preventDefault();
        onSuggestionClick?.(suggestions[activeIndex].label);
      } else {
        onSearch?.();
      }
    } else if (e.key === "Escape") {
      setActiveIndex(-1);
      onInputBlur?.();
    }
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* Outer centered container, width matches results area */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            gap: 8,
            width: "100%",
            maxWidth: MAX_WIDTH,
          }}
        >
          <input
            value={inputValue}
            onChange={onInputChange}
            onKeyDown={handleKeyDown}
            onBlur={onInputBlur}
            placeholder="Search universities, programs, destinations..."
            style={{
              flex: 1,
              height: 44,
              padding: "0 12px",
              borderRadius: 8,
              border: "1px solid #ccc",
              outline: "none",
            }}
          />
          <button
            type="button"
            onClick={onSearch}
            style={{
              height: 44,
              padding: "0 14px",
              borderRadius: 8,
              border: "2px solid #7A0019",
              background: "#7A0019",
              color: "white",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Search
          </button>
        </div>
      </div>

      {/* Suggestions dropdown: same width and centered below input */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={listRef}
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            top: 50,
            width: "100%",
            maxWidth: MAX_WIDTH,
            background: "white",
            border: "1px solid #e5e5e5",
            borderRadius: 8,
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            zIndex: 50,
            overflow: "hidden",
          }}
        >
          {suggestions.map((s, idx) => (
            <div
              key={`${s.type}-${s.id}-${idx}`}
              onMouseDown={() => onSuggestionClick?.(s.label)} // Using mousedown to prevent blur from triggering first
              onMouseEnter={() => setActiveIndex(idx)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                cursor: "pointer",
                background:
                  activeIndex === idx ? "rgba(122,0,25,0.08)" : "transparent",
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  padding: "2px 6px",
                  borderRadius: 6,
                  border: "1px solid #ddd",
                  textTransform: "capitalize",
                  color: "#555",
                  minWidth: 72,
                  textAlign: "center",
                }}
              >
                {s.type}
              </span>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontWeight: 600 }}>{s.label}</div>
                {s.subtitle ? (
                  <div style={{ fontSize: 12, color: "#666" }}>{s.subtitle}</div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}