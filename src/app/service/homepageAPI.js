import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from './shared/apiBaseQuery';

export const homepageAPI = createApi({
    reducerPath: 'homepageAPI',
    baseQuery: customBaseQuery, // shared logic of base query

    endpoints: (builder) => ({
        getHomepageText: builder.query({
            query: () => '/homepage-texts/1',
        }),
    }),
});

export const { useGetHomepageTextQuery } = homepageAPI;
