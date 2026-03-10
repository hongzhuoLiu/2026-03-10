import React, { useState, useCallback, useEffect } from 'react';
import { BASE_URL } from "../../API";
import '../../input.css';

// Logos
import FaceBook from '../../images/logos/FacebookIcon.png';
import X from '../../images/logos/XIcon.png';

import CommentsPopup from './CommentsPopup.js';

// Named import for fetching all icons
import { useGetAllIconsQuery } from '../../app/service/iconsAPI.js';

// Named import for updating Review, Blog, and QnA Like and Dislike count
import {
    useUpdateReviewLikesMutation,
    useUpdateReviewDislikesMutation,
    useUpdateBlogLikesMutation,
    useUpdateBlogDislikesMutation,
    useUpdateQnALikesMutation,
    useUpdateQnADislikesMutation
} from '../../app/service/reviewCardLikesAndDislikesAPI.js';

import { useLazyGetUserNotificationPreferencesQuery } from '../../app/service/usersAPI.js';

import { 
    useGetNotificationsQuery,
    useCreateNotificationMutation,
    useUpdateNotificationMutation,
    useMarkNotificationReadMutation,
    useDeleteNotificationMutation,
    buildNotificationData,
} from "../../app/service/notificationsAPI";

import { getUserPreferences } from "../../Profile/NotificationSettings.js";

// Named import for switch case between Review, Blog, and QnA
import { useDispatch, useSelector } from "react-redux";

// Named import for showing users the login popup window before liking/disliking/commenting/sharing/reporting
import { toggleUIState } from "../../app/features/ui/UIReducer";

// Named import for syncing displayed like and dislike count between ReviewCard.js and CommentsPopup.js
import { setCurrentLikeCount, setCurrentLikeColor, setCurrentDislikeCount, setCurrentDislikeColor } from '../../app/features/syncingIconStates/displayedLikeDislike.js';

// Import the reportflow component for report function
import ReportFlow from '../Report/ReportFlow';


// Import the Review style
import CommentText from './CommentText';

// Import for Deleting the posts
import DeletePostPopup from './DeletePostPopup';

function ReviewCard(args) {

    // Convert icon SVG code snippet into React component
    // SVG code snippet from Heroicons
    const LikeIcon = ({ className }) => ( //Component names must start with a capital letter to render correctly (LikeIcon)
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className={className}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
            />
        </svg>
    );

    const DislikeIcon = ({ className }) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className={className}
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 0 1-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.75 2.25 2.25 0 0 0 9.75 22a.75.75 0 0 0 .75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 0 0 2.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384m-10.253 1.5H9.7m8.075-9.75c.01.05.027.1.05.148.593 1.2.925 2.55.925 3.977 0 1.487-.36 2.89-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.918 1.227h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 0 0 .303-.54"
            />
        </svg>
    );

    const CommentIcon = ({ className }) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className={className}
        >
            <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
        </svg>
    );

    const ShareIcon = ({ className }) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className={className}
        >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
        </svg>
    );


    // toggle function to activate report modal
    const toggleReportModal = () => {
        if (user) {
            setShowReportModal(prev => !prev);
        } else {
            dispatch(toggleUIState({ key: 'showLoginPost' }));
        }
    };

    // Icon ID numbers
    const iconIds = {
        starYellow: 12,
        heartGray: 13,
        heartPink: 14,
        dislikeGray: 15,
        dislikeBlue: 16,
        boldCommentGray: 17,
        paperPlaneGray: 18,
        defaultProfilePhoto: 29,
        heartWhite: 21,
        dislikeWhite: 22,
        boldCommentWhite: 23,
        paperPlaneWhite: 24,
        dots: 4
    };

    // For fetching all icons
    const { data: iconsData, isError: isIconsError, isLoading: isIconsLoading } = useGetAllIconsQuery();

    // Helper function to get icon URL by ID
    const getIconURL = useCallback((id) => {
        if (!iconsData || !iconsData.data || isIconsLoading || isIconsError) return '';
        const icon = iconsData.data.find(icon => icon.id === id);
        return icon ? `${BASE_URL}${icon.attributes.image.data[0].attributes.formats.thumbnail.url}` : '';
    }, [iconsData, isIconsLoading, isIconsError]);

    const dispatch = useDispatch();

    // Check whether the user’s system is set to a dark color scheme
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const isDarkMode = darkModeQuery.matches;

    // Text color
    const unclickedLikeColor = isDarkMode ? 'text-white' : 'text-gray-500';
    const unclickedDislikeColor = isDarkMode ? 'text-white' : 'text-gray-500';
    const commentColor = isDarkMode ? 'text-white' : ' text-gray-500';
    const shareColor = isDarkMode ? ' text-white' : ' text-gray-500';

    // For checking user who liked or disliked (currently logged in user)
    const { user } = useSelector((state) => state.auth);

    const [likeColor, setLikeColor] = useState(unclickedLikeColor);
    const [likeCount, setLikeCount] = useState(args.like ? +args.like.length : 0);

    const [dislikeColor, setDislikeColor] = useState(unclickedDislikeColor);
    const [dislikeCount, setDislikeCount] = useState(args.dislike ? +args.dislike.length : 0);

    // For report function
    const [showReportModal, setShowReportModal] = useState(false);


    // Like and dislike count and color from displayedLikeDislike slice (Obtained by listening to the value dispatched from CommentsPopup.js)
    const currentLikeCountFromCP = useSelector((state) => state.displayedLikeDislike.likeNumberTracker[args.id]);
    // console.log("ReviewCard currentLikeCountFromCP: ", currentLikeCountFromCP);

    const currentLikeColorFromCP = useSelector((state) => state.displayedLikeDislike.likeColorTracker[args.id]);
    // console.log("ReviewCard currentLikeColorFromCP: ", currentLikeColorFromCP);

    const currentDislikeCountFromCP = useSelector((state) => state.displayedLikeDislike.dislikeNumberTracker[args.id]);
    // console.log("ReviewCard currentDislikeCountFromCP: ", currentDislikeCountFromCP);

    const currentDislikeColorFromCP = useSelector((state) => state.displayedLikeDislike.dislikeColorTracker[args.id]);
    // console.log("ReviewCard currentDislikeColorFromCP: ", currentDislikeColorFromCP);

    // useEffect hook for like state 
    useEffect(() => { // This runs every time the dependencies change (So the like state will be updated immediately after user login)
        if (user) {

            const currentUserId = user ? user.id : -1;
            const userHasLiked = args.like.some(user => user.id === currentUserId);

            const latestLikeColor = userHasLiked ? 'text-red-500' : unclickedLikeColor;
            setLikeColor(latestLikeColor);
            dispatch(setCurrentLikeColor({ id: args.id, color: latestLikeColor }));

        } else {
            // If the user is not logged in, reset the colors
            setLikeColor(unclickedLikeColor);
        }
    }, [user, args.like, args.id, dispatch, unclickedLikeColor]);

    // useEffect hook for dislike state
    useEffect(() => { // This runs every time the dependencies change (So the dislike state will be updated immediately after user login)
        if (user) {

            const currentUserId = user ? user.id : -1;
            const userHasDisliked = args.dislike.some(user => user.id === currentUserId);

            const latestDislikeColor = userHasDisliked ? 'text-blue-500' : unclickedDislikeColor;
            setDislikeColor(latestDislikeColor);
            dispatch(setCurrentDislikeColor({ id: args.id, color: latestDislikeColor }));

        } else {
            setDislikeColor(unclickedDislikeColor);
        }
    }, [user, args.dislike, args.id, dispatch, unclickedDislikeColor]);

    useEffect(() => { // useEffect hook runs every time the dependencies change (So like and dislike state will be updated immediately after user login)
        if (user) {
            // If the user is logged in, check if the like icon has been clicked on the CommentsPopup
            if (currentLikeColorFromCP && currentLikeCountFromCP >= 0) {
                setLikeColor(currentLikeColorFromCP);
                dispatch(setCurrentLikeColor({ id: args.id, color: currentLikeColorFromCP }));
                setLikeCount(currentLikeCountFromCP);
                dispatch(setCurrentLikeCount({ id: args.id, likes: currentLikeCountFromCP }));
            }

            // If the user is logged in, check if the dislike icon has been clicked on the CommentsPopup
            if (currentDislikeColorFromCP && currentDislikeCountFromCP >= 0) {
                setDislikeColor(currentDislikeColorFromCP);
                dispatch(setCurrentDislikeColor({ id: args.id, color: currentDislikeColorFromCP }));
                setDislikeCount(currentDislikeCountFromCP);
                dispatch(setCurrentDislikeCount({ id: args.id, dislikes: currentDislikeCountFromCP }));
                console.log("currentdislikecount dispatched from rc useeffect: ", currentDislikeCountFromCP);
            }

        } else {
            // If the user is not logged in, reset the colors
            setLikeColor(unclickedLikeColor);
            setDislikeColor(unclickedDislikeColor);
        }
    }, [user, currentLikeColorFromCP, currentLikeCountFromCP, currentDislikeColorFromCP, currentDislikeCountFromCP, args.id, dispatch, unclickedDislikeColor, unclickedLikeColor]);

    const [showSharePopup, setShowSharePopup] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [showCommentPopup, setShowCommentPopup] = useState(false);
    const [showDotsPopup, setShowDotsPopup] = useState(false);

    // For switching cases between Review, Blog, and QnA
    const { selectedButton } = useSelector((state) => state.ui);

    // RTK Query hook calls for updating likes and dislikes
    const [updateReviewLikes] = useUpdateReviewLikesMutation();
    const [updateReviewDislikes] = useUpdateReviewDislikesMutation();
    const [updateBlogLikes] = useUpdateBlogLikesMutation();
    const [updateBlogDislikes] = useUpdateBlogDislikesMutation();
    const [updateQnALikes] = useUpdateQnALikesMutation();
    const [updateQnADislikes] = useUpdateQnADislikesMutation();

    const [getUserNotificationPreferences] = useLazyGetUserNotificationPreferencesQuery();

    const [createNotification] = useCreateNotificationMutation();
    const [deleteNotification] = useDeleteNotificationMutation();
    const { data: notificationsData, refetch: fetchToBeDeletedNotifications} = useGetNotificationsQuery(
        {
            notifType: "like",
            fromUser: user?.id,
            toUser: args.posterId,
            ...(selectedButton === "review" && { relatedReview: args.id }),
            ...(selectedButton === "qna" && { relatedQna: args.id }),
            ...(selectedButton === "blog" && { relatedBlog: args.id }),
        },
        { skip: !user?.id }
    );

    const handleLikeClick = async () => {

        if (user) { // Checks if user exists (User is logged in)
            try {
                const isRed = likeColor === 'text-red-500';
                const wasDisliked = dislikeColor === 'text-blue-500';

                // Set and dispatch the new like count
                const newLikeCount = isRed ? likeCount - 1 : likeCount + 1;
                setLikeCount(newLikeCount);
                dispatch(setCurrentLikeCount({ id: args.id, likes: newLikeCount }));

                // Set and dispatch the new like color
                const newLikeColor = isRed ? unclickedLikeColor : 'text-red-500';
                setLikeColor(newLikeColor);
                dispatch(setCurrentLikeColor({ id: args.id, color: newLikeColor }));

                // Handle the case where the user clicks the gray like icon when the dislike icon is blue (was clicked)
                if (!isRed && wasDisliked) {

                    // Calculate the new dislike count
                    let newDislikeCount = dislikeCount - 1;
                    if (newDislikeCount < 0) {
                        newDislikeCount = 0;
                    }

                    setDislikeCount(newDislikeCount);
                    dispatch(setCurrentDislikeCount({ id: args.id, dislikes: newDislikeCount }));

                    setDislikeColor(unclickedDislikeColor);
                    dispatch(setCurrentDislikeColor({ id: args.id, color: unclickedDislikeColor }));

                    // Update the dislike count on the Strapi backend based on the selected button (Review, QnA, or Blog)
                    switch (selectedButton) {
                        case "review":
                            await updateReviewDislikes({ reviewId: args.id, userWhoDisliked: user, existingUsersWhoDisliked: args.dislike, dislikeIconColor: dislikeColor });
                            break;
                        case "qna":
                            await updateQnADislikes({ qnaId: args.id, userWhoDisliked: user, existingUsersWhoDisliked: args.dislike, dislikeIconColor: dislikeColor });
                            break;
                        default:
                            await updateBlogDislikes({ blogId: args.id, userWhoDisliked: user, existingUsersWhoDisliked: args.dislike, dislikeIconColor: dislikeColor });
                            break;
                    }
                }

                // Update the like count on the Strapi backend and sync icon states with icons on CommentsPopup.js based on the selected button (Review, QnA, or Blog)
                switch (selectedButton) {
                    case "review":
                        await updateReviewLikes({ reviewId: args.id, userWhoLiked: user, existingUsersWhoLiked: args.like, likeIconColor: likeColor });
                        console.log('Successfully updated Review like count!');
                        break;
                    case "qna":
                        await updateQnALikes({ qnaId: args.id, userWhoLiked: user, existingUsersWhoLiked: args.like, likeIconColor: likeColor });
                        console.log('Successfully updated QnA like count!');
                        break;
                    default:
                        const response = await updateBlogLikes({ blogId: args.id, userWhoLiked: user, existingUsersWhoLiked: args.like, likeIconColor: likeColor });
                        console.log('Successfully updated Blog like count! API response: ', response);
                        break;
                }

                if (isRed) {
                    await fetchToBeDeletedNotifications();
                    notificationsData?.data?.forEach(async notif => {
                        await deleteNotification(notif?.id);
                    });

                } else if (user.id !== args.posterId) {
                    const inistialPosterData = await getUserNotificationPreferences(args.posterId).unwrap();
                    const posterNotificationPreferences = getUserPreferences(inistialPosterData);
                    const wantsLikeNotifications = posterNotificationPreferences.inApp.like;

                    if (wantsLikeNotifications) {
                        await createNotification(buildNotificationData({
                            type: "like",
                            fromUserId: user.id,
                            fromUserName: user.username,
                            toUser: args.posterId,
                            postType: selectedButton,
                            postId: args.id,
                        }));
                        await fetchToBeDeletedNotifications();
                    }
                }
            } catch (error) {
                console.error('Error updating like count:', error);
            }
        } else {
            dispatch(toggleUIState({ key: 'showLoginPost' })); // If the user does not exist (User is not logged in), show Login popup window
            return;
        }
    };

    const handleDislikeClick = async () => {
        if (user) {
            try {
                const isBlue = dislikeColor === 'text-blue-500';
                const wasLiked = likeColor === 'text-red-500';

                // Set and dispatch the new dislike count
                const newDislikeCount = isBlue ? dislikeCount - 1 : dislikeCount + 1;
                setDislikeCount(newDislikeCount);
                dispatch(setCurrentDislikeCount({ id: args.id, dislikes: newDislikeCount }));

                // Set and dispatch the new dislike color
                const newDislikeColor = isBlue ? unclickedLikeColor : 'text-blue-500';
                setDislikeColor(newDislikeColor);
                dispatch(setCurrentDislikeColor({ id: args.id, color: newDislikeColor }));

                //Handles the case where the user clicks the gray dislike icon when the like icon is red (was clicked)
                if (!isBlue && wasLiked) {

                    // Calculate the new like count
                    let newLikeCount = likeCount - 1;
                    if (newLikeCount < 0) {
                        newLikeCount = 0;
                    }
                    setLikeCount(newLikeCount);
                    dispatch(setCurrentLikeCount({ id: args.id, likes: newLikeCount }));

                    setLikeColor(unclickedLikeColor);
                    dispatch(setCurrentLikeColor({ id: args.id, color: unclickedLikeColor }));

                    // Update the like count on the Strapi backend based on the selected button (Review, QnA, or Blog)
                    switch (selectedButton) {
                        case "review":
                            await updateReviewLikes({ reviewId: args.id, userWhoLiked: user, existingUsersWhoLiked: args.like, likeIconColor: likeColor });
                            break;
                        case "qna":
                            await updateQnALikes({ qnaId: args.id, userWhoLiked: user, existingUsersWhoLiked: args.like, likeIconColor: likeColor });
                            break;
                        default:
                            await updateBlogLikes({ blogId: args.id, userWhoLiked: user, existingUsersWhoLiked: args.like, likeIconColor: likeColor });
                            break;
                    }

                    await fetchToBeDeletedNotifications();
                    notificationsData?.data?.forEach(async notif => {
                        await deleteNotification(notif?.id);
                    });
                }

                // Update the dislike count on the Strapi backend based on the selected button (Review, QnA, or Blog)
                switch (selectedButton) {
                    case "review":
                        await updateReviewDislikes({ reviewId: args.id, userWhoDisliked: user, existingUsersWhoDisliked: args.dislike, dislikeIconColor: dislikeColor });
                        console.log('Successfully updated Review dislike count!');
                        break;
                    case "qna":
                        await updateQnADislikes({ qnaId: args.id, userWhoDisliked: user, existingUsersWhoDisliked: args.dislike, dislikeIconColor: dislikeColor });
                        console.log('Successfully updated QnA dislike count!');
                        break;
                    default:
                        await updateBlogDislikes({ blogId: args.id, userWhoDisliked: user, existingUsersWhoDisliked: args.dislike, dislikeIconColor: dislikeColor });
                        console.log('Successfully updated Blog dislike count!');
                        break;
                }
            } catch (error) {
                console.error('Error updating dislike count:', error);
            }
        }
        else {
            dispatch(toggleUIState({ key: 'showLoginPost' })); // If the user does not exist (User is not logged in), show Login popup window
            return;
        }
    };

    const toggleSharePopup = () => {
        if (user) {
            if (showSharePopup) {
                setIsClosing(true);
                setTimeout(() => {
                    setShowSharePopup(false);
                    setIsClosing(false);
                }, 150);
            } else {
                setShowSharePopup(true);
            }
        } else {
            dispatch(toggleUIState({ key: 'showLoginPost' })); // If the user does not exist (User is not logged in), show Login popup window
            return;
        }
    };

    const toggleCommentPopup = () => {
        if (user) {
            setShowCommentPopup(prevState => !prevState);
        } else {
            dispatch(toggleUIState({ key: 'showLoginPost' })); // If the user does not exist (User is not logged in), show Login popup window
            return;
        }
    };

    const toggleDotsPopup = () => {
        if (user) {
            setShowDotsPopup(prevState => !prevState);
        } else {
            dispatch(toggleUIState({ key: 'showLoginPost' })); // If the user does not exist (User is not logged in), show Login popup window
            return;
        }
    };

    const collectionMapping = {
        review: 'reviews',
        blog: 'blogs',
        qna: 'qnas'
    };
    
    const handleDeleteClick = (id, selectedButton) => {
        if (typeof args.onShowDeletePopup === 'function') {
            args.onShowDeletePopup({
                postId: id,
                postType: collectionMapping[selectedButton] || selectedButton,
            });
        }
        toggleDotsPopup();
    };

    return (
        <div class="w-full sm:w-11/12 h-auto bg-white dark:bg-gray-700 shadow-md mb-4 rounded-lg pl-2 sm:hover:shadow-xl transition duration-300 m-auto relative">
            <div class="flex items-center pt-2">
                <div class="w-14 h-12 sm:w-16 sm:h-16 overflow-hidden rounded-full">
                    {!isIconsLoading &&
                        <img class="w-full h-full object-cover"
                            src={args.avatar == null ? getIconURL(iconIds.defaultProfilePhoto) : `${BASE_URL}${args.avatar.url}`} alt="Profile avatar" />
                    }
                </div>
                <div class="flex justify-between w-full px-6 items-center ml-auto">
                    <h1 class="ml-[-6%] sm:ml-0 text-2xl sm:text-3xl font-bold text-gray-400 break-words whitespace-normal max-w-[8ch] sm:max-w-none">{args.name && args.name.length > 15? args.name.slice(0, 15) + '...' : args.name || "Anonymous"}</h1>
                    <div class="flex h-1/2 items-center justify-end space-x-1">
                        <p class="text-yellow-500 font-bold">{args.rating ? args.rating : ""}</p>
                        {!isIconsLoading && args.rating ? <img src={getIconURL(iconIds.starYellow)} class="w-4 h-4" alt="Star icon" /> : ""}
                        <h2 class="text-base sm:text-xl font-semibold text-gray-400 ml-2">{args.posttime ? args.posttime : "Just now"}</h2>
                        <button onClick={toggleDotsPopup}>
                            <img src={getIconURL(iconIds.dots)} class="w-6" alt="Options" />
                        </button>
                        {showDotsPopup && (
                            <div class="absolute right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-20 p-2 w-[100px]">
                                <ul class="space-y-2">
                                    {args.isCurrentUser ? (
                                        <li onClick={() => handleDeleteClick(args.id, selectedButton)} className="cursor-pointer hover:bg-gray-100 p-2 rounded text-red-600">
                                        Delete
                                    </li>
                                    
                                    ) : (
                                        <li onClick={toggleReportModal} class="cursor-pointer hover:bg-gray-100 p-2 rounded text-red-600">Report</li>
                                    )}
                                    {/* `<li class="cursor-pointer hover:bg-gray-100 p-2 rounded text-red-600">Block</li>
                                    <li class="cursor-pointer hover:bg-gray-100 p-2 rounded">Hide</li>` */}
                                    <li onClick={toggleDotsPopup} class="cursor-pointer hover:bg-gray-100 p-2 rounded text-black">Close</li>
                                </ul>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            <div class="border-t border-gray-300 mr-5 mt-1" />

            {/* This is the users Review words at Review page */}
            <div>
            <CommentText
                text={args.desc}
                className="text-gray-600 dark:text-gray-200 font-normal text-sm sm:text-base pr-4 break-words"
                style={{ wordBreak: 'break-word' }}
            />
            </div>

            <div class="flex relative">
                <button onClick={handleLikeClick}>
                    <div className="flex pr-5 items-center py-3">
                        <LikeIcon className={`${likeColor} w-7`} />
                        <p className={`${likeColor} text-base`}>
                            {likeCount}
                        </p>
                    </div>
                </button>
                <button onClick={handleDislikeClick}>
                    <div class="flex pr-5 items-center py-3">
                        <DislikeIcon className={`${dislikeColor} w-7`} />
                        <p className={`${dislikeColor} text-base`}>
                            {dislikeCount}
                        </p>
                    </div>
                </button>
                <button onClick={toggleCommentPopup}>
                    <div class="flex pr-5 items-center py-3">
                        {!isIconsLoading &&
                            <CommentIcon className={`${commentColor} w-7`} />
                        }
                        <p className={`text-base ${commentColor}`}>
                            {args.replies.data.length ? args.replies.data.length : 0}
                        </p>
                    </div>
                </button>
                {showCommentPopup && !isIconsLoading && (
                    <CommentsPopup
                        initialPostID={args.id}
                        initialPosterID={args.posterId}
                        initialName={args.name}
                        initialComment={args.comment}
                        initialCommentCount={args.replies.data.length}
                        initialLikeCount={args.like}
                        initialDislikeCount={args.dislike}
                        initialDesc={args.desc}
                        initialPosttime={args.posttime}
                        initialAvatar={args.avatar == null ? getIconURL(iconIds.defaultProfilePhoto) : `${BASE_URL}${args.avatar.url}`}
                        followingComments={args.replies}
                        onClose={toggleCommentPopup}
                    />
                )}
                <button onClick={toggleSharePopup} class="relative">
                    <div class="flex items-center py-3">
                        {!isIconsLoading &&
                            <ShareIcon className={`${shareColor} w-7`} />
                        }
                        <p class={`text-base ${shareColor}`}>
                            {args.share ? args.share : 0}
                        </p>
                    </div>

                    {(showSharePopup || isClosing) && (
                        <div class={`absolute bottom-full left-0 mt-2 shadow-lg z-10 p-4 bg-white border border-gray-300 rounded-lg w-[160px] ${isClosing ? 'animate-fadeOutDown' : 'animate-fadeInUp'}`}>
                            <div class="flex items-center space-x-4">
                                <img
                                    src={FaceBook}
                                    alt="Facebook"
                                    onClick={() => window.open('https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fstudentschoice.blog%2F&amp;src=sdkpreparse', '_blank')}
                                    class="w-8 h-8 cursor-pointer rounded-md transition-transform transform hover:scale-110 hover:shadow-md"
                                />
                                <img
                                    src={X}
                                    alt="X"
                                    onClick={() => {
                                        const tweetText = `${args.desc} %0a%0aCheck out Students Choice! A university review site from students, for students. Discover universities, share experiences, make informed decisions. studentschoice.blog`;
                                        const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
                                        window.open(twitterUrl, '_blank');
                                    }}
                                    class="w-8 h-8 cursor-pointer rounded-md transition-transform transform hover:scale-110 hover:shadow-md"
                                />
                            </div>
                        </div>
                    )}

                    {/*report function modal*/}
                    {showReportModal && (
                        <ReportFlow
                            onClose={() => setShowReportModal(false)}
                            reviewId={args.id}
                            userId={user?.id}
                        />
                    )}




                </button>
            </div>

        </div>
    );
}

export default ReviewCard;