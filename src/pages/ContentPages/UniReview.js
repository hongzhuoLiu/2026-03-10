import InteractionArea from '../../components/Posts/InteractionArea.js';

import React, { useEffect, useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BASE_URL } from "../../API.js";
import '../../index.js';
import BookmarkDarkIcon from '../../images/icons/bookmark-grey-200.png'
import BookmarkSelectedIcon from '../../images/icons/bookmark-selected.png'
import BookmarkIcon from '../../images/icons/bookmark-black.png'

//For fetching icons
import { useGetIconByIdQuery } from '../../app/service/iconsAPI.js';
import { useGetAllIconsQuery } from '../../app/service/iconsAPI.js';
import { getIconURL } from '../../app/service/iconsAPI.js';

import { useGetUserDetailsQuery, useUpdateUserProfileMutation } from '../../app/service/usersAPI.js';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../../app/features/authentication/AuthenticationReducer.js';
import UniversityReportFlow from "../../components/Report/UniversityReportFlow";
import { toggleUIState } from '../../app/features/ui/UIReducer';

import LinkIcon from "../../images/icons/link.png";
import LocationIcon from "../../images/icons/locationPin.png";

// main export
function UniReview() {
    const { idUniversity } = useParams(); // can be numeric id or slug
    const [university, setUniversity] = useState(null);
    const [resolvedUniversityId, setResolvedUniversityId] = useState(null);
    const [resolvedUniversitySlug, setResolvedUniversitySlug] = useState(null);
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { data: userDetails, refetch: refetchUserDetails } = useGetUserDetailsQuery();
    const [updateUserProfile] = useUpdateUserProfileMutation();
    const { data: starIconData, isError: isStarIconError, isLoading: isStarIconLoading } = useGetIconByIdQuery(12);

    const isLoggedIn = !!user;
    const isNumericId = useMemo(() => /^\d+$/.test(String(idUniversity)), [idUniversity]);

    const isBookmarked = useMemo(() => {
        if (!isLoggedIn || !resolvedUniversityId) return false;
        return userDetails?.userUniversityLikes?.some(uni => uni.id === resolvedUniversityId);
    }, [isLoggedIn, userDetails, resolvedUniversityId]);

    // Function to add bookmark
    const handleAddBookmark = async () => {
        if (!isLoggedIn || !resolvedUniversityId) return;

        try {
            const updatedLikes = [...(userDetails.userUniversityLikes || []), { id: resolvedUniversityId }];
            const updatedUser = { ...userDetails, userUniversityLikes: updatedLikes };
            await updateUserProfile(updatedUser).unwrap();
            dispatch(setCredentials(updatedUser));
            refetchUserDetails();
        } catch (error) {
            console.error('Error adding university like:', error);
        }
    };

    // Function to remove bookmark
    const handleRemoveBookmark = async () => {
        if (!isLoggedIn || !resolvedUniversityId) return;

        try {
            const updatedLikes = (userDetails.userUniversityLikes || []).filter(uni => uni.id !== resolvedUniversityId);
            const updatedUser = { ...userDetails, userUniversityLikes: updatedLikes };
            await updateUserProfile(updatedUser).unwrap();
            dispatch(setCredentials(updatedUser));
            refetchUserDetails();
        } catch (error) {
            console.error('Error removing university like:', error);
        }
    };
    
    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchData = async () => {
            try {
                const populate = "populate[universityLogo][fields][0]=name&populate[universityLogo][fields][1]=alternativeText&populate[universityLogo][fields][2]=formats&populate[universityHeaderImage][fields][0]=name&populate[universityHeaderImage][fields][1]=alternativeText&populate[universityHeaderImage][fields][2]=formats&populate[program_pages][fields][0]=programName&populate[program_pages][fields][1]=programRating&populate[subject_pages][fields][0]=subjectName&populate[subject_pages][fields][1]=subjectRating&populate[webpage][fields][0]=webpage&fields[0]=universityName&fields[1]=universityLocation&fields[2]=universityRating&fields[3]=slug";
                const url = isNumericId
                    ? `${BASE_URL}/api/university-pages/${idUniversity}?${populate}`
                    : `${BASE_URL}/api/university-pages?filters[slug][$eq]=${encodeURIComponent(idUniversity)}&${populate}`;

                const response = await fetch(url);
                if (!response.ok) {
                    console.warn('University fetch failed:', response.status, url);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const responseData = await response.json();

                // Normalize data shape
                const node = isNumericId ? responseData.data : (responseData.data && responseData.data[0]);
                if (node) {
                    const universityData = node;
                    const sanitizedData = {
                        ...universityData,
                        attributes: {
                            ...universityData.attributes,
                            program_pages: {
                                ...universityData.attributes?.program_pages,
                                data: universityData.attributes?.program_pages?.data?.filter(item => item && item.attributes && item.id) || []
                            },
                            subject_pages: {
                                ...universityData.attributes?.subject_pages,
                                data: universityData.attributes?.subject_pages?.data?.filter(item => item && item.attributes && item.id) || []
                            }
                        }
                    };
                    setUniversity(sanitizedData);
                    setResolvedUniversityId(universityData.id);
                    setResolvedUniversitySlug(universityData.attributes?.slug || String(idUniversity));
                } else {
                    console.error('Invalid university response structure:', responseData);
                    setUniversity(null);
                    setResolvedUniversityId(null);
                    setResolvedUniversitySlug(null);
                }
            } catch (error) {
                console.error('Error fetching university data:', error);
                setUniversity(null);
                setResolvedUniversityId(null);
                setResolvedUniversitySlug(null);
            }
        };

        fetchData();
    }, [idUniversity, isNumericId]);

    // Dynamic SEO injection for individual university pages
    useEffect(() => {
        if (!university) return;

        const universityName = university?.attributes?.universityName;
        const universityLocation = university?.attributes?.universityLocation;
        const universityRating = university?.attributes?.universityRating;
        
        const getUniversityDisplayName = (name) => {
            if (!name) return "Unknown University";
            const hasAbbreviation = name.includes('(') && name.includes(')');
            if (hasAbbreviation) return name;
            const commonAbbreviations = {
                'Royal Melbourne Institute of Technology': 'RMIT',
                'University of Melbourne': 'UoM',
                'Australian National University': 'ANU',
                'University of Sydney': 'USyd',
                'University of New South Wales': 'UNSW',
                'Monash University': 'Monash',
                'University of Queensland': 'UQ',
                'University of Western Australia': 'UWA',
                'University of Adelaide': 'UoA',
                'University of Technology Sydney': 'UTS',
                'Queensland University of Technology': 'QUT',
                'Griffith University': 'Griffith',
                'Deakin University': 'Deakin',
                'La Trobe University': 'La Trobe',
                'Swinburne University of Technology': 'Swinburne',
                'University of Wollongong': 'UOW',
                'Macquarie University': 'Macquarie',
                'Curtin University': 'Curtin',
                'University of South Australia': 'UniSA',
                'Flinders University': 'Flinders'
            };
            if (commonAbbreviations[name]) return `${name} (${commonAbbreviations[name]})`;
            for (const [fullName, abbrev] of Object.entries(commonAbbreviations)) {
                const parts = fullName.split(' ');
                if (name.includes(parts[0]) && name.includes(parts[1])) return `${name} (${abbrev})`;
            }
            return name;
        };
        
        const displayName = getUniversityDisplayName(universityName);
        const ratingText = universityRating ? ` | ${universityRating} ⭐` : '';
        // Example: Royal Melbourne Institute of Technology (RMIT) at Melbourne, Australia | Students Choice | 4.5 ⭐
        const pageTitle = `${displayName} at ${universityLocation} | Students Choice${ratingText}`;
        const pageDescription = `${universityName} is an Australian university with campuses in ${universityLocation}. Click here to find more.`;
        
        const origin = window.location.origin;
        const canonicalUrl = `${origin}/universities/${resolvedUniversitySlug || idUniversity}`;

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
                script.type = "application/ld+json";
                script.id = id;
                document.head.appendChild(script);
            }
            script.textContent = JSON.stringify(json);
        };

        document.title = pageTitle;
        setOrCreateMetaByName("description", pageDescription);
        setOrCreateMetaByName("robots", "index,follow");
        setOrCreateLinkCanonical(canonicalUrl);

        setOrCreateMetaByProperty("og:type", "website");
        setOrCreateMetaByProperty("og:site_name", "StudentsChoice");
        setOrCreateMetaByProperty("og:title", pageTitle);
        setOrCreateMetaByProperty("og:description", pageDescription);
        setOrCreateMetaByProperty("og:url", canonicalUrl);
        setOrCreateMetaByProperty("og:image", `${origin}/og.png`);

        setOrCreateMetaByName("twitter:card", "summary_large_image");
        setOrCreateMetaByName("twitter:title", pageTitle);
        setOrCreateMetaByName("twitter:description", pageDescription);
        setOrCreateMetaByName("twitter:image", `${origin}/og.png`);
        setOrCreateMetaByName("twitter:image:alt", `${universityName} - university reviews and programs`);

        setJsonLd("seo-jsonld-university", {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": universityName,
            "url": university?.attributes?.webpage || canonicalUrl,
            "description": `University in ${universityLocation} offering various programs and subjects`,
            "address": {
                "@type": "PostalAddress",
                "addressLocality": universityLocation
            },
            "aggregateRating": universityRating ? {
                "@type": "AggregateRating",
                "ratingValue": universityRating,
                "bestRating": 5,
                "ratingCount": 1
            } : undefined,
            "isPartOf": {
                "@type": "WebSite",
                "name": "StudentsChoice",
                "url": origin
            }
        });

        return undefined;
    }, [university, idUniversity, resolvedUniversitySlug]);

    if (!university) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">Loading university data...</p>
                </div>
            </div>
        );
    }

    if (isStarIconLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">Loading icons...</p>
                </div>
            </div>
        );
    }

    if (isStarIconError) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-xl text-red-600 dark:text-red-400">Error loading icons. Please refresh the page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-screen h-screenc relative m-0 bg-white dark:bg-gray-900">
            <div className="relative">
                <UniTitleAndImg universityHeader={university.attributes} universityId={university.id} isLoggedIn={isLoggedIn} isBookmarked={isBookmarked} handleAddBookmark={handleAddBookmark}
                                handleRemoveBookmark={handleRemoveBookmark}/>
            </div>
            <div style={{ position: 'relative', zIndex: 0 }}>
                <UniBanner universityData={university.attributes.universityHeaderImage.data.attributes} />
            </div>
            
            <div className="relative">
                <div className="mt-[0%]">
                    {!isStarIconLoading && 
                        <ProgramAndSubject 
                            universityHeader={university} 
                            starIconURL={`${BASE_URL}${starIconData.data.attributes.image.data[0].attributes.formats.thumbnail.url}`}
                        />
                    }
                </div>
            </div>
            {university && university.attributes && resolvedUniversityId && <InteractionArea interactionName={`university-pages/${resolvedUniversityId}`} />}
        </div>
    );
}


function UniTitleAndImg({ universityHeader, universityId, isLoggedIn, isBookmarked, handleAddBookmark, handleRemoveBookmark }) {
    const [showOptionsMenu, setShowOptionsMenu] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    // Extract the university logo URL
    const universityLogoUrl = universityHeader.universityLogo?.data?.attributes?.formats?.thumbnail?.url;

    // Check if the logo is a placeholder
    const isPlaceholderIcon = universityLogoUrl?.includes("placeholder.png");

    // Icon ID numbers (same as ReviewCard)
    const iconIds = {
        dotsBlack: 68,
        dotsDarkmode: 70
    };

    // Fetch all icons (same as ReviewCard)
    const { data: iconsData, isError: isIconsError, isLoading: isIconsLoading } = useGetAllIconsQuery();

    // Helper function to get icon URL by ID (same as ReviewCard)
    const getIconURL = (id) => {
        if (!iconsData || !iconsData.data || isIconsLoading || isIconsError) return '';
        const icon = iconsData.data.find(icon => icon.id === id);
        return icon ? `${BASE_URL}${icon.attributes.image.data[0].attributes.formats.thumbnail.url}` : '';
    };

    return (
        <div className="h-full flex items-start justify-between sm:mt-2.5 ml-4 mr-4 mb-4">
            {/* Title, Location, and Bookmark */}
            <div className="flex flex-col items-start gap-1 w-full sm:w-4/5">
                {/* Title & Location */}
                <div className="flex items-start sm:items-center">
                    <h1 className="font-bold text-2xl sm:text-4xl 2xl:text-6xl text-black dark:text-gray-200 mb-2">
                        {universityHeader?.universityName || "Unknown University"}
                    </h1>

                    {/* Bookmark Icon */}
                    {isLoggedIn && (
                        <button onClick={isBookmarked ? handleRemoveBookmark : handleAddBookmark}
                            aria-label={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
                            className={"shrink-0 mt-1 sm:mt-0 ml-8"}>
                            <img
                                src={isBookmarked ? BookmarkSelectedIcon : BookmarkIcon}
                                alt={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
                                className="sm:w-11 w-8 sm:h-11 h-8 dark:hidden"
                            />
                            <img
                                src={isBookmarked ? BookmarkSelectedIcon : BookmarkDarkIcon}
                                alt={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
                                className="sm:w-11 w-8 sm:h-11 h-8 hidden dark:block"
                            />
                        </button>
                    )}

                    {/* Three dots menu */}
                    <div className="relative shrink-0 mt-1 sm:mt-1">
                        <button 
                            onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                            className="p-0 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="More options"
                        >
                        {!isIconsLoading && !isIconsError && getIconURL(iconIds.dotsBlack) ? (
                            <img src={getIconURL(iconIds.dotsBlack)} className="sm:w-11 w-8 sm:h-11 h-8 dark:hidden" alt="Options" />
                        ) : (
                            <svg className="sm:w-11 w-8 sm:h-11 h-8 text-gray-600 dark:hidden" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                            </svg>
                        )}
                        {!isIconsLoading && !isIconsError && getIconURL(iconIds.dotsDarkmode) ? (
                            <img src={getIconURL(iconIds.dotsDarkmode)} className="sm:w-11 w-8 sm:h-11 h-8 hidden dark:block" alt="Options" />
                        ) : (
                            <svg className="sm:w-11 w-8 sm:h-11 h-8 text-gray-400 hidden dark:block" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                            </svg>
                        )}
                            
                        </button>
                        {showOptionsMenu && (
                            <div className="absolute right-0 sm:left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-20 p-2 w-[160px]">
                                <ul className="space-y-2">
                                    <li 
                                        onClick={() => {
                                            if (user) {
                                                setShowReportModal(true);
                                            } else {
                                                dispatch(toggleUIState({ key: 'showLoginPost' }));
                                            }
                                            setShowOptionsMenu(false);
                                        }}
                                        className="cursor-pointer hover:bg-gray-100 p-2 rounded text-red-600"
                                    >
                                        Report listing
                                    </li>
                                    <li 
                                        onClick={() => setShowOptionsMenu(false)}
                                        className="cursor-pointer hover:bg-gray-100 p-2 rounded text-black"
                                    >
                                        Close
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>

                </div>
                <div className="flex items-start flex-col sm:flex-row gap-x-10 mt-1">
                    <div className="flex items-center">
                        <img className="sm:w-7 w-6 sm:h-7 h-6 mr-1 sm:mr-2" src={LocationIcon} alt="Location pin icon"/>
                        <p className="font-bold text-lg sm:text-2xl 2xl:text-4xl text-gray-500 dark:text-gray-300 mt-1">
                            {universityHeader?.universityLocation || "Unknown Location"}
                        </p>
                    </div>

                    <div className="flex items-center mt-1">
                        <img className="sm:w-7 w-6 sm:h-7 h-6 mr-1 sm:mr-2" src={LinkIcon} alt="Link icon"/>
                        <a href={universityHeader?.webpage || "#"} target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-300 underline font-bold text-lg sm:text-2xl 2xl:text-4xl">
                            {universityHeader?.webpage || "No website available"}
                        </a>
                    </div>
                </div>
            </div>

            {/* University Logo */}
            <div className="bg-gray-300 p-4 rounded-lg shadow-md place-items-center hidden sm:block">
                {!isPlaceholderIcon && universityLogoUrl && (
                    <img
                        src={BASE_URL + universityLogoUrl}
                        className="h-12 sm:h-16 2xl:h-20"
                        alt={universityHeader.universityLogo.data.attributes.alternativeText || "University Logo"}
                    />
                )}
            </div>

            {/* Report Modal */}
            {showReportModal && (
                <UniversityReportFlow
                    onClose={() => setShowReportModal(false)}
                    universityId={universityId}
                    userId={user?.id}
                />
            )}
        </div>
    );
}



function ProgramAndSubject({ universityHeader, starIconURL }) {
    // Add null checks for data arrays
    const programsData = universityHeader?.attributes?.program_pages?.data || [];
    const subjectsData = universityHeader?.attributes?.subject_pages?.data || [];
    
    const sortedPrograms = programsData.sort((a, b) => {
        const ratingA = a?.attributes?.programRating;
        const ratingB = b?.attributes?.programRating;

        if (ratingA === null) return 1;
        if (ratingB === null) return -1;

        return ratingB - ratingA;
    });

    const sortedSubjects = subjectsData.sort((a, b) => {
        const ratingA = a?.attributes?.subjectRating;
        const ratingB = b?.attributes?.subjectRating;

        if (ratingA === null) return 1;
        if (ratingB === null) return -1;

        return ratingB - ratingA;
    });

    return (
        <div className="h-full w-full mt-5">
            {programsData.length > 0 && (
                <>
                    <h3 className="text-sc-red dark:text-gray-200 ml-6 sm:ml-5 2xl:ml-24 text-2xl sm:text-3xl font-bold sm:mb-3">Programs</h3>
                    <div className="sm:flex sm:justify-between w-[98%] m-auto">
                        {sortedPrograms.slice(0, 3).map((university) => (
                            <Link key={university.id} style={{ width: "32.5%" }}
                                to={`/universities/${universityHeader.id}/program/${university.attributes?.slug || university.id}`}>
                                <ShadowBox
                                    name={university?.attributes?.programName || "Unknown Program"}
                                    rating={university?.attributes?.programRating !== null
                                        ? university?.attributes?.programRating
                                        : "-"}
                                    starIconURL={starIconURL} // Pass the dynamic star icon URL
                                />
                            </Link>
                        ))}
                    </div>
                </>
            )}

            {subjectsData.length > 0 && (
                <>
                    <h3 className="text-sc-red dark:text-gray-200 ml-6 sm:ml-5 2xl:ml-24 text-2xl sm:text-3xl mt-4 font-bold sm:mb-3">Subjects</h3>
                    <div className="sm:flex sm:justify-between w-[98%] m-auto">
                        {sortedSubjects.slice(0, 3).map((university) => (
                            <Link key={university.id} style={{ width: "32.5%" }}
                                to={`/universities/${universityHeader.id}/subject/${university.attributes?.slug || university.id}`}>
                                <ShadowBox
                                    name={university?.attributes?.subjectName || "Unknown Subject"}
                                    rating={university?.attributes?.subjectRating !== null
                                        ? university?.attributes?.subjectRating
                                        : "-"}
                                    starIconURL={starIconURL} // Pass the dynamic star icon URL
                                />
                            </Link>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

function ShadowBox(args) {
    const { name, rating, starIconURL } = args;
    return (
        <div className="relative flex justify-center items-center h-16 w-full bg-white dark:bg-gray-600 drop-shadow-md rounded-md m-auto mb-4 sm:mb-0 sm:hover:drop-shadow-xl transition duration-300">
            <p className="text-gray-600 dark:text-gray-200 text-lg sm:text-xl px-10 sm:px-2 text-center font-bold">{name}</p>

            <div className="absolute flex items-center h-1/2 bottom-0 right-0">
                <p className="text-base text-gray-600 dark:text-gray-300 mr-1 font-bold">{rating}</p>
                {starIconURL ? (
                    <img src={starIconURL} className="h-3/5 mr-1" alt="Yellow star icon" />
                ) : (
                    <div className="h-3/5 mr-1" /> // Placeholder or loader if icon URL is not available
                )}
            </div>
        </div>
    )
}

function UniBanner({ universityData }) {
    // Extract the background image URL
    const backgroundImageUrl = universityData?.formats?.large?.url;

    // Check if the background image name is "placeholder.png"
    const isPlaceholderImage = backgroundImageUrl?.includes("placeholder");
    
    return (
        <div
            style={{
                width: "98%",
                height: isPlaceholderImage ? '17vh' : '60%', // Adjust height if it's a placeholder image
                position: 'relative',
                borderRadius: '20px',
                overflow: 'hidden',
            }}
            className="bg-gray-100 dark:bg-gray-800 mx-auto mb-4" // Fallback background color
        >
            {/* Conditionally render the background image */}
            {!isPlaceholderImage && (
                <img
                    src={BASE_URL + backgroundImageUrl}
                    className="w-screen block object-cover h-[30vh] sm:h-[50vh]"
                    alt={universityData.alternativeText || "University Banner"}
                />
            )}
        </div>
    );
}

export default UniReview;