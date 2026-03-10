import React from "react";
import BookmarkCard from "./BookmarkCard";

// BookmarkGrid.js

const facilityTypeMap = {
  accommodation: 'Accommodation',
  health: 'Health',
  fitness: 'Fitness',
  eateries: 'Eateries',
  clubs: 'Clubs & Societies',
  culture: 'Culture & Religion',
};

const BookmarkGrid = ({
  activeCategory, // "universities", "programs", or "subjects"
  userUniversityLikes,
  userProgramLikes,
  userSubjectLikes, userFacilityBookmarks,
  userDestinationLikes,

  onAddToCompare,
  compareList,
  compareType,
  onUniversityClick,
  onProgramClick,
  onSubjectClick, onFacilityClick,
  onDestinationClick

}) => {
  // const totalBookmarks = [
  //     ...userUniversityLikes.map(like => ({
  //         id: like.id,
  //         type: 'university',
  //         name: like.attributes?.universityName || "Unknown University",
  //         universityId: like.id,
  //         onClick: onUniversityClick,
  //     })),
  //     ...userProgramLikes.map(like => ({
  //         id: like.id,
  //         type: 'program',
  //         name: like.attributes?.programName || "Unknown Program",
  //         universityId: like.attributes?.universityId,
  //         onClick: onProgramClick,
  //     })),
  //     ...userSubjectLikes.map(like => ({
  //         id: like.id,
  //         type: 'subject',
  //         name: like.attributes?.subjectName || "Unknown Subject",
  //         universityId: like.attributes?.universityId,
  //         onClick: onSubjectClick,
  //     })),
  // ];
  // const bookmarks = totalBookmarks.filter(item => item.type === activeCategory);
  let bookmarks = [];
  switch (activeCategory) {
    case "universities":
      bookmarks = userUniversityLikes.map((like) => ({
        id: like.id,
        type: "university",
        name: like.attributes?.universityName || "Unknown University",
        universityId: like.id,
        onClick: onUniversityClick,
      }));
      break;
    case "programs":
      bookmarks = userProgramLikes.map((like) => ({
        id: like.id,
        type: "program",
        name: like.attributes?.programName || "Unknown Program",
        universityId: like.attributes?.universityId,
        onClick: onProgramClick,
      }));
      break;
    case "subjects":
      bookmarks = userSubjectLikes.map((like) => ({
        id: like.id,
        type: "subject",
        name: like.attributes?.subjectName || "Unknown Subject",
        universityId: like.attributes?.universityId,
        onClick: onSubjectClick,
      }));
      break;
    case "destinations":
      bookmarks = userDestinationLikes.map((like) => ({
        id: like.id,
        type: "destination",
        name: like.attributes?.destinationName || "Unknown Destination",
        universityId: null, // Not required for destinations
        onClick: onDestinationClick,
      }));
      break;



    case "accommodation":
    case "health":
    case "fitness":
    case "eateries":
    case "clubs":
    case "culture":
      bookmarks = userFacilityBookmarks
          .filter(
              (like) =>
                  like.facilityType?.toLowerCase() ===
                  facilityTypeMap[activeCategory].toLowerCase()
          )
          .map((like) => ({
            id: like.id,
            type: activeCategory,
            name: like.facilityName || "Unknown Facility",
            universityId: like.universityPageId,
            onClick: onFacilityClick,
          }));
      break;
    default:
      bookmarks = [];
  }

  if (bookmarks.length === 0) {
    return <div className="text-gray-500 text-xl py-10">No bookmarks found.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-8">
      {bookmarks.map((item, index) => {
        const isInCompareList = compareList.some(
          (compareItem) =>
            compareItem.id === item.id && compareItem.type === item.type
        );
        return (
          <BookmarkCard
            key={`${item.type}-${item.id}`}
            id={item.id}
            type={item.type}
            index={index + 1}
            name={item.name}
            universityId={item.universityId}
            onAddToCompare={onAddToCompare}
            isInCompareList={isInCompareList}
            compareListCount={compareList.length}
            onItemClick={item.onClick}
          />
        );
      })}
    </div>
  );
};

export default BookmarkGrid;
