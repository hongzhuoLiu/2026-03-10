import React from 'react';


const BookmarkCard = ({ id, type, index, name, universityId, onAddToCompare, isInCompareList, compareListCount, onItemClick }) => {
    const displayName = name || "Unknown Item";
    const isCompareListFull = compareListCount >= 3;

    const handleItemClick = (event) => {
        event.stopPropagation();
        const isSimpleClickType = ['university', 'destination', 'accommodation', 'health', 'fitness', 'eateries', 'clubs', 'culture'].includes(type);


        if (isSimpleClickType) {
            onItemClick(id);
        } else {
            onItemClick(universityId, id);
        }
    };

    return (
        <div className="p-5 mb-4 rounded-md shadow-lg relative flex flex-col 
        justify-between bg-white dark:bg-gray-700 text-black dark:text-white" onClick={handleItemClick}>
            <div>
                <div className="text-xl mb-2 cursor-pointer hover:underline">
                    {displayName}
                </div>
            </div>
            <div className="flex justify-end mt-4">
                <button
                    className={`px-4 py-2 rounded border-2 ${
                        isInCompareList
                            ? "bg-white dark:bg-gray-700 text-black dark:text-white border-black dark:border-white"
                            : isCompareListFull
                            ? "bg-gray-400 text-white border-transparent"
                            : "bg-sc-red text-white border-transparent"
                    } hover:bg-white hover:text-black hover:border-black
                    dark:hover:bg-gray-700 dark:hover:text-white
                     focus:bg-white focus:text-black focus:border-black
                     dark:focus:bg-gray-700 dark:focus:text-white`
                    }
                    onClick={(e) => {
                        e.stopPropagation();
                        onAddToCompare(id, type);
                    }}
                    disabled={!isInCompareList && isCompareListFull}
                >
                    {isInCompareList ? "Remove" : "Add to Compare"}
                </button>
            </div>
        </div>
    );
};

export default BookmarkCard;
