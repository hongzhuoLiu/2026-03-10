import React, { useState, useEffect } from 'react';
import CrossBtnLight from '../../images/icons/CrossLight.png';

import { BASE_URL } from "../../API";
import { useAddCommentMutation } from "../../app/service/addCommentAPI";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../app/features/authentication/AuthenticationReducer";
import { useGetUserDetailsQuery } from "../../app/service/usersAPI";
import { useGetBlogDataQuery, useGetQnADataQuery, useGetReviewDataQuery } from "../../app/service/any-pagesAPI";

import { useLazyGetUserNotificationPreferencesQuery } from '../../app/service/usersAPI.js';

// Named import for updating Review, Blog, and QnA Like and Dislike count
import {
    useUpdateReviewLikesMutation,
    useUpdateReviewDislikesMutation,
    useUpdateBlogLikesMutation,
    useUpdateBlogDislikesMutation,
    useUpdateQnALikesMutation,
    useUpdateQnADislikesMutation
} from '../../app/service/reviewCardLikesAndDislikesAPI.js';

// Named import for updating Comments' Likes and Dislikes
import {
    useUpdateCommentLikesMutation,
    useUpdateCommentDislikesMutation
} from '../../app/service/commentLikesAndDislikesAPI';

import { 
    useGetNotificationsQuery,
    useCreateNotificationMutation,
    useUpdateNotificationMutation,
    useMarkNotificationReadMutation,
    useDeleteNotificationMutation,
    buildNotificationData,
} from "../../app/service/notificationsAPI";

import { getUserPreferences } from "../../Profile/NotificationSettings.js";

// Named import for showing users the login popup window before liking/disliking/commenting/sharing/reporting
import { toggleUIState } from "../../app/features/ui/UIReducer";

// Named import for syncing displayed like and dislike count between ReviewCard.js and CommentsPopup.js
import { setCurrentLikeCount, setCurrentLikeColor, setCurrentDislikeCount, setCurrentDislikeColor } from '../../app/features/syncingIconStates/displayedLikeDislike.js';

//The Read More Button function
import CommentText from './CommentText';

function CommentsPopup(args) {

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const formattedDay = day < 10 ? '0' + day : day;
        const formattedMonth = month < 10 ? '0' + month : month;

        return `${formattedDay}/${formattedMonth}/${year}`;
    };

    useEffect(() => {
        // Disable background scrolling
        document.body.style.overflow = 'hidden';

        // Clean up function to re-enable scrolling when the component unmounts
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { interactionName } = useSelector((state) => state.ui);
    const { selectedButton } = useSelector((state) => state.ui);

    const { refetch } = useGetUserDetailsQuery();
    const { refetch: reviewRefetch } = useGetReviewDataQuery(interactionName);
    const { refetch: blogsRefetch } = useGetBlogDataQuery(interactionName);
    const { refetch: qnasRefetch } = useGetQnADataQuery(interactionName);
    const [getUserNotificationPreferences] = useLazyGetUserNotificationPreferencesQuery();

    const [replyText, setReplyText] = useState("");
    const [sendingReply, setSendingReply] = useState(false);
    const [error, setError] = useState("");  // State for error message
    const [showErrorPopup, setShowErrorPopup] = useState(false);  // State to control popup visibility

    const [addComment] = useAddCommentMutation();
    const [createNotification] = useCreateNotificationMutation();

    const handleAddComment = async (values) => {
        try {
            const result = await addComment(values).unwrap();
            console.log(result);
        } catch (error) {
            console.error(error);
        }
    };

    const handleReply = async () => {
        setSendingReply(true);

        // Trim the reply text to remove leading and trailing whitespace
        const trimmedReplyText = replyText.trim();

        // Check if the trimmed reply text is empty
        if (!trimmedReplyText) {
            setError("Comment cannot be empty or just spaces");
            setShowErrorPopup(true);
            setSendingReply(false);  // Reset sending state

            // Hide the popup after 3 seconds
            setTimeout(() => {
                setShowErrorPopup(false);
            }, 3000);

            return;
        }

        const getPostData = () => {
            const baseData = {
                commentText: trimmedReplyText,  // Use trimmed text
                users_permissions_user: user.id,
            };

            switch (selectedButton) {
                case "review":
                    return {
                        ...baseData,
                        reviews: { id: args.initialPostID },
                    };
                case "qna":
                    return {
                        ...baseData,
                        qnas: { id: args.initialPostID },
                    };
                default:
                    return {
                        ...baseData,
                        blogs: { id: args.initialPostID },
                    };
            }
        };

        const newPostData = getPostData();

        try {
            const newCommentId = await handleAddComment({ newPostData });

            if (args.initialPosterID !== user.id) {
                const inistialPosterData = await getUserNotificationPreferences(args.initialPosterID).unwrap();
                const posterNotificationPreferences = getUserPreferences(inistialPosterData);
                const wantsCommentNotifications = posterNotificationPreferences.inApp.comment;

                if (wantsCommentNotifications) {
                    const notificationData = buildNotificationData({
                        type: "comment",
                        body: trimmedReplyText,
                        fromUserId: user.id,
                        fromUserName: user.username,
                        toUser: args.initialPosterID,
                        postType: selectedButton,
                        postId: args.initialPostID,
                        commentId: newCommentId,
                    });
                    await createNotification(notificationData);
                }
            }

            // const updatedUserProfile = await refetch();
            setReplyText(""); // Clear the reply text after successful submission

            // if (updatedUserProfile && updatedUserProfile.data) {
            //     dispatch(setCredentials(updatedUserProfile.data));
            // } else {
            //     // Optionally handle error, show a message, or keep the user logged in
            //     console.error("Failed to refetch user profile. Not updating credentials.");
            // }

            // Refetch data to reflect changes after comment is added
            reviewRefetch();
            blogsRefetch();
            qnasRefetch();
        } catch (error) {
            console.error(error);
        } finally {
            setSendingReply(false); // Ensure the sending state is reset
        }
    };

    const refetchTab = () => {
        switch (selectedButton) {
            case "review":
                reviewRefetch();
                break;
            case "blog":
                blogsRefetch();
                break;
            case "qna":
                qnasRefetch();
                break;
            default:
                break;
        }
    };

    return (
        <div className="fixed top-0 left-0 m-0 w-screen h-screen flex justify-center items-center z-10 bg-black bg-opacity-50">
            <div className="popUpStyling relative h-full w-full sm:w-[60%]">
                <div className="flex justify-end items-center relative w-full h-[8vh] mt-12 sm:mt-0">
                    <img src={CrossBtnLight}
                        className="h-[50px] ml-3 bg-white dark:bg-gray-700 rounded-md shadow-md sm:hover:shadow-xl transition duration-300 cursor-pointer"
                        alt="Cancel button"
                        onClick={args.onClose}
                    />
                </div>

                {/* Error Popup */}
                {showErrorPopup && (
                    <div className="absolute top-0 left-1/2 mt-5 text-center transform -translate-x-1/2 bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 py-2 px-4 rounded-md shadow-lg">
                        {error}
                    </div>
                )}

                <div className="w-full h-full overflow-y-auto mb-[5%] sm:mb-0">
                    {/* Comment they are replying to */}
                    <InitialComment
                        name={args.initialName}
                        commentCount={args.initialCommentCount}
                        desc={args.initialDesc}
                        like={args.initialLikeCount}
                        dislike={args.initialDislikeCount}
                        posttime={args.initialPosttime}
                        avatar={args.initialAvatar}
                        id={args.initialPostID}
                        posterId={args.initialPosterID}
                    />

                    {/* Display all additional replies */}
                    {args.followingComments && args.followingComments.data.length > 0 ? (
                        <div>
                            {args.followingComments.data.map((reply, index) => (
                                <Replies
                                    key={index}
                                    id={reply.id}
                                    posterId={reply.attributes.users_permissions_user?.data?.id ?? null}
                                    name={reply.attributes.users_permissions_user.data.attributes.username}
                                    desc={reply.attributes.commentText}
                                    posttime={formatDate(reply.attributes.createdAt)}
                                    avatar={
                                        reply.attributes.users_permissions_user.data.attributes.avatar.data ?
                                            `${BASE_URL}${reply.attributes.users_permissions_user.data.attributes.avatar.data.attributes.formats.thumbnail.url}`
                                            :
                                            `${BASE_URL}/uploads/Default_Profile_Photo_3220d06254.jpg`
                                    }
                                    likes={reply.attributes.likes.data}
                                    dislikes={reply.attributes.dislikes.data}
                                    onInteraction={refetchTab}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center">No replies to show.</p>
                    )}

                    {/* Input for replying */}
                    {user ?
                        <div className="flex flex-col mb-4 sm:flex-row items-center sm:pr-2 mt-4">
                            <input
                                className="editInputStyling w-full sm:w-[90%]"
                                placeholder="Type your reply"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                            />
                            {sendingReply ?
                                <button
                                    className="cursor-pointer inline-block bg-rose-900 hover:bg-rose-950 text-white font-bold py-3 px-4 rounded transition duration-300 mt-2 sm:mt-0 sm:ml-2"
                                    disabled={sendingReply}
                                >
                                    Sending Reply...
                                </button>
                                :
                                <button
                                    className="cursor-pointer inline-block bg-rose-900 hover:bg-rose-950 text-white font-bold py-3 px-4 rounded transition duration-300 mt-2 w-full sm:w-[100px] sm:mt-0 sm:ml-2"
                                    onClick={handleReply}
                                >
                                    Reply
                                </button>
                            }
                        </div>
                        :
                        <div className="flex flex-col sm:flex-row items-center pr-2 mt-4">
                            <p>Please login to reply!</p>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default CommentsPopup;

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

function InitialComment(args) {

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

    // Like and dislike count and color from displayedLikeDislike slice (Obtained by listening to the value dispatched from ReviewCard.js)
    const currentLikeCountFromRC = useSelector((state) => state.displayedLikeDislike.likeNumberTracker[args.id]);
    // console.log("commentsPopUp currentLikeCountFromRC: ", currentLikeCountFromRC);

    const currentLikeColorFromRC = useSelector((state) => state.displayedLikeDislike.likeColorTracker[args.id]);
    // console.log("commentsPopUp currentLikeColorFromRC: ", currentLikeColorFromRC);

    const currentDislikeCountFromRC = useSelector((state) => state.displayedLikeDislike.dislikeNumberTracker[args.id]);
    // console.log("commentsPopUp currentDislikeCountFromRC: ", currentDislikeCountFromRC);

    const currentDislikeColorFromRC = useSelector((state) => state.displayedLikeDislike.dislikeColorTracker[args.id]);
    // console.log("commentsPopUp currentDislikeColorFromRC: ", currentDislikeColorFromRC);

    const [likeColor, setLikeColor] = useState(currentLikeColorFromRC || unclickedLikeColor);
    const [likeCount, setLikeCount] = useState(currentLikeCountFromRC || (args.like ? +args.like.length : 0));

    const [dislikeColor, setDislikeColor] = useState(currentDislikeColorFromRC || unclickedDislikeColor);
    const [dislikeCount, setDislikeCount] = useState(currentDislikeCountFromRC || (args.dislike ? +args.dislike.length : 0));

    useEffect(() => { // useEffect hook runs every time the dependencies change (So like and dislike state will be updated immediately after user login)
        // Check if the like icon has been clicked on the ReviewCard
        if (currentLikeColorFromRC && currentLikeCountFromRC >= 0) {
            setLikeColor(currentLikeColorFromRC);
            dispatch(setCurrentLikeColor({ id: args.id, color: currentLikeColorFromRC }));
            setLikeCount(currentLikeCountFromRC);
            dispatch(setCurrentLikeCount({ id: args.id, likes: currentLikeCountFromRC }));
        }

        // Check if the dislike icon has been clicked on the ReviewCard
        if (currentDislikeColorFromRC && currentDislikeCountFromRC >= 0) {
            setDislikeColor(currentDislikeColorFromRC);
            dispatch(setCurrentDislikeColor({ id: args.id, color: currentDislikeColorFromRC }));
            setDislikeCount(currentDislikeCountFromRC);
            console.log("useeffect runs, current dislike count: ", { id: args.id, likes: currentDislikeCountFromRC });
            dispatch(setCurrentDislikeCount({ id: args.id, likes: currentDislikeCountFromRC }));
        }

    }, [currentLikeColorFromRC, currentLikeCountFromRC, currentDislikeColorFromRC, currentDislikeCountFromRC, args.id, dispatch]);

    // For switching cases between Review, Blog, and QnA
    const { selectedButton } = useSelector((state) => state.ui);

    // RTK Query hook calls for updating Review likes and dislikes
    const [updateReviewLikes] = useUpdateReviewLikesMutation(); // This syntax extracts the first element of the array returned by the RTK Query hook (the mutation function)
    const [updateReviewDislikes] = useUpdateReviewDislikesMutation();
    const [updateQnALikes] = useUpdateQnALikesMutation();
    const [updateQnADislikes] = useUpdateQnADislikesMutation();
    const [updateBlogLikes] = useUpdateBlogLikesMutation();
    const [updateBlogDislikes] = useUpdateBlogDislikesMutation();

    const [getUserNotificationPreferences] = useLazyGetUserNotificationPreferencesQuery();

    const [createNotification] = useCreateNotificationMutation();
    const [deleteNotification] = useDeleteNotificationMutation();
    const { data: notificationsData, refetch: fetchToBeDeletedNotifications} = useGetNotificationsQuery(
        {
            notifType: "like",
            fromUser: user.id,
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

                // Set and dispatch new like count
                const newLikeCount = isRed ? likeCount - 1 : likeCount + 1;
                setLikeCount(newLikeCount);
                console.log('Dispatching like count from CP:', { id: args.id, likes: newLikeCount });
                dispatch(setCurrentLikeCount({ id: args.id, likes: newLikeCount }));

                // Set and dispatch new like color
                const newLikeColor = isRed ? unclickedLikeColor : 'text-red-500';
                setLikeColor(newLikeColor);
                console.log('Dispatching like color from CP:', { id: args.id, color: newLikeColor });
                dispatch(setCurrentLikeColor({ id: args.id, color: newLikeColor }));

                // Handle the case where the user clicks the gray like icon when the dislike icon is blue (was clicked)
                if (!isRed && wasDisliked) {

                    // Calculate the new dislike count
                    const newDislikeCount = dislikeCount - 1;
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

                // Update the like count on the Strapi backend based on the selected button (Review, QnA, or Blog)
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
                        await updateBlogLikes({ blogId: args.id, userWhoLiked: user, existingUsersWhoLiked: args.like, likeIconColor: likeColor });
                        console.log('Successfully updated Blog like count!');
                        break;
                }

                if (isRed) {
                    await fetchToBeDeletedNotifications();
                    notificationsData?.data?.forEach(async notif => {
                        await deleteNotification(notif.id);
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
                    const newLikeCount = likeCount - 1;
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
                        await deleteNotification(notif.id);
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

    return (
        <div>
            <div className="flex items-center">
                <div className="w-10 h-10 sm:w-16 sm:h-14 overflow-hidden rounded-full">
                    <img className="w-full h-full object-cover"
                        src={args.avatar} alt="Profile avatar" />
                </div>
                <div className="flex justify-between w-full pl-6 items-center ml-auto">
                    <h1 className="text-base sm:text-3xl font-bold text-gray-500 break-words">{args.name && args.name.length > 15? args.name.slice(0, 15) + '...' : args.name || "Anonymous"}</h1>
                    <div className="flex h-1/2 items-center justify-end">
                        <h2 className="text-base sm:text-xl font-semibold text-gray-400 ml-2">{args.posttime ? args.posttime : "Just now"}</h2>
                    </div>
                </div>
            </div>
            <CommentText
                text={args.desc ? args.desc : "No content"}
                className="text-gray-600 dark:text-gray-300 break-words"
                style={{ wordBreak: 'break-word' }}
            />

            <div className="flex relative">
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
                <button>
                    <div className="flex pr-5 items-center py-3">
                        {
                            <CommentIcon className={`${commentColor} w-7`} />
                        }
                        <p className={`text-base ${commentColor}`}>
                            {args.commentCount ? args.commentCount : 0}
                        </p>
                    </div>
                </button>
                <button className="relative">
                    <div className="flex items-center py-3">
                        {
                            <ShareIcon className={`${shareColor} w-7`} />
                        }
                        <p class={`text-base ${shareColor}`}>
                            {args.share ? args.share : 0}
                        </p>
                    </div>
                </button>
            </div>
            <div className="h-[2px] bg-gray-300 w-11/12 mx-auto mt-0 sm:w-full sm:mt-0" />
        </div>
    );
}

function Replies(args) {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const isDarkMode = darkModeQuery.matches;
    const unclickedColor = isDarkMode ? 'text-white' : 'text-gray-500';

    const { user } = useSelector((state) => state.auth);

    // Like/dislike state
    const [likeColor, setLikeColor] = useState(user && args.likes.some(u => u.id === user.id) ? 'text-red-500' : unclickedColor);
    const [dislikeColor, setDislikeColor] = useState(user && args.dislikes.some(u => u.id === user.id) ? 'text-blue-500' : unclickedColor);

    const [likeCount, setLikeCount] = useState(args.likes.length);
    const [dislikeCount, setDislikeCount] = useState(args.dislikes.length);

    const [updateCommentLikes] = useUpdateCommentLikesMutation();
    const [updateCommentDislikes] = useUpdateCommentDislikesMutation();

    const [getUserNotificationPreferences] = useLazyGetUserNotificationPreferencesQuery();

    const [createNotification] = useCreateNotificationMutation();
    const [deleteNotification] = useDeleteNotificationMutation();
    const { data: notificationsData, refetch: fetchToBeDeletedNotifications} = useGetNotificationsQuery(
        {
            notifType: "like",
            fromUser: user?.id,
            toUser: args.posterId,
            relatedComment: args.id,
        },
        { skip: !user?.id }
    );

    const handleReplyLikeClick = async () => {
        if (!user) return;
        const isRed = likeColor === 'text-red-500';
        const wasDisliked = dislikeColor === 'text-blue-500';

        if (!isRed && wasDisliked) {
            const newDislikeCount = dislikeCount - 1;
            await updateCommentDislikes({
                commentId: args.id,
                userWhoDisliked: user,
                existingUsersWhoDisliked: args.dislikes,
                dislikeIconColor: dislikeColor
            });
            setDislikeCount(newDislikeCount);
            setDislikeColor(unclickedColor);
        }

        await updateCommentLikes({
            commentId: args.id,
            userWhoLiked: user,
            existingUsersWhoLiked: args.likes,
            likeIconColor: likeColor
        });

        if (isRed) {
            await fetchToBeDeletedNotifications();
            console.log("notificationsData to be deleted: ", notificationsData);
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
                    postType: "comment",
                    postId: args.id,
                }));
                await fetchToBeDeletedNotifications();
            }
        }

        setLikeColor(isRed ? unclickedColor : 'text-red-500');
        setLikeCount(isRed ? likeCount - 1 : likeCount + 1);

        if (args.onInteraction) args.onInteraction();
    };

    const handleReplyDislikeClick = async () => {
        if (!user) return;
        const isBlue = dislikeColor === 'text-blue-500';
        const wasLiked = likeColor === 'text-red-500';

        if (!isBlue && wasLiked) {
            const newLikeCount = likeCount - 1;
            await updateCommentLikes({
                commentId: args.id,
                userWhoLiked: user,
                existingUsersWhoLiked: args.likes,
                likeIconColor: likeColor
            });
            setLikeCount(newLikeCount);
            setLikeColor(unclickedColor);

            await fetchToBeDeletedNotifications();
            notificationsData?.data?.forEach(async notif => {
                await deleteNotification(notif?.id);
            });
        }

        await updateCommentDislikes({
            commentId: args.id,
            userWhoDisliked: user,
            existingUsersWhoDisliked: args.dislikes,
            dislikeIconColor: dislikeColor
        });

        setDislikeColor(isBlue ? unclickedColor : 'text-blue-500');
        setDislikeCount(isBlue ? dislikeCount - 1 : dislikeCount + 1);

        if (args.onInteraction) args.onInteraction();
    };

    return (
        <div className="py-1.5">
            <div className="flex justify-between items-center ml-10">
                <div className="w-full flex items-center justify-between">
                    <div className="w-10 h-10 sm:w-10 sm:h-10 overflow-hidden rounded-full">
                        <img className="w-full h-full object-cover"
                            src={args.avatar} alt="Profile avatar" />
                    </div>
                    <div className="flex justify-between w-full pl-3 items-center ml-auto">
                        <h1 className="text-base sm:text-3xl font-bold text-gray-500 break-words">{args.name && args.name.length > 15? args.name.slice(0, 15) + '...' : args.name || "Anonymous"}</h1>
                        <div className="flex h-1/2 items-center justify-end">
                            <h2 className="text-base sm:text-xl font-semibold text-gray-400 ml-2">{args.posttime ? args.posttime : "Just now"}</h2>
                        </div>
                    </div>
                </div>
            </div>

            <CommentText
                text={args.desc ? args.desc : "No content"}
                className="pl-[10%] text-gray-500 dark:text-gray-300 break-words"
                style={{ wordBreak: 'break-word' }}
            />

            <div className="flex relative ml-12">
                <button onClick={handleReplyLikeClick}>
                    <div className="flex pr-5 items-center py-3">
                        <LikeIcon className={`${likeColor} w-7`} />
                        <p className={`${likeColor} text-base`}>
                            {likeCount}
                        </p>
                    </div>
                </button>
                <button onClick={handleReplyDislikeClick}>
                    <div className="flex pr-5 items-center py-3">
                        <DislikeIcon className={`${dislikeColor} w-7`} />
                        <p className={`${dislikeColor} text-base`}>
                            {dislikeCount}
                        </p>
                    </div>
                </button>
            </div>

            <div className="h-[2px] bg-gray-300 w-11/12 ml-auto mt-0 sm:w-[95%] sm:mt-0" />


        </div>
    );
}