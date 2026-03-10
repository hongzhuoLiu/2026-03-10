import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import InteractionArea from '../../components/Posts/InteractionArea';
import { BASE_URL } from "../../API";


import BookmarkSelectedIcon from '../../images/icons/bookmark-selected.png'
import BookmarkIcon from '../../images/icons/bookmark-grey-400.png'
import ChevronLight from '../../images/icons/ChevronLeft.png';
import ChevronDark from '../../images/icons/ChevronLeftDark.png';
import LinkIcon from '../../images/icons/link.png';


import { useGetUserDetailsQuery, useUpdateUserProfileMutation } from '../../app/service/usersAPI';
import { setCredentials } from '../../app/features/authentication/AuthenticationReducer';
import { toggleUIState } from '../../app/features/ui/UIReducer';
import { useGetAllIconsQuery } from '../../app/service/iconsAPI';
import ProgramReportFlow from '../../components/Report/ProgramReportFlow';
import SubjectReportFlow from '../../components/Report/SubjectReportFlow';

function DetailView(args) {
    const { idUniversity, idDetail } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const [detail, setDetail] = useState({});
    const [university, setUniversity] = useState({});
    const [type, setType] = useState('');

    const [showOptionsMenu, setShowOptionsMenu] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);


    const [resolvedDetailId, setResolvedDetailId] = useState(null);
    const [resolvedDetailSlug, setResolvedDetailSlug] = useState(null);


    const { user } = useSelector((state) => state.auth);
    const { data: userDetails, refetch: refetchUserDetails } = useGetUserDetailsQuery();
    const [updateUserProfile] = useUpdateUserProfileMutation();

    const isLoggedIn = !!user;
    const isNumericId = useMemo(() => /^\d+$/.test(String(idDetail)), [idDetail]);


    // icons for title three dots (backend IDs)
    const iconIds = { dotsGrey: 69 };
    const { data: iconsData, isError: isIconsError, isLoading: isIconsLoading } = useGetAllIconsQuery();
    const getIconURL = (id) => {
        if (!iconsData || !iconsData.data || isIconsLoading || isIconsError) return '';
        const icon = iconsData.data.find(icon => icon.id === id);
        return icon ? `${BASE_URL}${icon.attributes.image.data[0].attributes.formats.thumbnail.url}` : '';
    };


    
    const isBookmarked = useMemo(() => {
        if (!isLoggedIn || !resolvedDetailId) return false;
        return (type === 'program' && userDetails?.userProgramLikes?.some(item => item.id === resolvedDetailId)) ||
               (type === 'subject' && userDetails?.userSubjectLikes?.some(item => item.id === resolvedDetailId));
    }, [isLoggedIn, userDetails, resolvedDetailId, type]);



    useEffect(() => {
        setType(location.pathname.includes('/program/') ? 'program' : 'subject');
    }, [location.pathname]);


    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchData = async () => {
            try {
                const fields = `fields[0]=${type}Name&fields[1]=${type}Description&fields[2]=${type}GraduationLevel&fields[3]=webpage&fields[4]=${type === 'subject' ? 'subjectCode' : 'programAcronym'}&fields[5]=${type}Rating&fields[6]=slug`;
                const url = isNumericId
                    ? `${BASE_URL}/api/${type}-pages/${idDetail}?${fields}`
                    : `${BASE_URL}/api/${type}-pages?filters[slug][$eq]=${encodeURIComponent(idDetail)}&${fields}`;

                const response = await fetch(url);
                if (!response.ok) {
                    console.warn(`${type} fetch failed:`, response.status, url);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const responseData = await response.json();

                // Normalize data shape
                const node = isNumericId ? responseData.data : (responseData.data && responseData.data[0]);
                if (node) {
                    setDetail(node);
                    setResolvedDetailId(node.id);
                    setResolvedDetailSlug(node.attributes?.slug || String(idDetail));
                } else {
                    console.error(`Invalid ${type} response structure:`, responseData);
                    setDetail({});
                    setResolvedDetailId(null);
                    setResolvedDetailSlug(null);
                }
            } catch (error) {
                console.error(`Error fetching ${type} data:`, error);
                setDetail({});
                setResolvedDetailId(null);
                setResolvedDetailSlug(null);
            }
        };

        fetchData();
    }, [idDetail, type, isNumericId]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `${BASE_URL}/api/university-pages/${idUniversity}?fields[0]=universityName`
                );
                const responseData = await response.json();

                setUniversity(responseData.data.attributes);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [idUniversity]);

    // Dynamic SEO injection for Program/Subject detail pages
    useEffect(() => {
        if (!detail?.attributes || !university?.universityName) return;

        const programName = detail.attributes.programName || detail.attributes.subjectName;
        const programAcronym = detail.attributes.programAcronym || detail.attributes.subjectCode;
        const programRating = detail.attributes.programRating || detail.attributes.subjectRating;
        const universityName = university.universityName;
        const universityLocation = university.universityLocation || "Australia";

        // Create display name based on type
        const getDisplayName = (name, acronym, code) => {
            if (!name) return type === 'program' ? "Unknown Program" : "Unknown Subject";
            
            if (type === 'program') {
                // Program format: Program Name (Acronym)
                if (acronym && !name.includes(`(${acronym})`)) {
                    return `${name} (${acronym})`;
                }
                return name;
            } else {
                // Subject format: Subject Code - Subject Name
                if (code) {
                    return `${code} - ${name}`;
                }
                return name;
            }
        };

        const displayName = getDisplayName(programName, programAcronym, detail.attributes.subjectCode);
        const ratingText = programRating ? ` | ${programRating} ⭐` : '';
        const pageTitle = `${displayName} at ${universityName} (${universityLocation}) | StudentsChoice${ratingText}`;
        const pageDescription = `${displayName} is a ${detail.attributes.programGraduationLevel || detail.attributes.subjectGraduationLevel || 'program'} ${type === 'program' ? 'program' : 'subject'} offered by ${universityName} at their ${universityLocation} campus with a rating of ${programRating || 'N/A'} out of 5. Click here to find more.`;

        const origin = window.location.origin;
        const canonicalUrl = `${origin}/universities/${idUniversity}/${type}/${resolvedDetailSlug || idDetail}`;

        // Helper functions for SEO meta tags
        const setOrCreateMetaByName = (name, content) => {
            let meta = document.querySelector(`meta[name="${name}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.name = name;
                document.head.appendChild(meta);
            }
            meta.content = content;
        };

        const setOrCreateMetaByProperty = (property, content) => {
            let meta = document.querySelector(`meta[property="${property}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.property = property;
                document.head.appendChild(meta);
            }
            meta.content = content;
        };

        const setOrCreateLinkCanonical = (href) => {
            let link = document.querySelector('link[rel="canonical"]');
            if (!link) {
                link = document.createElement('link');
                link.rel = 'canonical';
                document.head.appendChild(link);
            }
            link.href = href;
        };

        const setJsonLd = (id, data) => {
            let script = document.getElementById(id);
            if (script) {
                script.remove();
            }
            script = document.createElement('script');
            script.id = id;
            script.type = 'application/ld+json';
            script.textContent = JSON.stringify(data);
            document.head.appendChild(script);
        };

        // Set dynamic SEO tags
        document.title = pageTitle;
        setOrCreateMetaByName("description", pageDescription);
        setOrCreateMetaByName("robots", "index,follow");
        setOrCreateLinkCanonical(canonicalUrl);

        // Open Graph tags
        setOrCreateMetaByProperty("og:title", pageTitle);
        setOrCreateMetaByProperty("og:description", pageDescription);
        setOrCreateMetaByProperty("og:url", canonicalUrl);
        setOrCreateMetaByProperty("og:type", "website");
        setOrCreateMetaByProperty("og:site_name", "StudentsChoice");

        // Twitter Card tags
        setOrCreateMetaByName("twitter:card", "summary_large_image");
        setOrCreateMetaByName("twitter:title", pageTitle);
        setOrCreateMetaByName("twitter:description", pageDescription);

        // JSON-LD structured data
        setJsonLd("seo-jsonld-program", {
            "@context": "https://schema.org",
            "@type": "EducationalOccupationalProgram",
            "name": displayName,
            "description": pageDescription,
            "provider": {
                "@type": "Organization",
                "name": universityName,
                "url": university?.webpage || canonicalUrl
            },
            "occupationalCategory": detail.attributes.programGraduationLevel || detail.attributes.subjectGraduationLevel,
            "url": canonicalUrl,
            "aggregateRating": programRating ? {
                "@type": "AggregateRating",
                "ratingValue": programRating,
                "bestRating": 5,
                "ratingCount": 1
            } : undefined
        });
    }, [detail, university, idUniversity, idDetail, type, resolvedDetailSlug]);

    const handleBack = () => {
        navigate(`/universities/${idUniversity}`);
    };


    const handleAddBookmark = async () => {
        if (!isLoggedIn || !resolvedDetailId) return;

        try {
            const updatedUser = { ...userDetails };
            if (type === 'program') {
                updatedUser.userProgramLikes = [...(userDetails.userProgramLikes || []), { id: resolvedDetailId }];
            } else if (type === 'subject') {
                updatedUser.userSubjectLikes = [...(userDetails.userSubjectLikes || []), { id: resolvedDetailId }];
            }

            await updateUserProfile(updatedUser).unwrap();
            dispatch(setCredentials(updatedUser));
            refetchUserDetails();
        } catch (error) {
            console.error('Error adding bookmark:', error);
        }
    };


    const handleRemoveBookmark = async () => {
        if (!isLoggedIn || !resolvedDetailId) return;

        try {
            const updatedUser = { ...userDetails };
            if (type === 'program') {
                updatedUser.userProgramLikes = (userDetails.userProgramLikes || []).filter(item => item.id !== resolvedDetailId);
            } else if (type === 'subject') {
                updatedUser.userSubjectLikes = (userDetails.userSubjectLikes || []).filter(item => item.id !== resolvedDetailId);
            }

            await updateUserProfile(updatedUser).unwrap();
            dispatch(setCredentials(updatedUser));
            refetchUserDetails();
        } catch (error) {
            console.error('Error removing bookmark:', error);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-grow" style={{ margin: '0', width: '100vw', position: 'relative' }}>
                <div style={{ marginLeft: '2%', marginRight: '1%' }}>
                    {university && (
                        <div className="flex items-center sm:mt-2" onClick={handleBack}>
                            <img className="h-6 sm:h-10 cursor-pointer mr-1 block dark:hidden" src={ChevronLight} alt="Back arrow" />
                            <img className="h-6 sm:h-10 cursor-pointer mr-1 hidden dark:block" src={ChevronDark} alt="Back arrow" />
                            {/* University Name */}
                            <h1 className="w-full text-left text-2xl sm:text-3xl font-bold ml-2 text-sc-red dark:text-gray-300">{university.universityName}</h1>
                        </div>
                    )}

                    {detail.attributes && (
                        <>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4">
                                <div className="flex items-start sm:items-center">
                                    {/* Subject/Program Name */}
                                    <h3 className="text-gray-400 text-xl sm:text-3xl font-bold">{detail.attributes[`${type}Name`]}</h3>
                                    {/* Bookmark Icon */}
                                    {isLoggedIn && (
                                        <button
                                            className="shrink-0 mt-1 sm:mt-0 ml-4"
                                            onClick={isBookmarked ? handleRemoveBookmark : handleAddBookmark}
                                            aria-label={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
                                        >
                                            <img
                                                src={isBookmarked ? BookmarkSelectedIcon : BookmarkIcon}
                                                alt={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
                                                className="sm:w-9 w-7 sm:h-9 h-7"
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
                                            {getIconURL(iconIds.dotsGrey) ? (
                                                <img src={getIconURL(iconIds.dotsGrey)} className="sm:w-9 w-7 sm:h-9 h-7" alt="Options" />
                                            ) : (
                                                <svg className="sm:w-9 w-7 sm:h-9 h-7 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
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
                                {/* Subject Code/ Program Acronym */}
                                {detail.attributes && (
                                    <span className="text-gray-500 text-lg sm:text-3xl font-bold mr-10">
                                    {type === 'subject' ? detail.attributes.subjectCode : detail.attributes.programAcronym}
                                </span>
                                )}
                            </div>

                            {/* Graduation Level */}
                            <h4 className="text-gray-500 text-base sm:text-2xl mt-2">{detail.attributes[`${type}GraduationLevel`]}</h4>

                            {/* Webpage Link */}
                            {detail.attributes.webpage ? (
                                <div className="mt-3 flex items-center">
                                    <img className="w-6 h-6 mr-2" src={LinkIcon} alt="Link icon"/>
                                    <a href={detail.attributes.webpage} target="_blank" rel="noopener noreferrer" className="text-gray-500 underline text-base sm:text-xl">
                                        Visit the official university webpage for this {type}
                                    </a>
                                </div>
                            ) : (
                                <p className="text-gray-500 text-base sm:text-2xl mt-1">
                                    Official website not available
                                </p>
                            )}
                        </>
                    )}
                </div>
                {detail.attributes && resolvedDetailId && (
                    <InteractionArea interactionName={`${type}-pages/${resolvedDetailId}`} />
                )}
                {/* Report Modal */}
                {showReportModal && (
                    type === 'program' ? (
                        <ProgramReportFlow
                            onClose={() => setShowReportModal(false)}
                            programId={detail.id}
                            userId={user?.id}
                        />
                    ) : (
                        <SubjectReportFlow
                            onClose={() => setShowReportModal(false)}
                            subjectId={detail.id}
                            userId={user?.id}
                        />
                    )
                )}
            </div>
        </div>
    );
}

export default DetailView;
