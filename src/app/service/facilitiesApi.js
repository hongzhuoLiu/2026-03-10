import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from './shared/apiBaseQuery';

export const facilitiesApi = createApi({
  reducerPath: 'facilitiesApi',
  baseQuery: customBaseQuery,
  tagTypes: ['Facilities'],
  endpoints: (builder) => ({
    getFacilities: builder.query({
      query: ({ page = 1, pageSize = 100 } = {}) =>
          `facilities?populate=university_page&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
      transformResponse: (response) => ({
        data: response.data.map((item) => ({
          id: item.id,
          facilityName: item.attributes.facilityName,
          facilityType: item.attributes.facilityType,
          facilityDescription: item.attributes.facilityDescription,
          facilityLocation: item.attributes.facilityLocation,
          facilityRating: item.attributes.facilityRating,
          facilityLinks: item.attributes.facilityLinks,
          universityPageId: item.attributes.university_page?.data?.id ?? null,
          universityPageTitle: item.attributes.university_page?.data?.attributes?.universityName ?? null
        })),
        meta: response.meta.pagination,
      }),
      providesTags: ['Facilities']
    }),
    
    getFacilityById: builder.query({
      query: (id) => `facilities/${id}?populate=university_page`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, id) => [{ type: 'Facilities', id }]
    }),
    
    createFacility: builder.mutation({
      query: (facilityData) => ({
        url: 'facilities',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: facilityData })
      }),
      invalidatesTags: ['Facilities']
    }),
    
    updateFacility: builder.mutation({
      query: ({ id, ...facilityData }) => ({
        url: `facilities/${id}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: facilityData })
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Facilities', id }]
    }),
    
    deleteFacility: builder.mutation({
      query: (id) => ({
        url: `facilities/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Facilities']
    }),
    
    getFacilitiesByUniversity: builder.query({
      query: (universityId) => `facilities?filters[university_page][id][$eq]=${universityId}`,
      transformResponse: (response) => response.data,
      providesTags: ['Facilities']
    }),
    
    getFacilitiesByType: builder.query({
      query: (facilityType) => `facilities?filters[facilityType][$eq]=${facilityType}`,
      transformResponse: (response) => response.data,
      providesTags: ['Facilities']
    })
  }),
});

export const {
  useGetFacilitiesQuery,
  useGetFacilityByIdQuery,
  useCreateFacilityMutation,
  useUpdateFacilityMutation,
  useDeleteFacilityMutation,
  useGetFacilitiesByUniversityQuery,
  useGetFacilitiesByTypeQuery
} = facilitiesApi;