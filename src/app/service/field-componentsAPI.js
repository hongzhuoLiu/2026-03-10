import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from './shared/apiBaseQuery';

export const fieldComponentsAPI = createApi({
    reducerPath: 'fieldComponentsAPI',
    baseQuery: customBaseQuery,
    
    endpoints: (builder) => ({
        getAllFields: builder.query({
            query: (data) => `/${data.pageType}-field-components?fields[0]=${data.fieldNameField}`,
        }),
    }),
});

export const {
    useGetAllFieldsQuery
} = fieldComponentsAPI;

