// helpfulLinksAPI.js
import { createApi } from '@reduxjs/toolkit/query/react';

import { customBaseQuery } from './shared/apiBaseQuery';

// Convert the relationship field returned by Strapi into an id array
const extractIds = (field) => {
  if (!field) return [];
  const arr = Array.isArray(field?.data) ? field.data : Array.isArray(field) ? field : [];
  return arr.map((x) => Number(x.id ?? x));
};

const makeToggleMutation =
  (op /* 'like' | 'unlike' | 'dislike' | 'undislike' */) =>
  async (arg, api, extra) => {
    const { id, userId } = arg;
    const uid = Number(userId);

    // 1) Get the latest one first
    const getRes = await customBaseQuery(
      {
        url: `helpfullinks/${id}?populate=helpful_link_likes,helpful_link_dislikes`,
        method: 'GET',
      },
      api,
      extra
    );
    if (getRes.error) return getRes;

    const entity = getRes.data?.data?.attributes ?? {};
    const likeIds = extractIds(entity.helpful_link_likes);
    const dislikeIds = extractIds(entity.helpful_link_dislikes);

    // 2) Calculate the new array (maintain mutual exclusion)
    let nextLikes = likeIds.slice();
    let nextDislikes = dislikeIds.slice();

    const add = (arr, v) => (arr.includes(v) ? arr : [...arr, v]);
    const remove = (arr, v) => arr.filter((x) => x !== v);

    switch (op) {
      case 'like':
        nextLikes = add(nextLikes, uid);
        nextDislikes = remove(nextDislikes, uid);
        break;
      case 'unlike':
        nextLikes = remove(nextLikes, uid);
        break;
      case 'dislike':
        nextDislikes = add(nextDislikes, uid);
        nextLikes = remove(nextLikes, uid);
        break;
      case 'undislike':
        nextDislikes = remove(nextDislikes, uid);
        break;
      default:
        return { error: { status: 400, data: 'Unknown op' } };
    }

    // 3) PUT writes back two sets of relations
    const putRes = await customBaseQuery(
      {
       url: `helpfullinks/${id}?populate=helpful_link_likes,helpful_link_dislikes`,
        method: 'PUT',
        body: {
          data: {
            helpful_link_likes: nextLikes,
            helpful_link_dislikes: nextDislikes,
          },
        },
      },
      api,
      extra
    );

    return putRes;
  };

export const helpfulLinksApi = createApi({
  reducerPath: 'helpfulLinksApi',
  baseQuery: customBaseQuery,
  tagTypes: ['HelpfulLink'],
  endpoints: (builder) => ({
    likeHelpfulLink: builder.mutation({
      queryFn: (args, api, extra) => makeToggleMutation('like')(args, api, extra),
      invalidatesTags: (r, e, { id }) => (r?.data ? [{ type: 'HelpfulLink', id }, 'HelpfulLink'] : []),
    }),
    unlikeHelpfulLink: builder.mutation({
      queryFn: (args, api, extra) => makeToggleMutation('unlike')(args, api, extra),
      invalidatesTags: (r, e, { id }) => (r?.data ? [{ type: 'HelpfulLink', id }, 'HelpfulLink'] : []),
    }),
    dislikeHelpfulLink: builder.mutation({
      queryFn: (args, api, extra) => makeToggleMutation('dislike')(args, api, extra),
      invalidatesTags: (r, e, { id }) => (r?.data ? [{ type: 'HelpfulLink', id }, 'HelpfulLink'] : []),
    }),
    undislikeHelpfulLink: builder.mutation({
      queryFn: (args, api, extra) => makeToggleMutation('undislike')(args, api, extra),
      invalidatesTags: (r, e, { id }) => (r?.data ? [{ type: 'HelpfulLink', id }, 'HelpfulLink'] : []),
    }),
  }),
});

export const {
  useLikeHelpfulLinkMutation,
  useUnlikeHelpfulLinkMutation,
  useDislikeHelpfulLinkMutation,
  useUndislikeHelpfulLinkMutation,
} = helpfulLinksApi;
