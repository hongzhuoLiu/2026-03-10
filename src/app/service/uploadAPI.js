import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { customBaseQuery } from './shared/apiBaseQuery';

export const uploadAPI = createApi({
    reducerPath: 'uploadAPI',
    baseQuery: customBaseQuery,
    
    endpoints: (builder) => ({
        uploadPicture: builder.mutation({
            query: (formData) => ({
                url: '/upload',
                method: 'POST',
                body: formData,
            }),
        }),
        updateUploadedPicture: builder.mutation({
            query: (uploadData) => ({
                url: `/upload?id=${uploadData.id}`,
                method: 'POST',
                body: uploadData.formData,
            }),
        }),
        getAllUploadedPictures: builder.query({
            query: () => ({
                url: `/upload/files`,
                method: 'GET',
            }),
        }),
        getUploadedPictureByAltText: builder.query({
            query: (altText) => ({
                url: `/upload/files?filters[alternativeText][$eq]=${altText}`,
                method: 'GET',
            }),
        }),
    }),
})

export const {
    useUploadPictureMutation,
    useUpdateUploadedPictureMutation,
    useGetAllUploadedPicturesQuery,
    useGetUploadedPictureByAltTextQuery,
} = uploadAPI
