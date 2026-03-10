import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from './shared/apiBaseQuery';

export const fuzzySearchAPI = createApi({
    reducerPath: 'fuzzySearchAPI',
    baseQuery: customBaseQuery,
    
    endpoints: (builder) => ({
        fuzzySearch: builder.query({
            query: (searchQuery) => `/fuzzy-search/search?query=${searchQuery}`,
        }),
    }),
});

export const {
    useFuzzySearchQuery
} = fuzzySearchAPI;

