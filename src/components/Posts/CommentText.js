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
      <p className="text-gray-600 dark:text-gray-200 font-normal text-sm sm:text-base pr-4 break-words whitespace-pre-wrap">
        {needCollapse ? displayedText : text}
        {needCollapse && !expanded && (
          <>
            {/*  Added space between "..." and "Read More" */}
            ... <span
              onClick={() => setExpanded(true)}
              //  Adjusted text color in light mode for better contrast
              className="italic cursor-pointer inline text-gray-400 dark:text-gray-400"
            >
              Read More
            </span>
          </>
        )}
        {needCollapse && expanded && (
          <span
            onClick={() => setExpanded(false)}
            className="italic cursor-pointer inline ml-2 text-gray-400 dark:text-gray-400"
          >
            Read Less
          </span>
        )}
      </p>
    </div>
  );
};

export default CommentText;
