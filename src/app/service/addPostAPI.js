import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from './shared/apiBaseQuery';

export const addPostAPI = createApi({
    reducerPath: 'addPostAPI',
    baseQuery: customBaseQuery,

    endpoints: (builder) => ({
        addPost: builder.mutation({
            query: (postData) => ({
                url: `/${postData.postTypeSelect}`,
                method: "POST",
                body: { data: postData.newPostData },
            }),
        }),
    }),
});

export const { useAddPostMutation } = addPostAPI;