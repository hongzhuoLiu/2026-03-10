import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from './shared/apiBaseQuery';

export const universitiesPageTextAPI = createApi({
    reducerPath: 'universitiesPageTextAPI',
    baseQuery: customBaseQuery,
    endpoints: (builder) => ({
        getUniversitiesPageText: builder.query({
            query: () => '/universitypage-texts/1',
        }),
    }),
});

export const { useGetUniversitiesPageTextQuery } = universitiesPageTextAPI;
