import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from './shared/apiBaseQuery';

export const destinationsApi = createApi({
  reducerPath: 'destinationsApi',
  baseQuery: customBaseQuery,
  tagTypes: ['Destinations'],
  endpoints: (builder) => ({
    getDestinations: builder.query({
      query: ({ page = 1, pageSize = 1000 } = {}) =>
        `destination-pages?populate=destinationLogo,destinationHeaderImage&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
      transformResponse: (response) => ({
        data: response.data.map((item) => ({
          id: item.id,
          destinationName: item.attributes.destinationName,
          destinationType: item.attributes.destinationType,
          destinationLocation: item.attributes.destinationLocation,
          destinationDescription: item.attributes.destinationDescription,
          webpageName: item.attributes.webpageName,
          webpage: item.attributes.webpage,
          destinationRating: item.attributes.destinationRating,
          destinationLogo: item.attributes.destinationLogo?.data?.attributes?.formats?.thumbnail?.url || null,
          destinationHeaderImage: item.attributes.destinationHeaderImage?.data?.attributes?.formats?.thumbnail?.url || null,
        })),
        meta: response.meta.pagination,
      }),
      providesTags: ['Destinations']
    }),

    getDestinationDetails: builder.query({
      query: (id) =>
        `destination-pages/${id}?populate[destinationLogo][fields][0]=name&populate[destinationLogo][fields][1]=alternativeText&populate[destinationLogo][fields][2]=formats&populate[destinationHeaderImage][fields][0]=name&populate[destinationHeaderImage][fields][1]=alternativeText&populate[destinationHeaderImage][fields][2]=formats&populate[webpage][fields][0]=webpage`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, id) => [{ type: 'Destinations', id }]
    }),

    createDestination: builder.mutation({
      query: (destinationData) => ({
        url: 'destination-pages',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: destinationData })
      }),
      transformErrorResponse: (response) => response,
      invalidatesTags: ['Destinations']
    }),

    updateDestination: builder.mutation({
      query: ({ id, ...destinationData }) => ({
        url: `destination-pages/${id}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: destinationData })
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Destinations', id }]
    }),

    deleteDestination: builder.mutation({
      query: (id) => ({
        url: `destination-pages/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Destinations']
    }),

    getDestinationsByType: builder.query({
      query: (destinationType) => `destination-pages?filters[destinationType][$eq]=${destinationType}`,
      transformResponse: (response) => response.data,
      providesTags: ['Destinations']
    }),

    uploadDestinationImage: builder.mutation({
      query: ({ file }) => {
        const formData = new FormData();
        formData.append('files', file);

        return {
          url: 'upload',
          method: 'POST',
          body: formData,
          formData: true,
        };
      },
      transformErrorResponse: (response) => response,
    }),
  })
});

export const {
  useGetDestinationsQuery,
  useGetDestinationByIdQuery,
  useCreateDestinationMutation,
  useUpdateDestinationMutation,
  useDeleteDestinationMutation,
  useGetDestinationsByTypeQuery,
  useUploadDestinationImageMutation,
  useGetDestinationDetailsQuery,
} = destinationsApi;