import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from './shared/apiBaseQuery'; 

export const addCommentAPI = createApi({
    reducerPath: 'addCommentAPI',
    baseQuery: customBaseQuery, 

    endpoints: (builder) => ({
        addComment: builder.mutation({
            query: (postData) => ({
                url: `/comments`,
                method: "POST",
                body: { data: postData.newPostData },
            }),
        }),
    }),
});

export const { useAddCommentMutation } = addCommentAPI;
