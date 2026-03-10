import React, { useState } from 'react';

const CommentText = ({ text }) => {
  const [expanded, setExpanded] = useState(false);

  
  // Collapse text if it's longer than 400 characters
  const needCollapse = text.length > 400;

  const displayedText = expanded
    ? text
    : text.slice(0, 400);

  return (
    <div>
      <p className="text-gray-700 dark:text-gray-300">
        {needCollapse ? displayedText : text}
        {needCollapse && !expanded && (
          <>
            ... <span
              onClick={() => setExpanded(true)}
              className="italic cursor-pointer inline text-gray-400 dark:text-gray-400"
            >
              Read More
            </span>
          </>
        )}
        {needCollapse && expanded && (
          <span
            onClick={() => setExpanded(false)}
            className="italic cursor-pointer inline ml-2 text-gray-500 dark:text-gray-400"
          >
            Read Less
          </span>
        )}
      </p>
    </div>
  );
};

export default CommentText;