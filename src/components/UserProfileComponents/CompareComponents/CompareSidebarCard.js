import React, { useEffect, useState } from "react";
import CrossBtnLight from "../../../images/icons/CrossLight.png";
import { BASE_URL } from "../../../API";


const typeConfig = {
  /* ① university */
  university: {
    url: (id) =>
      `${BASE_URL}/api/university-pages/${id}?fields[0]=universityName&populate[universityLogo][fields][0]=url`,
    nameField: "universityName",
    needLogo: true,
    needUniversityId: false,
  },

  /* ② program */
  program: {
    url: (id) =>
      `${BASE_URL}/api/program-pages/${id}?fields[0]=programName&populate[university_page][fields][0]=id`,
    nameField: "programName",
    needLogo: false,
    needUniversityId: true,
  },

  /* ③ subject */
  subject: {
    url: (id) =>
      `${BASE_URL}/api/subject-pages/${id}?fields[0]=subjectName&populate[university_page][fields][0]=id`,
    nameField: "subjectName",
    needLogo: false,
    needUniversityId: true,
  },

  /* ④ destination —— collection slug = destination-pages */
  destination: {
    url: (id) =>
      `${BASE_URL}/api/destination-pages/${id}?fields[0]=destinationName`,
    nameField: "destinationName",
    needLogo: false,
    needUniversityId: false,
  },

  /* ⑤ facility */
  accommodation: {
    url: (id) =>
      `${BASE_URL}/api/facilities/${id}?fields[0]=facilityName&populate[university_page][fields][0]=id`,
    nameField: "facilityName",
    needLogo: false,
    needUniversityId: true,
  },
};


["health", "fitness", "eateries", "clubs", "culture"].forEach(
  (t) => (typeConfig[t] = { ...typeConfig.accommodation })
);

/* =================================================================== */
export default function CompareSidebarCard({
  itemId,
  itemType,
  onRemove,
  onItemClick,
}) {
  const cfg = typeConfig[itemType];
  const [itemData, setItemData] = useState(null);


  useEffect(() => {
    if (!cfg) return;
    (async () => {
      try {
        const res = await fetch(cfg.url(itemId));
        const json = await res.json();
        setItemData(json.data); 
      } catch (err) {
        console.error("Error fetching compare card:", err);
      }
    })();
  }, [itemId, itemType]);

  if (!itemData) return <div>Loading...</div>;


  const attrs = itemData.attributes;
  const itemName = attrs?.[cfg.nameField] || "Unknown";


  const logoUrl =
    cfg.needLogo && attrs.universityLogo?.data?.attributes?.url
      ? BASE_URL + attrs.universityLogo.data.attributes.url
      : null;


  const handleClick = (e) => {
    e.stopPropagation();
    if (cfg.needUniversityId) {
      const uniId = attrs.university_page?.data?.id;
      onItemClick(itemId, itemType, uniId);
    } else {
      onItemClick(itemId, itemType);
    }
  };


  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4 relative">

      <img
        src={CrossBtnLight}
        alt="Remove"
        className="absolute top-2 right-2 h-6 cursor-pointer"
        onClick={() => onRemove(itemId, itemType)}
      />

      <div className="flex flex-col items-center">
        {logoUrl && (
          <img
            src={logoUrl}
            alt={itemName}
            className="w-20 h-20 object-contain rounded-full bg-white bg-opacity-50 p-2 mb-2"
          />
        )}

        <h3
          className="font-bold text-lg text-center cursor-pointer hover:underline"
          onClick={handleClick}
        >
          {itemName}
        </h3>
      </div>
    </div>
  );
}
