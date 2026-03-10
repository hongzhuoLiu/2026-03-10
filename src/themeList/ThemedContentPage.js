import React, {useState, useMemo, useEffect} from 'react';

import PageHeading from '../components/Elements/PageHeading';
import SelectButtonGroup from '../components/Elements/SelectButtonGroup';
import GridItemCard from './GridItemCard.js';
import ListItemRow from './ListItemRow.js';  
import GridIcon from '../images/icons/Grid.png';
import ListIcon from '../images/icons/List.png';
import themeIcons from './themeIcons.js';

import {facilitiesApi} from '../app/service/facilitiesApi';
import UniversitiesSelection from "../components/ProgramsAndSubjectsLoad/UniversitiesSelection";
import AddContentSearch from "../components/PlaceSearchBox/AddContentSearch";
import {useDispatch, useSelector} from "react-redux";
import {setUniversitySelected} from "../app/features/filteringSubjectsAndPrograms/filteringSubjectsAndProgramsReducer";


function ThemedContentPage({ title }) {
    const [sortOption, setSortOption] = useState('alphabetical');
    const [displayOption, setDisplayOption] = useState('grid');
    const [allFacilities, setAllFacilities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const selectedUniversityId = useSelector(
        (state) => state.filteringSubjectsAndPrograms.universitySelected
    );
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setUniversitySelected()); // reset to "All Universities" or default
    }, [title, dispatch]);

    useEffect(() => {
        const fetchAllFacilities = async () => {
            try {
                let page = 1;
                const pageSize = 100;
                let allData = [];
                let totalPages = 1;

                do {
                    const response = await dispatch(
                        facilitiesApi.endpoints.getFacilities.initiate({ page, pageSize })
                    ).unwrap();

                    allData = [...allData, ...response.data];
                    totalPages = response.meta.pageCount;
                    page++;
                } while (page <= totalPages);

                setAllFacilities(allData);
                setIsLoading(false);
            } catch (err) {
                console.error("Error fetching all facilities:", err);
                setIsError(true);
                setIsLoading(false);
            }
        };

        fetchAllFacilities();
    }, [dispatch]);

    const sortOptions = [
        { text: "Alphabetical", type: "alphabetical" },
        { text: "Highest rating", type: "highestRating" },
        { text: "Lowest rating", type: "lowestRating" }
       ];
    const displayOptions = [
        { image: GridIcon, type: "grid" },
        { image: ListIcon, type: "list" }
       ];

    const processedData = useMemo(() => {
        console.log(`[${title}] useMemo: Processing data. isLoading: ${isLoading}, isError: ${isError}`);

        if (isLoading || isError || !Array.isArray(allFacilities)) {
          console.log(`[${title}] useMemo: Returning [] due to loading/error/invalid data. allFacilities is Array?`, Array.isArray(allFacilities));
          return [];
        }
        console.log(`[${title}] useMemo: Raw data from API (count):`, allFacilities.length);

        const themeFilteredData = allFacilities.filter(item => {
            const itemType = item.facilityType?.toLowerCase();
            const titleLower = title?.toLowerCase();
            const matchesTheme = itemType === titleLower;

            const matchesUniversity =
                !selectedUniversityId || selectedUniversityId === 0
                    ? true
                    : item.universityPageId === selectedUniversityId;

            return matchesTheme && matchesUniversity;
        });
        console.log(`[${title}] useMemo: Data after theme filter (count):`, themeFilteredData.length);
        if (allFacilities.length > 0 && themeFilteredData.length === 0) {
             console.warn(`[${title}] useMemo: No data matched facilityType "${title}". Check Strapi 'facilityType' field values and the 'title' prop case-insensitively.`);
        }

        return [...themeFilteredData].sort((a, b) => {
            const nameA = a?.facilityName || '';
            const nameB = b?.facilityName || '';
            const ratingA = a?.facilityRating ?? 0;
            const ratingB = b?.facilityRating ?? 0;
            switch (sortOption) {
                case 'highestRating': return ratingB - ratingA || nameA.localeCompare(nameB);
                case 'lowestRating': return ratingA - ratingB || nameA.localeCompare(nameB);
                case 'alphabetical': default: return nameA.localeCompare(nameB);
            }
        });
    }, [allFacilities, isLoading, isError, title, sortOption, selectedUniversityId]);

    const currentIcon = themeIcons[title] || null;

    const themeIconDarkFilterClasses = "dark:filter dark:invert dark:grayscale";

    // Dynamic SEO injection for Themed Content pages
    useEffect(() => {
        const titleLower = title?.toLowerCase();
        
        let pageTitle, pageDescription, keywords;
        
        if (titleLower === 'accommodation') {
            pageTitle = 'Explore accommodation options on your campus | Students Choice';
            pageDescription = 'Discover the best accommodation options on campus. Compare student housing, dormitories, apartments, and residential facilities. Find detailed ratings, reviews, and information about campus accommodation.';
            keywords = 'campus accommodation, student housing, dormitories, university accommodation, student apartments, residential facilities, campus living';
        } else if (titleLower === 'fitness') {
            pageTitle = 'Explore fitness providers on your campus | Students Choice';
            pageDescription = 'Discover the best fitness providers on campus. Compare gyms, sports facilities, fitness centers, and recreational services. Find detailed ratings, reviews, and information about campus fitness options.';
            keywords = 'campus fitness, gym facilities, sports centers, university fitness, student gym, recreational services, campus sports';
        } else if (titleLower === 'health') {
            pageTitle = 'Explore student friendly health providers near you | Students Choice';
            pageDescription = 'Discover student-friendly health providers near your campus. Compare medical centers, clinics, health services, and healthcare facilities. Find detailed ratings, reviews, and information about campus health options.';
            keywords = 'campus health, medical centers, student healthcare, university clinics, health services, campus medical, student health';
        } else if (titleLower === 'clubs & societies') {
            pageTitle = 'Explore student clubs & societies near you | Students Choice';
            pageDescription = 'Discover student clubs and societies near your campus. Explore communities, events, and opportunities to connect with like-minded peers across interests and disciplines.';
            keywords = 'student clubs, student societies, campus clubs, university societies, student communities, campus life, student organisations';
        } else if (titleLower === 'culture & religion') {
            pageTitle = 'Explore cultural & religious organisations near you | Students Choice';
            pageDescription = 'Discover cultural and religious organisations near your campus. Find communities, places of worship, cultural associations, and events that enrich your campus life.';
            keywords = 'cultural organisations, religious organisations, campus religion, cultural associations, places of worship, campus communities';
        } else {
            // Default SEO for other themed pages
            pageTitle = `${title} | Students Choice`;
            pageDescription = `Explore ${title.toLowerCase()} options on campus. Find detailed information, ratings, and reviews about ${title.toLowerCase()} facilities and services.`;
            keywords = `${title.toLowerCase()}, campus facilities, university services, student resources`;
        }

        const origin = window.location.origin;
        const canonicalUrl = `${origin}/${titleLower}`;

        const setOrCreateMetaByName = (name, content) => {
            let tag = document.querySelector(`meta[name="${name}"]`);
            if (!tag) {
                tag = document.createElement("meta");
                tag.setAttribute("name", name);
                document.head.appendChild(tag);
            }
            tag.setAttribute("content", content);
        };

        const setOrCreateMetaByProperty = (property, content) => {
            let tag = document.querySelector(`meta[property="${property}"]`);
            if (!tag) {
                tag = document.createElement("meta");
                tag.setAttribute("property", property);
                document.head.appendChild(tag);
            }
            tag.setAttribute("content", content);
        };

        const setOrCreateLinkCanonical = (href) => {
            let link = document.querySelector('link[rel="canonical"]');
            if (!link) {
                link = document.createElement("link");
                link.setAttribute("rel", "canonical");
                document.head.appendChild(link);
            }
            link.setAttribute("href", href);
        };

        const setJsonLd = (id, json) => {
            let script = document.getElementById(id);
            if (!script) {
                script = document.createElement("script");
                script.id = id;
                script.type = "application/ld+json";
                document.head.appendChild(script);
            }
            script.textContent = JSON.stringify(json);
        };

        // Title
        document.title = pageTitle;

        // Meta description and robots
        setOrCreateMetaByName("description", pageDescription);
        setOrCreateMetaByName("keywords", keywords);
        setOrCreateMetaByName("robots", "index,follow");

        // Canonical
        setOrCreateLinkCanonical(canonicalUrl);

        // Open Graph
        setOrCreateMetaByProperty("og:type", "website");
        setOrCreateMetaByProperty("og:site_name", "StudentsChoice");
        setOrCreateMetaByProperty("og:title", pageTitle);
        setOrCreateMetaByProperty("og:description", pageDescription);
        setOrCreateMetaByProperty("og:url", canonicalUrl);
        setOrCreateMetaByProperty("og:image", `${origin}/og.png`);

        // Twitter
        setOrCreateMetaByName("twitter:card", "summary_large_image");
        setOrCreateMetaByName("twitter:title", pageTitle);
        setOrCreateMetaByName("twitter:description", pageDescription);
        setOrCreateMetaByName("twitter:image", `${origin}/og.png`);

        // JSON-LD: CollectionPage for themed content
        setJsonLd(`seo-jsonld-${titleLower}`, {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": `${title} at StudentsChoice`,
            "url": canonicalUrl,
            "description": pageDescription,
            "isPartOf": {
                "@type": "WebSite",
                "name": "StudentsChoice",
                "url": origin
            }
        });

        return undefined;
    }, [title]);

     return (
         <div className="m-0 overflow-x-hidden bg-white dark:bg-gray-900 min-h-screen">
             {/* 1. title */}
             <PageHeading pageName={title} icon={currentIcon} iconClassName={themeIconDarkFilterClasses}/>
             <div className="primaryPageSizing mx-auto px-3 sm:px-6 lg:px-8">
                 <UniversitiesSelection disablePrimarySizing/>
                 <div className="items-center w-full">
                     <div className="titleTextSecondary">Search by location</div>
                     <AddContentSearch
                         className="w-full"
                         inputClassName="editInputStyling"
                     />
                 </div>

                 <div className="flex flex-col sm:flex-row mt-[2.5rem] items-center sm:items-start justify-center sm:justify-between gap-4">
                     <div className="flex items-center">
                         <h2 className="hidden sm:block text-left text-3xl font-bold ml-3 text-sc dark:text-gray-300">Sort by</h2>
                         <div className="flex justify-center mx-auto">
                             <SelectButtonGroup
                                 options={sortOptions}
                                 selectedOption={sortOption}
                                 onOptionChange={setSortOption}
                             />
                         </div>

                     </div>
                     <div>
                         <SelectButtonGroup
                             options={displayOptions}
                             selectedOption={displayOption}
                             onOptionChange={setDisplayOption}
                             buttonWidth={50}
                         />
                     </div>
                 </div>
                 <div className="mt-5">
                     <div className={`w-full ${
                         displayOption === 'grid'
                             ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4' // 手机默认 1 列
                             : 'flex flex-col gap-3'
                     }`}>
                         {isLoading ? ( <p className="...">Loading...</p> )
                             : isError ? ( <p className="...">Error...</p> )
                                 : Array.isArray(processedData) && processedData.length > 0 ? (
                                     processedData.map(item => ( displayOption === 'grid' ? <GridItemCard key={item?.id} item={item} /> : <ListItemRow key={item?.id} item={item} /> ))
                                 ) : ( <p className="text-sc-red dark:text-gray-200 text-2xl pl-3 pt-5 font-bold">No Results</p> )}
                     </div>
                 </div>

             </div>
         </div>
     );
 }
 

export default ThemedContentPage;