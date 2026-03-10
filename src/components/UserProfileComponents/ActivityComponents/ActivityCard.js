import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toggleUIState } from '../../../app/features/ui/UIReducer';
import { BASE_URL } from "../../../API";
import '../../../input.css';
import { useGetAllIconsQuery } from '../../../app/service/iconsAPI.js';
import { FaStar, FaCommentDots, FaBlog, FaQuestionCircle } from 'react-icons/fa';

function ActivityCard({ post, onDelete}) {
    const [showDotsPopup, setShowDotsPopup] = useState(false);
    const navigate = useNavigate();
    const [listingInfo, setListingInfo] = useState(''); // State to update listing information dynamically
    const [universityId, setUniversityId] = useState(null); // State to store the fetched university_id
    const dispatch = useDispatch();

    // Icon ID numbers
    const iconIds = {
        starYellow: 12,
        defaultProfilePhoto: 29,
        dots: 4
    };

    // Fetch all icons
    const { data: iconsData, isError: isIconsError, isLoading: isIconsLoading } = useGetAllIconsQuery();

    // Helper function to get icon URL by ID
    const getIconURL = useCallback((id) => {
        if (!iconsData || !iconsData.data || isIconsLoading || isIconsError) return '';
        const icon = iconsData.data.find(icon => icon.id === id);
        return icon ? `${BASE_URL}${icon.attributes.image.data[0].attributes.formats.thumbnail.url}` : '';
    }, [iconsData, isIconsLoading, isIconsError]);

    const toggleDotsPopup = () => {
        setShowDotsPopup(prevState => !prevState);
    };

    // Fetch university information based on subject or program
    useEffect(() => {
        const fetchUniversityInfo = async () => {
            const subjectId = post.attributes.subject_page?.data?.id;
            const programId = post.attributes.program_page?.data?.id;

            let url = null;

            if (subjectId) {
                url = `${BASE_URL}/api/subject-pages/${subjectId}?populate=university_page`;
            } else if (programId) {
                url = `${BASE_URL}/api/program-pages/${programId}?populate=university_page`;
            }

            if (url) {
                try {
                    const response = await fetch(url);
                    const data = await response.json();
                    const universityData = data.data.attributes.university_page?.data?.attributes;
                    const universityName = universityData?.universityName || 'Unknown University';
                    const universityId = data.data.attributes.university_page?.data?.id; // Fetch university ID

                    const subjectOrProgramName = post.attributes.subject_page?.data?.attributes?.subjectName || post.attributes.program_page?.data?.attributes?.programName || '';

                    // Set the listing info like "Program/SubjectName at UniversityName"
                    setListingInfo(`${subjectOrProgramName} at ${universityName}`);
                    setUniversityId(universityId); // Store the university_id for URL construction
                } catch (error) {
                    console.error("Error fetching university info:", error);
                }
            } else {
                // If no program or subject, fallback to university name only
                const fallbackUniversityId = post.attributes.university_page?.data?.id;
                const fallbackListingInfo = post.attributes.university_page?.data?.attributes?.universityName || "Unknown University";
                setListingInfo(fallbackListingInfo);
                setUniversityId(fallbackUniversityId); // Set fallback university ID
            }
        };

        fetchUniversityInfo();
    }, [post]);

    // Extract user data from post
    const user = post.attributes.users_permissions_user?.data?.attributes;

    const avatarUrl = user?.avatar?.data?.attributes?.formats?.thumbnail?.url
        ? `${BASE_URL}${user.avatar.data.attributes.formats.thumbnail.url}`
        : getIconURL(iconIds.defaultProfilePhoto);

    const username = user?.username || "Anonymous";

    // Determine createdAt, rating, content based on post type
    let createdAt;
    let rating = '';
    let content = '';
    let question = '';

    switch (post.type) {
        case 'review':
            createdAt = post.attributes.createdAt ? new Date(post.attributes.createdAt).toLocaleDateString() : "Just now";
            rating = post.attributes.reviewRating !== null ? post.attributes.reviewRating : "";
            content = post.attributes.reviewText || "No review text";
            break;
        case 'blog':
            createdAt = post.attributes.createdAt ? new Date(post.attributes.createdAt).toLocaleDateString() : "Just now";
            content = post.attributes.blogText || "No blog content";
            break;
        case 'qna':
            createdAt = post.attributes.createdAt ? new Date(post.attributes.createdAt).toLocaleDateString() : "Just now";
            question = post.attributes.qnaText || "No question provided";
            break;
        default:
            createdAt = "Unknown";
            rating = '';
            content = "Unknown post type.";
    }

    // Generate the URL for the university, program, or subject
    const programId = post.attributes.program_page?.data?.id;
    const subjectId = post.attributes.subject_page?.data?.id;

    // Construct the URL based on program or subject presence using the fetched university_id
    let postUrl = `/universities/${universityId}`;
    if (programId) {
        postUrl += `/program/${programId}`;
    } else if (subjectId) {
        postUrl += `/subject/${subjectId}`;
    }

    const handleListingInfoClick = (e) => {
        e.stopPropagation();  // Prevent triggering other events like card clicks
        // Navigate to the URL when clicking the listing info
        navigate(postUrl);
        // Dispatch action to close the user profile
        dispatch(toggleUIState({ key: 'showProfile' }));
    };

    let postTypeLabel;
    return (
        <div
            className="block cursor-pointer"
        >
            <div className="w-full sm:w-11/12 h-auto bg-white dark:bg-gray-700 shadow-md mb-3 rounded-lg p-4 sm:hover:shadow-lg transition duration-300 m-auto relative">
                {/* Avatar and Username Section */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 overflow-hidden rounded-full">
                            {!isIconsLoading &&
                                <img
                                    className="w-full h-full object-cover"
                                    src={avatarUrl}
                                    alt={`${username}'s avatar`}
                                    loading="lazy"
                                />
                            }
                        </div>
                        <h1 className="text-lg sm:text-xl font-bold text-gray-400">
                            {username}
                        </h1>
                    </div>

                    {/* Rating, Date, and Options */}
                    <div className="flex items-center space-x-4">
                        {rating && (
                            <div className="flex items-center space-x-1">
                                <p className="text-yellow-500 font-bold text-base sm:text-lg">{rating}</p>
                                {!isIconsLoading && rating && (
                                    <FaStar className="text-yellow-500 w-4 h-4 sm:w-5 sm:h-5" />
                                )}
                            </div>
                        )}
                        <h2 className="text-sm sm:text-base font-semibold text-gray-400">
                            {createdAt}
                        </h2>
                        <button
                            onClick={(e) => { e.stopPropagation(); toggleDotsPopup(); }}
                            aria-label="Options"
                            className="focus:outline-none"
                        >
                            {!isIconsLoading &&
                                <img src={getIconURL(iconIds.dots)} className="w-5 h-5 sm:w-6 sm:h-6" alt="Options" />
                            }
                        </button>
                        {showDotsPopup && (
                            <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-20 p-2 w-[100px]">
                                <ul className="space-y-2">
                                    <li 
                                        onClick={() =>{
                                            toggleDotsPopup();
                                            onDelete(post.id, post.type);
                                        }} 
                                        className="cursor-pointer hover:bg-gray-100 p-2 rounded text-red-600">
                                        Delete
                                    </li>
                                    {/* <li className="cursor-pointer hover:bg-gray-100 p-2 rounded text-red-600">Block</li>
                                    <li className="cursor-pointer hover:bg-gray-100 p-2 rounded">Hide</li> */}
                                    <li onClick={toggleDotsPopup} className="cursor-pointer hover:bg-gray-100 p-2 rounded text-black">Cancel</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-300 mt-4 mb-2" />

                {/* Listing info clickable area with hover effect */}
                <div className="flex flex-wrap justify-between items-center py-1">
                    <p
                        className="text-sm sm:text-base text-gray-500 dark:text-gray-300 font-bold cursor-pointer hover:underline hover:text-blue-600"
                        onClick={handleListingInfoClick}  // Move click handler to this element
                    >
                        {listingInfo}
                    </p>
                    <h3 className="text-base sm:text-lg font-semibold flex items-center text-gray-400 mt-2 sm:mt-0">
                        {post.type === 'review' && <FaCommentDots className="mr-2 text-gray-400" />}
                        {post.type === 'blog' && <FaBlog className="mr-2 text-gray-400" />}
                        {post.type === 'qna' && <FaQuestionCircle className="mr-2 text-gray-400" />}
                        {postTypeLabel}
                    </h3>
                </div>

                {/* Post Content */}
                <div className="text-left text-gray-600 dark:text-gray-200 font-normal text-base sm:text-lg pb-2">
                    {post.type === 'review' && <p>{content}</p>}
                    {post.type === 'blog' && <p>{content}</p>}
                    {post.type === 'qna' && <p>{question}</p>}
                </div>
            </div>
        </div>
    );
}

export default ActivityCard;