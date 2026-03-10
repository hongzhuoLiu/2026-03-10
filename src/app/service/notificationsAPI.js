import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from './shared/apiBaseQuery';

export const notificationsAPI = createApi({
  reducerPath: 'notificationsAPI',
  baseQuery: customBaseQuery,

  endpoints: (builder) => ({
   getNotifications: builder.query({
  query: (userId) =>
    `/notifications` +
    `?filters[toUser][id][$eq]=${userId}` +
    `&sort=createdAt:desc` +
    `&populate[relatedReview][populate]=university_page` +
    `&populate[relatedBlog][populate]=university_page` +
    `&populate[relatedQna][populate]=university_page` +
    `&populate[relatedComment][populate]=blog,qna,review` +
    `&populate[relatedComment][populate][blog]=university_page` +
    `&populate[relatedComment][populate][qna]=university_page` +
    `&populate[relatedComment][populate][review]=university_page`,
}),
    createNotification: builder.mutation({
      query: (notificationData) => ({
        url: '/notifications',
        method: 'POST',
        body: { data: notificationData },
      }),
    }),
    updateNotification: builder.mutation({
      query: ({ id, data }) => ({
        url: `/notifications/${id}`,
        method: 'PUT',
        body: { data },
      }),
    }),
    markNotificationRead: builder.mutation({
      query: ({ id }) => ({
        url: `/notifications/${id}`,
        method: 'PUT',
        body: { data: { isRead: true } },
      }),
    }),
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useCreateNotificationMutation,
  useUpdateNotificationMutation,
  useMarkNotificationReadMutation,
  useDeleteNotificationMutation,
} = notificationsAPI;

export function buildNotificationData({ type, body, fromUserId, fromUserName, toUser, postType, postId, commentId }) {
  return {
    type,
    title: type === "like" ? `${fromUserName} liked your post` : `${fromUserName} commented on your post`,
    body: body ? body : "",
    isRead: false,
    fromUsers: fromUserId,
    toUser: toUser,
    timestamp: new Date().toISOString(),
    ...(postType === "review" && { relatedReview: postId }),
    ...(postType === "blog" && { relatedBlog: postId }),
    ...(postType === "qna" && { relatedQna: postId }),
    ...(postType === "link" && { relatedLink: postId }),
    ...(postType === "comment" && { relatedComment: postId }),
    ...(type === "comment" && { relatedComment: commentId }),
  };
}