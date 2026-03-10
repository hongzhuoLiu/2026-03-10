import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from './shared/apiBaseQuery';

export const iconsAPI = createApi({
    reducerPath: 'iconsAPI',
    baseQuery: customBaseQuery,
    
    endpoints: (builder) => ({
        getAllIcons: builder.query({
            query: () => '/icons/?populate[image][fields][0]=formats' +
                '&pagination[pageSize]=200',
        }),
        getIconById: builder.query({
            query: (id) => `/icons/${id}?populate[image][fields][0]=formats`,
        }),
    }),
});

export const { useGetAllIconsQuery, useGetIconByIdQuery } = iconsAPI;

