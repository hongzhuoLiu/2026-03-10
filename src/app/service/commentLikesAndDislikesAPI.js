import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from './shared/apiBaseQuery';

export const commentLikesAndDislikesAPI = createApi({
  reducerPath: 'commentLikesAndDislikesAPI',
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    updateCommentLikes: builder.mutation({
      query: ({ commentId, userWhoLiked, existingUsersWhoLiked, likeIconColor }) => {
        const userId = userWhoLiked.id;
        let updatedUsersWhoLiked;
        if (likeIconColor === 'text-red-500') {
          // User is unliking, remove from array
          updatedUsersWhoLiked = existingUsersWhoLiked
            .filter(user => user.id !== userId);
        } else {
          // User is liking, add to array (if not already present)
          updatedUsersWhoLiked = [
            ...existingUsersWhoLiked,
            userId,
          ];
        }
        return {
          url: `/comments/${commentId}?populate=likes`,
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: { likes: updatedUsersWhoLiked }
          }),
        };
      },
    }),
    updateCommentDislikes: builder.mutation({
      query: ({ commentId, userWhoDisliked, existingUsersWhoDisliked, dislikeIconColor }) => {
        const userId = userWhoDisliked.id;
        let updatedUsersWhoDisliked;
        if (dislikeIconColor === 'text-blue-500') {
          // User is undisliking, remove from array
          updatedUsersWhoDisliked = existingUsersWhoDisliked
            .filter(user => user.id !== userId);
        } else {
          // User is disliking, add to array (if not already present)
          updatedUsersWhoDisliked = [
            ...existingUsersWhoDisliked,
            userId,
          ];
        }
        return {
          url: `/comments/${commentId}?populate=dislikes`,
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: { dislikes: updatedUsersWhoDisliked }
          }),
        };
      },
    }),
  }),
});

export const {
  useUpdateCommentLikesMutation,
  useUpdateCommentDislikesMutation,
} = commentLikesAndDislikesAPI;