import React from "react";
import { useSelector,useDispatch } from "react-redux";
import { useDeletePostMutation } from "../../app/service/deletePostAPI";
import { toggleUIState } from "../../app/features/ui/UIReducer";
import { useGetBlogDataQuery, useGetQnADataQuery, useGetReviewDataQuery } from "../../app/service/any-pagesAPI";
import { useState } from "react";
import { X,Check } from "lucide-react"; 

function DeletePostPopup({ postId, postType, onDeleted, onCancel }) {
    const { interactionName } = useSelector((state) => state.ui);

    const { refetch: reviewRefetch } = useGetReviewDataQuery(interactionName);
    const { refetch: blogsRefetch } = useGetBlogDataQuery(interactionName);
    const { refetch: qnasRefetch } = useGetQnADataQuery(interactionName);
    const dispatch = useDispatch();
    const [deletePost, { isLoading, error }] = useDeletePostMutation();
    const [isDeleted, setIsDeleted] = useState(false);
    
    const handleDelete = async () => {
        try {
            await deletePost({ postId, postType }).unwrap();

            setIsDeleted(true);
            onDeleted?.(); 

            // Refetch the data
            reviewRefetch();
            blogsRefetch();
            qnasRefetch();

        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            dispatch(toggleUIState({ key: 'showDeletePost', value: false }));
        }
    };

    return (
        <div className="fixed top-0 left-0 m-0 w-screen h-screen flex justify-center items-center z-10 bg-black bg-opacity-50">
          <div className="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center w-4/5 sm:w-1/3 h-[300px]">
            
            <button
            onClick={handleCancel}
            className="absolute top-2 right-2 text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white"
            >
            <X size={20} />
            </button>
      
            {isDeleted ? (
                <>
                <div className="flex justify-center items-center h-full">
                    <div className="flex flex-col items-center">
                    <div className="bg-green-500 rounded-full p-4 mb-4">
                        <Check size={100} className="text-white" />
                    </div>
                    <p className="text-lg font-semibold dark:text-gray-200 text-center">
                        Your post has been successfully deleted.
                    </p>
                    </div>
                </div>
                </>
            ) : (
                <>
                <h2 className="text-xl font-bold mb-4 dark:text-gray-200">Delete post?</h2>
                <p className="mb-6 text-gray-600 dark:text-gray-300">
                    Are you sure that you want to delete this post?
                </p>

                <div className="flex flex-col space-y-4">
                    <button
                    onClick={handleDelete}
                    className={`w-40 self-center border-4 rounded-lg px-4 py-2 font-bold transition-colors
                        ${isLoading 
                        ? 'border-sc-red bg-sc-red text-gray-200 cursor-wait'
                        : 'border-sc-red bg-sc-red text-white hover:bg-[#8B0221] hover:border-[#8B0221] dark:border-sc-red dark:bg-sc-red dark:text-gray-200 dark:hover:bg-[#8B0221] dark:hover:border-[#8B0221]'
                        }`}
                    disabled={isLoading}
                    >
                    {isLoading ? "Deleting..." : "Yes, Delete"}
                    </button>

                    <button
                    onClick={handleCancel}
                    className={`w-40 self-center border-4 rounded-lg px-4 py-2 font-bold transition-colors
                        ${isLoading
                        ? 'border-gray-400 border-gray-400 text-gray-400 cursor-not-allowed'
                        : 'border-gray-300 bg-gray-300 hover:bg-gray-400 hover:border-gray-400 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:border-gray-600'
                        }`}
                    disabled={isLoading}
                    >
                    Cancel
                    </button>
                </div>
                </>
            )}
      
            {error && (
              <p className="mt-4 text-sm text-red-500">
                {error?.data?.message || "Failed to delete. Please try again."}
              </p>
            )}
          </div>
        </div>
      );
}

export default DeletePostPopup;
