import {setCredentials} from "../src/app/features/authentication/AuthenticationReducer";
import {toggleUIState} from "../src/app/features/ui/UIReducer";

export const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const formattedDay = day < 10 ? '0' + day : day;
    const formattedMonth = month < 10 ? '0' + month : month;

    return `${formattedDay}/${formattedMonth}/${year}`;
};


export const getPostData = () => {
    const baseData = {
        commentText: trimmedReplyText,  // Use trimmed text
        users_permissions_user: user.id,
    };

    switch (selectedButton) {
        case "review":
            return {
                ...baseData,
                reviews: { id: args.initialID },
            };
        case "qna":
            return {
                ...baseData,
                qnas: { id: args.initialID },
            };
        default:
            return {
                ...baseData,
                blogs: { id: args.initialID },
            };
    }
};

export  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if a post is already being added
    if (addingPost) {
        return;
    }

    setAddingPost(true);
    setError("");

    const postText = e.target.elements.postTextInput.value.trim();
    if (!postText) {
        setError("Post cannot be empty or just spaces");
        setAddingPost(false);
        return;
    }

    const idInteractionName = interactionName.split("/")[1];
    const postRating = rating || 0;

    const getPageType = () => {
        switch (interactionName.split("/")[0]) {
            case "program-pages": return 'program_page';
            case "subject-pages": return 'subject_page';
            default: return 'university_page';
        }
    };

    const getPostData = () => {
        const baseData = {
            likes: 0,
            text: postText,
            users_permissions_user: user.id,
        };

        switch (postTypeSelect) {
            case "reviews":
                return {
                    ...baseData,
                    reviewLikes: baseData.likes,
                    reviewText: baseData.text,
                    reviewRating: postRating,
                    [getPageType()]: { id: idInteractionName },
                };
            case "qnas":
                return {
                    ...baseData,
                    qnaLikes: baseData.likes,
                    qnaText: baseData.text,
                    [getPageType()]: { id: idInteractionName },
                };
            default:
                return {
                    ...baseData,
                    blogLikes: baseData.likes,
                    blogText: baseData.text,
                    [getPageType()]: { id: idInteractionName },
                };
        }
    };

    const newPostData = getPostData();

    try {
        await handleAddPost({ newPostData, postTypeSelect });
        const updatedUserProfile = await refetch();
        dispatch(setCredentials(updatedUserProfile.data));
        dispatch(toggleUIState({ key: 'showCreatePost' }));
    } catch (error) {
        console.error(error);
    } finally {
        setAddingPost(false);

        // Optional: Cooldown timer to prevent immediate re-posting
        setTimeout(() => {
            setAddingPost(false); // Re-enable the button after the cooldown
        }, 3000); // 3-second cooldown
    }
};