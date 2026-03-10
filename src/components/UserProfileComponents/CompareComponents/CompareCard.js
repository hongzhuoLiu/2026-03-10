import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../../API";

function linkOrNA(url) {
  return url ? (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="underline hover:no-underline text-sc-red dark:text-white"
    >
      Visit&nbsp;Website
    </a>
  ) : (
    "N/A"
  );
}


export default function CompareCard({ itemId, itemType }) {
  const [data, setData] = useState(null);


  useEffect(() => {
    (async () => {
      let url = "";

      /* --------- Universities --------- */
      if (itemType === "university") {
        url =
          `${BASE_URL}/api/university-pages/${itemId}` +
          "?fields[0]=universityName&fields[1]=universityLocation&fields[2]=universityRating&fields[3]=webpage" +
          "&populate=universityLogo,universityHeaderImage";
      }

      /* --------- Program --------- */
      if (itemType === "program") {
        url =
          `${BASE_URL}/api/program-pages/${itemId}` +
          "?fields[0]=programName&fields[1]=programAcronym&fields[2]=programGraduationLevel&fields[3]=programRating&fields[4]=ATAR&fields[5]=webpage" +
          "&populate=university_page";
      }

      /* --------- Subject --------- */
      if (itemType === "subject") {
        url =
          `${BASE_URL}/api/subject-pages/${itemId}` +
          "?fields[0]=subjectName&fields[1]=subjectCode&fields[2]=subjectGraduationLevel&fields[3]=subjectRating&fields[4]=webpage" +
          "&populate=university_page";
      }

      /* --------- DestinationPage --------- */
      if (itemType === "destination") {
        url =
          `${BASE_URL}/api/destination-pages/${itemId}` +
          "?fields[0]=destinationName&fields[1]=destinationLocation&fields[2]=destinationRating&fields[3]=webpage";
      }

      /* --------- Facility--------- */
      const facilityTypes = [
        "accommodation",
        "health",
        "fitness",
        "eateries",
        "clubs",
        "culture",
      ];
if (facilityTypes.includes(itemType)) {
  url =
    `${BASE_URL}/api/facilities/${itemId}` +
    "?fields[0]=facilityName" +
    "&fields[1]=facilityType" +
    "&fields[2]=facilityLocation" +
    "&fields[3]=facilityRating" +
    "&fields[4]=facilityLinks" +
    "&populate[university_page][fields][0]=universityName";
}


      if (!url) return;

      try {
        const res = await fetch(url);
        const json = await res.json();
        setData(json.data?.attributes ?? null);
      } catch (err) {
        console.error("CompareCard fetch error:", err);
      }
    })();
  }, [itemId, itemType]);

  if (!data) {
    return (
      <div className="text-center p-4 text-gray-500 dark:text-gray-400">
        Loading…
      </div>
    );
  }


  const cardBase = `
    w-full max-w-xs h-full flex flex-col text-left
    border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-md
    bg-white dark:bg-gray-700 text-black dark:text-white
    p-4 text-sm sm:text-base transition-colors duration-300 overflow-hidden
  `;
  const rowBase = `flex flex-col sm:table-row border-b border-gray-300 dark:border-gray-600`;
  const labelCss = `font-bold block sm:table-cell`;
  const valCss = `block sm:table-cell break-words`;

  let title = "";
  let rows = [];

  /* ========== Universities ========== */
  if (itemType === "university") {
    title = data.universityName;
    rows = [
      {
        label: "Location",
        value: data.universityLocation,
        heightClass: "h-24 line-clamp-6",
      },
      {
        label: "Rating",
        value: data.universityRating?.toFixed?.(1) ?? data.universityRating,
        heightClass: "h-11 line-clamp-1",
      },
      {
        label: "Website",
        value: data.webpage,
        isLink: true,
        heightClass: "h-11 line-clamp-1",
      },
    ];

    /* ----- Header & Logo ----- */
    const logo =
      data.universityLogo?.data?.attributes?.formats?.thumbnail?.url
        ? `${BASE_URL}${data.universityLogo.data.attributes.formats.thumbnail.url}`
        : "/placeholder-image.jpg";
    const header =
      data.universityHeaderImage?.data?.attributes?.formats?.large?.url
        ? `${BASE_URL}${data.universityHeaderImage.data.attributes.formats.large.url}`
        : "/placeholder-header-image.jpg";

    return (
      <div className={cardBase}>
        <div
          className="relative h-48 sm:h-64 bg-cover bg-center"
          style={{ backgroundImage: `url(${header})` }}
        >
          <div className="absolute top-2 right-2">
            <img
              src={logo}
              alt={title}
              className="w-16 h-20 sm:w-20 sm:h-20 object-contain rounded-full bg-white bg-opacity-50 p-1 sm:p-2"
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2 sm:p-4">
            <h3 className="text-xl sm:text-2xl font-bold text-white">{title}</h3>
          </div>
        </div>

        <div className="sm:table w-full mt-4 flex-grow">
          {rows.map(({ label, value, isLink, heightClass }) => (
            <div key={label} className={`${rowBase} ${heightClass}`}>
              <span className={labelCss}>{label}:</span>
              <span className={`${valCss} overflow-hidden ${heightClass}`}>
                {isLink ? linkOrNA(value) : value ?? "N/A"}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ========== Destination ========== */
  if (itemType === "destination") {
    title = data.destinationName;
    rows = [
      {
        label: "Location",
        value: data.destinationLocation,
        heightClass: "h-24 line-clamp-6",
      },
      {
        label: "Rating",
        value: data.destinationRating ?? "N/A",
        heightClass: "h-11 line-clamp-1",
      },
      {
        label: "Website",
        value: data.webpage,
        isLink: true,
        heightClass: "h-11 line-clamp-1",
      },
    ];
  }

  /* ========== Program ========== */
  if (itemType === "program") {
    title = data.programName;
    rows = [
      {
        label: "Code",
        value: data.programAcronym,
        heightClass: "h-11 line-clamp-1",
      },
      {
        label: "University",
        value: data.university_page?.data?.attributes?.universityName,
        heightClass: "h-[3.75rem] line-clamp-3",
      },
      {
        label: "Level",
        value: data.programGraduationLevel,
        heightClass: "h-11 line-clamp-1",
      },
      {
        label: "Rating",
        value: data.programRating,
        heightClass: "h-11 line-clamp-1",
      },
      {
        label: "ATAR",
        value: data.ATAR,
        heightClass: "h-11 line-clamp-1",
      },
      {
        label: "Website",
        value: data.webpage,
        isLink: true,
        heightClass: "h-11 line-clamp-1",
      },
    ];
  }

  /* ========== Subject ========== */
  if (itemType === "subject") {
    title = data.subjectName;
    rows = [
      {
        label: "Code",
        value: data.subjectCode,
        heightClass: "h-12 line-clamp-1",
      },
      {
        label: "University",
        value: data.university_page?.data?.attributes?.universityName,
        heightClass: "h-[3.75rem] line-clamp-3",
      },
      {
        label: "Level",
        value: data.subjectGraduationLevel,
        heightClass: "h-11 line-clamp-1",
      },
      {
        label: "Rating",
        value: data.subjectRating,
        heightClass: "h-9 line-clamp-1",
      },
      {
        label: "Website",
        value: data.webpage,
        isLink: true,
        heightClass: "h-9 line-clamp-1",
      },
    ];
  }


  const facilityTypes = [
    "accommodation",
    "health",
    "fitness",
    "eateries",
    "clubs",
    "culture",
  ];
if (facilityTypes.includes(itemType)) {
  title = data.facilityName;

  // 1) 定义我们希望显示的所有字段
  const defs = [
    { field: "facilityType", label: "Type" },
    {
      field: "university_page.data.attributes.universityName",
      label: "University"
    },
    { field: "facilityLocation", label: "Campus" },
    { field: "facilitySuburb", label: "Suburb" },
    { field: "facilityRating", label: "Rating" },
    { field: "facilityLinks", label: "Website", isLink: true },
  ];


  rows = defs
    .map(({ field, label, isLink }) => {

      const value = field.split(".").reduce((obj, key) => obj?.[key], data);
      if (value === undefined || value === null) return null;
      return {
        label,
        value: isLink ? linkOrNA(value) : value,
      };
    })
    .filter(Boolean);
}



  return (
    <div className={cardBase}>
      <h3 className="text-xl sm:text-2xl font-bold mb-2">{title}</h3>

      <div className="sm:table w-full mt-2 flex-grow">
        {rows.map(({ label, value, isLink, heightClass }) => (
          <div key={label} className={`${rowBase} ${heightClass}`}>
            <span className={labelCss}>{label}:</span>
            <span className={`${valCss} overflow-hidden ${heightClass}`}>
              {isLink ? linkOrNA(value) : value ?? "N/A"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
