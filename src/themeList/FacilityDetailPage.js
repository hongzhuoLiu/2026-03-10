import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import { useGetFacilityByIdQuery } from '../app/service/facilitiesApi';

import BackArrowLight from '../images/icons/ChevronLeft.png';
import BackArrowDark from '../images/icons/ChevronLeftDark.png';
import BookmarkIcon from '../images/icons/bookmark-black.png';
import BookmarkSelectedIcon from '../images/icons/bookmark-selected.png';
import BookmarkDarkIcon from '../images/icons/bookmark-grey-200.png';
import LocationPinIcon from '../images/icons/locationPin.png';
import LinkIcon from '../images/icons/link.png';

import InteractionArea from '../components/Posts/InteractionArea';
import {setCredentials} from "../app/features/authentication/AuthenticationReducer";
import {useGetUserDetailsQuery, useUpdateUserProfileMutation} from "../app/service/usersAPI";
import { toggleUIState } from "../app/features/ui/UIReducer";
import FacilityReportFlow from '../components/Report/FacilityReportFlow';
import { useGetAllIconsQuery } from '../app/service/iconsAPI';
import { BASE_URL } from '../API';

export default function FacilityDetailPage() {
    const { facilityId } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);
    const isLoggedIn = !!user;
    const { data: userDetails, refetch: refetchUserDetails } = useGetUserDetailsQuery();
    const { data: facility, isLoading, isError, error } = useGetFacilityByIdQuery(facilityId);

    const [updateUserProfile] = useUpdateUserProfileMutation();
    const dispatch = useDispatch();
    const isBookmarked = isLoggedIn && userDetails?.userFacilityBookmarks?.some(facility => facility.id === parseInt(facilityId));
    const [showOptionsMenu, setShowOptionsMenu] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);

    // icons for title area: use backend IDs (68 grey, 68 black)
    const iconIds = { dotsBlack: 68, dotsDarkmode: 70 };
    const { data: iconsData, isError: isIconsError, isLoading: isIconsLoading } = useGetAllIconsQuery();
    const getIconURL = (id) => {
        if (!iconsData || !iconsData.data || isIconsLoading || isIconsError) return '';
        const icon = iconsData.data.find(icon => icon.id === id);
        return icon ? `${BASE_URL}${icon.attributes.image.data[0].attributes.formats.thumbnail.url}` : '';
    };


    useEffect(() => { window.scrollTo(0, 0); }, [facilityId]);

	// Dynamic SEO: Facility detail page title
	useEffect(() => {
		if (!facility?.attributes) return;

		const name = facility.attributes.facilityName || 'Facility';
		const rating = facility.attributes.facilityRating;
		const ratingText = rating ? ` | ${rating} ⭐` : '';
		const pageTitle = `${name} | Students Choice${ratingText}`;

		document.title = pageTitle;
	}, [facility]);

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen dark:text-white text-xl">Loading…</div>;
    }
    if (isError || !facility) {
        console.error(error);
        return <div className="flex justify-center items-center min-h-screen text-red-500 text-xl">Error loading details.</div>;
    }

    const {
        facilityType,
        facilityName,
        facilityDescription,
        facilityLocation,
        facilityLinks,
        facilityAdditionalInformation
    } = facility.attributes;

    const getEntityTitle = (type) => {
        switch ((type || '').trim()) {
            case 'Health': return 'health provider';
            case 'Fitness': return 'fitness provider';
            case 'Eateries': return 'eatery';
            case 'Accommodation': return 'accommodation';
            case 'Clubs & Societies': return 'club or society';
            case 'Culture & Religion': return 'culture & religion resource';
            default: return 'facility';
        }
    };

    // Function to add bookmark
    const handleAddBookmark = async () => {
        if (!isLoggedIn) return;

        try {
            const updatedLikes = [...(userDetails.userFacilityBookmarks || []), { id: parseInt(facilityId) }];
            const updatedUser = { ...userDetails, userFacilityBookmarks: updatedLikes };

            console.log('Debug: Adding bookmark', updatedLikes);
            await updateUserProfile(updatedUser).unwrap();
            dispatch(setCredentials(updatedUser));
            refetchUserDetails();
            console.log('Debug: Bookmark added, new userDetails', updatedUser);
        } catch (error) {
            console.error('Error adding university like:', error);
        }
    };

    // Function to remove bookmark
    const handleRemoveBookmark = async () => {
        if (!isLoggedIn) return;

        try {
            const updatedLikes = (userDetails.userFacilityBookmarks || []).filter(uni => uni.id !== parseInt(facilityId));
            const updatedUser = { ...userDetails, userFacilityBookmarks: updatedLikes };

            console.log('Debug: Removing bookmark', updatedLikes);
            await updateUserProfile(updatedUser).unwrap();
            dispatch(setCredentials(updatedUser));
            refetchUserDetails();
            console.log('Debug: Bookmark removed, new userDetails', updatedUser);
        } catch (error) {
            console.error('Error removing university like:', error);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen">
            <div className="primaryPageSizing mx-auto w-full pt-0 sm:pt-0">

                {/* ← FacilityType */}
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center text-gray-700 dark:text-gray-200 hover:text-sc-red dark:hover:text-rose-400 transition-colors mb-1"
                >
                    <img src={BackArrowLight} alt="Back" className="h-6 w-6 dark:hidden" />
                    <img src={BackArrowDark} alt="Back" className="h-6 w-6 hidden dark:block" />
                    <span className="ml-2 text-2xl sm:text-5xl font-bold">{facilityType}</span>
                </button>

                {/* ANU Medical Centre + Bookmark */}
                <div className="flex items-center mb-2">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white
                                    flex-1 min-w-0">
                        {facilityName}
                    </h1>
                    <div className="flex items-center">
                        {/* Bookmark Icon */}
                        {isLoggedIn && (
                            <button onClick={isBookmarked ? handleRemoveBookmark : handleAddBookmark}
                                    aria-label={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
                                    className={"shrink-0 mt-1 sm:mt-0 ml-4"}>
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
                        <div className="relative shrink-0 mt-2 sm:mt-1.5">
                            <button
                                onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                                className="p-0  hover:bg-gray-100 rounded-full transition-colors"
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
                                <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-20 p-2 w-[160px]">
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
                </div>

                {/* type */}
                {facilityDescription && (
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-2">
                        {facilityDescription}
                    </p>
                )}

                {/* location and link  */}
                <div className="flex items-center space-x-6 mb-4">
                    {facilityLocation && (
                        <div className="flex items-center">
                            <img src={LocationPinIcon} alt="Location" className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                            <span className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
                                {facilityLocation}
                            </span>
                        </div>
                    )}
                    {facilityLinks && (
                        <a
                            href={facilityLinks}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-base sm:text-lg font-medium text-sc-red dark:text-gray-400 underline"
                        >
                            <img src={LinkIcon} alt="Link" className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                            Visit the official website for this provider
                        </a>
                    )}
                </div>

                {facilityAdditionalInformation && (
                    <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                            Additional Information
                        </h2>
                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                            {facilityAdditionalInformation}
                        </p>
                    </div>
                )}

                <InteractionArea interactionName={`facilities/${facilityId}`} />
            </div>
            {/* Report Modal */}
            {showReportModal && (
                <FacilityReportFlow
                    onClose={() => setShowReportModal(false)}
                    facilityId={facilityId}
                    userId={user?.id}
                    facilityCategory={facilityType}
                    entityTitle={getEntityTitle(facilityType)}
                />
            )}
        </div>
    );
}
