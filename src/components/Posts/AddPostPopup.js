import { useState, useEffect } from "react";
import CrossBtnLight from '../../images/icons/CrossLight.png';
import Star from '../../images/icons/StarGray.png';
import StarYellow from '../../images/icons/StarYellowFill.png';
import SelectButtonGroup from "../Elements/SelectButtonGroup";
import { useAddPostMutation } from "../../app/service/addPostAPI";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../app/features/authentication/AuthenticationReducer";
import { useGetUserDetailsQuery } from "../../app/service/usersAPI";
import { toggleUIState } from "../../app/features/ui/UIReducer";
import { useGetBlogDataQuery, useGetQnADataQuery, useGetReviewDataQuery } from "../../app/service/any-pagesAPI";
import { useGetHelpfulLinksDataQuery } from "../../app/service/any-pagesAPI";
import { store } from "../../app/store";
import SortingDropdown from "../Elements/SortingDropDown";

function AddPostPopup() { 
    const dispatch = useDispatch();
    useEffect(() => {
        const updateView = () => {
            dispatch(toggleUIState({ key: 'isMobileView', value: window.innerWidth <= 640 }));
        };
        updateView();

        window.addEventListener('resize', updateView);

        return () => {
            window.removeEventListener('resize', updateView);
        };
    }, [dispatch]);
    const isMobile = useSelector((state) => state.ui.isMobileView);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const { user } = useSelector((state) => state.auth);
    const { interactionName } = useSelector((state) => state.ui);

    const { refetch: reviewRefetch } = useGetReviewDataQuery(interactionName);
    const { refetch: blogsRefetch } = useGetBlogDataQuery(interactionName);
    const { refetch: qnasRefetch } = useGetQnADataQuery(interactionName);
    const { refetch: helpfulRefetch } = useGetHelpfulLinksDataQuery(interactionName);
    useGetUserDetailsQuery();
    const { refetch } = useGetUserDetailsQuery();

    const postTypeOptions = [
        { text: "Review", type: "reviews" },
        { text: "Blog", type: "blogs" },
        { text: "Ask a Question", type: "qnas" },
        { text: "Helpful Links", type: "helpfulLinks" },
    ];

    const [postTypeSelect, setPostTypeSelect] = useState("reviews");
    const [rating, setRating] = useState(0);
    const [{ error: addPostError, isLoading }] = useAddPostMutation();
    const [addingPost, setAddingPost] = useState(false);
    const [error, setError] = useState("");

    const handleRating = (rate) => {
        setRating(rate);
    };

    const { handleAddPost } = usePostAdder({
        reviewRefetch,
        blogsRefetch,
        qnasRefetch,
        helpfulRefetch,
        refetch,
        dispatch
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (addingPost) return;

        setAddingPost(true);
        setError("");

        const postText = e.target.elements.postTextInput.value.trim();
        const linkNameInput = e.target.elements.helpfulLinksNameInput?.value.trim() || "";

        if (!postText) {
            setError("Post cannot be empty or just spaces");
            setAddingPost(false);
            return;
        }
        if (postTypeSelect === "helpfulLinks" && !linkNameInput) {
            setError("Name of the Link cannot be empty");
            setAddingPost(false);
            return;
        }

        const splitted = interactionName.split("/");
        const pageTypePath = splitted[0];
        const pageId = splitted[1];
        const postRating = rating || 0;

        const getPageType = () => {
            switch (pageTypePath) {
                case "program-pages":
                    return 'program_page';
                case "subject-pages":
                    return 'subject_page';
                case "destination-pages":
                    return 'destination_page';
                case "facilities":
                    return 'facility';
                default:
                    return 'university_page';
            }
        };

        const baseData = {
            likes: 0,
            text: postText,
            users_permissions_user: user.id,
        };

        let newPostData = {};
        switch (postTypeSelect) {
            case "reviews":
                newPostData = {
                    ...baseData,
                    reviewLikes: baseData.likes,
                    reviewText: baseData.text,
                    reviewRating: postRating,
                    [getPageType()]: { id: pageId },
                };
                break;
            case "qnas":
                newPostData = {
                    ...baseData,
                    qnaLikes: baseData.likes,
                    qnaText: baseData.text,
                    [getPageType()]: { id: pageId },
                };
                break;
            case "blogs":
                newPostData = {
                    ...baseData,
                    blogLikes: baseData.likes,
                    blogText: baseData.text,
                    [getPageType()]: { id: pageId },
                };
                break;
            case "helpfulLinks":
                newPostData = {
                    linkName: linkNameInput,
                    linkUrl: baseData.text,
                    [getPageType()]: { id: pageId },
                };
                break;
            default:
                newPostData = baseData;
                break;
        }

        try {
            const result = await handleAddPost({ newPostData, postTypeSelect });
            
            // Refresh data based on post type
            switch (postTypeSelect) {
                case "reviews":
                    await reviewRefetch();
                    break;
                case "blogs":
                    await blogsRefetch();
                    break;
                case "qnas":
                    await qnasRefetch();
                    break;
                case "helpfulLinks":
                    await helpfulRefetch();
                    break;
                default:
                    break;
            }
            
            dispatch(toggleUIState({ key: 'showCreatePost' }));
        } catch (error) {
            console.error("Error in handleSubmit:", error);
            setError("Failed to submit post. Please try again.");
        } finally {
            setAddingPost(false);
        }
    };

    return (
        <div>
            <div className="fixed top-0 left-0 m-0 w-screen h-[100dvh] flex justify-center items-center z-10 bg-black bg-opacity-50">
                <div className="popUpStyling">
                    <div className="flex justify-end items-center relative w-full h-[8vh] mt-[3.5rem] sm:mt-0">
                        <img
                            src={CrossBtnLight}
                            className="h-[50px] ml-3 bg-white dark:bg-gray-700 rounded-md shadow-md sm:hover:shadow-xl transition duration-300 cursor-pointer"
                            alt="Cancel button"
                            onClick={() => {
                                dispatch(toggleUIState({ key: 'showCreatePost' }));
                            }}
                        />
                    </div>
                    <h1 className="text-2xl font-bold text-sc-red dark:text-gray-200 mt-[-3%]">
                        Create post!
                    </h1>
                    <form
                        className="w-4/5 mx-auto flex flex-col items-center justify-around h-full"
                        onSubmit={handleSubmit}
                    >
                        {isMobile ? (
                            <SortingDropdown
                                options={postTypeOptions.map(opt => ({ value: opt.type, label: opt.text}))}
                                selectedValue={postTypeSelect}
                                onChange={setPostTypeSelect}
                            />
                        ) : (
                            <SelectButtonGroup
                                options={postTypeOptions}
                                selectedOption={postTypeSelect}
                                onOptionChange={setPostTypeSelect}
                            />
                        )}
                        {postTypeSelect === "reviews" && (
                            <div className="flex h-[10%] items-center justify-center mt-[-3%]">
                                {[1, 2, 3, 4, 5].map((value) => (
                                    <img
                                        key={value}
                                        src={rating >= value ? StarYellow : Star}
                                        alt={`${value} star`}
                                        onClick={() => handleRating(value)}
                                        className="cursor-pointer h-[80%] mx-1"
                                    />
                                ))}
                            </div>
                        )}

                        {postTypeSelect === "helpfulLinks" && (
                            <div className="flex items-center w-full h-auto mb-2">
                                <input
                                    className="shadow-inner w-full h-[3rem] p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-200"
                                    name="helpfulLinksNameInput"
                                    placeholder="Name of the Link"
                                />
                            </div>
                        )}

                        <div className="flex items-center w-full h-1/3 sm:h-auto mt-[-2%]">
                            <textarea
                                className="shadow-inner overflow-y-auto w-full h-full sm:h-52 resize-none p-2 rounded-md align-top text-left bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-200"
                                name="postTextInput"
                                placeholder={
                                    postTypeSelect === "helpfulLinks"
                                        ? "Link"
                                        : "What do you want to say?"
                                }
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-white dark:bg-gray-700 border-none shadow-md flex justify-evenly items-center text-sc-red dark:text-gray-200 font-bold cursor-pointer w-1/2 h-[6vh] rounded-md sm:hover:shadow-xl transition duration-300 align-bottom mt-[-3%]"
                            disabled={addingPost}
                        >
                            {isLoading ? "Sending Post..." : "Post"}
                        </button>

                        {error && (
                            <h4 className="text-gray-500 dark:text-gray-300 mt-2">
                                {error}
                            </h4>
                        )}
                        {addPostError && (
                            <h4 className="text-gray-500 dark:text-gray-300 mt-2">
                                {addPostError.toString()}
                            </h4>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

function usePostAdder({ reviewRefetch, blogsRefetch, qnasRefetch, helpfulRefetch, refetch, dispatch }) {
    const [addPost] = useAddPostMutation();

    const handleAddPost = async (values) => {
        try {
            const result = await addPost(values).unwrap();

            reviewRefetch();
            blogsRefetch();
            qnasRefetch();
            helpfulRefetch();

            return result;
        } catch (error) {
            console.error("Error in handleAddPost:", error);
            throw error;
        }
    };

    return { handleAddPost };
}

export default AddPostPopup;
