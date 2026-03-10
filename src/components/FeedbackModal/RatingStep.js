const RatingStep = ({ rating, onRatingChange }) => (
  <>
    <h2 className="text-lg font-semibold mt-4 mb-2">
      How would you rate your experience on Students Choice?
    </h2>
    <div className="flex space-x-2">
      {[1,2,3,4,5,6,7,8,9,10].map((num) => (
        <button
          key={num}
          type="button"
          className={`
            p-2 border rounded transition
            ${
              rating === num
                ? 'bg-sc-red text-white border-sc-red'
                : 'bg-white text-gray-900 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'
            }
          `}
          onClick={() => onRatingChange(num)}
        >
          {num}
        </button>
      ))}
    </div>
  </>
);

export default RatingStep;
