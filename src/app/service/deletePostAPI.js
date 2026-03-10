import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API } from '../../API';

export const deletePostAPI = createApi({
    reducerPath: 'deletePostAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: API,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.jwt;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        deletePost: builder.mutation({
            query: ({ postType, postId }) => ({
                url: `/${postType}/${postId}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const { useDeletePostMutation } = deletePostAPI;
