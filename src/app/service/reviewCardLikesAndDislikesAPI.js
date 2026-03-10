import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from './shared/apiBaseQuery';

// This is for updating the Review Card/Comment Popup like and dislike count on Strapi

export const reviewCardLikesAndDislikesAPI = createApi({
    reducerPath: 'reviewCardLikesAndDislikesAPI',
    baseQuery: customBaseQuery, // shared logic of base query
    endpoints: (builder) => ({
        updateReviewLikes: builder.mutation({ // Update review liker list
            query: ({ reviewId, userWhoLiked, existingUsersWhoLiked, likeIconColor }) => {

                const userId = userWhoLiked.id;

                let updatedUsersWhoLiked;

                if (likeIconColor === 'text-red-500') {
                    // Remove the existing user from the liker list (User cancels the like)
                    updatedUsersWhoLiked = existingUsersWhoLiked.filter(user => user.id !== userId);
                } else {
                    // Add the user to the liker list (User likes the post)
                    updatedUsersWhoLiked = [
                        ...existingUsersWhoLiked,
                        { id: userWhoLiked.id },
                    ];
                }

                return {
                    url: `/reviews/${reviewId}?populate=review_likes`,
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        data: {
                            review_likes: updatedUsersWhoLiked
                        }
                    })
                };
            },
        }),
        updateReviewDislikes: builder.mutation({ // Update review disliker list
            query: ({ reviewId, userWhoDisliked, existingUsersWhoDisliked, dislikeIconColor }) => {

                const userId = userWhoDisliked.id;

                let updatedUsersWhoDisliked;

                if (dislikeIconColor === 'text-blue-500') {
                    // Remove the existing user from the disliker list (User cancels the dislike)
                    updatedUsersWhoDisliked = existingUsersWhoDisliked.filter(user => user.id !== userId);
                } else {
                    // Add the user to the disliker list (User dislikes the post)
                    updatedUsersWhoDisliked = [
                        ...existingUsersWhoDisliked,
                        { id: userWhoDisliked.id },
                    ];
                }

                return {
                    url: `/reviews/${reviewId}?populate=review_dislikes`,
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        data: {
                            review_dislikes: updatedUsersWhoDisliked
                        }
                    })
                };
            },
        }),
        updateBlogLikes: builder.mutation({ // Update blog liker list
            query: ({ blogId, userWhoLiked, existingUsersWhoLiked, likeIconColor }) => {

                const userId = userWhoLiked.id;

                let updatedUsersWhoLiked;

                if (likeIconColor === 'text-red-500') {
                    // Remove the existing user from the liker list (User cancels the like)
                    updatedUsersWhoLiked = existingUsersWhoLiked.filter(user => user.id !== userId);
                } else {
                    // Add the user to the liker list (User likes the post)
                    updatedUsersWhoLiked = [
                        ...existingUsersWhoLiked,
                        { id: userWhoLiked.id },
                    ];
                }

                return {
                    url: `/blogs/${blogId}?populate=blog_likes`,
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        data: {
                            blog_likes: updatedUsersWhoLiked
                        }
                    })
                };
            },
        }),
        updateBlogDislikes: builder.mutation({ // Update blog disliker list
            query: ({ blogId, userWhoDisliked, existingUsersWhoDisliked, dislikeIconColor }) => {

                const userId = userWhoDisliked.id;

                let updatedUsersWhoDisliked;

                if (dislikeIconColor === 'text-blue-500') {
                    // Remove the existing user from the disliker list (User cancels the dislike)
                    updatedUsersWhoDisliked = existingUsersWhoDisliked.filter(user => user.id !== userId);
                } else {
                    // Add the user to the disliker list (User dislikes the post)
                    updatedUsersWhoDisliked = [
                        ...existingUsersWhoDisliked,
                        { id: userWhoDisliked.id },
                    ];
                }

                return {
                    url: `/blogs/${blogId}?populate=blog_dislikes`,
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        data: {
                            blog_dislikes: updatedUsersWhoDisliked
                        }
                    })
                };
            },
        }),
        updateQnALikes: builder.mutation({ // Update qna liker list
            query: ({ qnaId, userWhoLiked, existingUsersWhoLiked, likeIconColor }) => {

                const userId = userWhoLiked.id;

                let updatedUsersWhoLiked;

                if (likeIconColor === 'text-red-500') {
                    // Remove the existing user from the liker list (User cancels the like)
                    updatedUsersWhoLiked = existingUsersWhoLiked.filter(user => user.id !== userId);
                } else {
                    // Add the user to the liker list (User likes the post)
                    updatedUsersWhoLiked = [
                        ...existingUsersWhoLiked,
                        { id: userWhoLiked.id },
                    ];
                }

                return {
                    url: `/qnas/${qnaId}?populate=qna_likes`,
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        data: {
                            qna_likes: updatedUsersWhoLiked
                        }
                    })
                };
            },
        }),
        updateQnADislikes: builder.mutation({ // Update qna disliker list
            query: ({ qnaId, userWhoDisliked, existingUsersWhoDisliked, dislikeIconColor }) => {

                const userId = userWhoDisliked.id;

                let updatedUsersWhoDisliked;

                if (dislikeIconColor === 'text-blue-500') {
                    // Remove the existing user from the disliker list (User cancels the dislike)
                    updatedUsersWhoDisliked = existingUsersWhoDisliked.filter(user => user.id !== userId);
                } else {
                    // Add the user to the disliker list (User dislikes the post)
                    updatedUsersWhoDisliked = [
                        ...existingUsersWhoDisliked,
                        { id: userWhoDisliked.id },
                    ];
                }

                return {
                    url: `/qnas/${qnaId}?populate=qna_dislikes`,
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        data: {
                            qna_dislikes: updatedUsersWhoDisliked
                        }
                    })
                };
            },
        }),
    }),
});

export const {
    useUpdateReviewLikesMutation,
    useUpdateReviewDislikesMutation,
    useUpdateBlogLikesMutation,
    useUpdateBlogDislikesMutation,
    useUpdateQnALikesMutation,
    useUpdateQnADislikesMutation
} = reviewCardLikesAndDislikesAPI;





























