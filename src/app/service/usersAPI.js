import { createApi } from '@reduxjs/toolkit/query/react'
import { customBaseQuery } from './shared/apiBaseQuery';

export const usersAPI = createApi({
    reducerPath: 'usersAPI',
    baseQuery: customBaseQuery,
    
    endpoints: (builder) => ({
        getUserDetails: builder.query({
            query: () => ({
                url: '/users/me' +
                    '?fields[0]=username' +
                    '&fields[1]=email' +
                    '&fields[2]=studentStatus' +
                    '&fields[3]=bio' +
                    "&fields[4]=feedbackQ1" +
                    "&fields[5]=feedbackQ3" +
                    '&fields[6]=notificationPreferences' +
                    "&populate[feedbackQ2][fields][0]=countryName"+
                    '&populate[interests][fields][0]=programFieldName' +
                    '&populate[university][fields][0]=universityName' +
                    '&populate[avatar][fields][0]=formats' +
                    '&populate[avatar][fields][1]=url' +
                    '&populate[comments][fields][0]=id' +
                    '&populate[reviews][fields][0]=' +
                    '&populate[blogs][fields][0]=' +
                    '&populate[qnas][fields][0]=' +
                    '&populate[userUniversityLikes][fields][0]=' +
                    '&populate[userProgramLikes][fields][0]=id&populate[userProgramLikes][fields][1]=programName' +
                    '&populate[userSubjectLikes][fields][0]=id&populate[userSubjectLikes][fields][1]=subjectName' +
                    '&populate[userFacilityBookmarks][fields][0]=userFacilityBookmarks'+
                    '&populate[userDestinationLikes]=*' +
                    '&populate[userHelpfulLinkBookmarks][fields][0]=id&populate[userHelpfulLinkBookmarks][fields][1]=linkName&populate[userHelpfulLinkBookmarks][fields][2]=linkUrl'

                    ,
                
                    method: 'GET',
            }),
        }),
        getUserNotificationPreferences: builder.query({
            query: (userId) => ({
                url: `/users/${userId}` +
                    '?fields[0]=notificationPreferences',
                method: 'GET',
            }),
        }),
        updateUserProfile: builder.mutation({
            query: (updatedUser) => ({
                url: `/users/${updatedUser.id}`,
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUser),
            }),
        }),
        addUniversityLike: builder.mutation({
            query: (universityId) => ({
                url: '/users/me',
                method: 'PUT',
                body: { userUniversityLikes: { connect: [universityId] } },
            }),
        }),
        removeUniversityLike: builder.mutation({
            query: (universityId) => ({
                url: '/users/me',
                method: 'PUT',
                body: { userUniversityLikes: { disconnect: [universityId] } },
            }),
        }),
        addProgramLike: builder.mutation({
            query: (programId) => ({
                url: '/users/me',
                method: 'PUT',
                body: { userProgramLikes: { connect: [programId] } },
            }),
        }),
        removeProgramLike: builder.mutation({
            query: (programId) => ({
                url: '/users/me',
                method: 'PUT',
                body: { userProgramLikes: { disconnect: [programId] } },
            }),
        }),
        addSubjectLike: builder.mutation({
            query: (subjectId) => ({
                url: '/users/me',
                method: 'PUT',
                body: { userSubjectLikes: { connect: [subjectId] } },
            }),
        }),
        removeSubjectLike: builder.mutation({
            query: (subjectId) => ({
                url: '/users/me',
                method: 'PUT',
                body: { userSubjectLikes: { disconnect: [subjectId] } },
            }),
        }),

        updateFeedbackQ1: builder.mutation({
            query: (feedback) => ({
              url: "/users/me",
              method: "PUT",
              body: { feedbackQ1: feedback }, // update feedbackQ1 data
            }),
          }),

        updateFeedbackQ2: builder.mutation({
            query: (countryIds) => ({
              url: "/users/me",
              method: "PUT",
              body: { feedbackQ2: { connect: countryIds } }, // update feedbackQ2 data
            }),
        }),

        updateFeedbackQ3: builder.mutation({
            query: (feedback) => ({
                url: "/users/me",
                method: "PUT",
                body: { feedbackQ3: feedback }, // update feedbackQ3 data
            }),
        }),

        addFacilityLike: builder.mutation({
            query: (facilityId) => ({
                url: '/users/me',
                method: 'PUT',
                body: { userFacilityBookmarks: { connect: [facilityId] } },
            }),
        }),
        removeFacilityLike: builder.mutation({
            query: (facilityId) => ({
                url: '/users/me',
                method: 'PUT',
                body: { userFacilityBookmarks: { disconnect: [facilityId] } },
            }),
        }),

        addDestinationLike: builder.mutation({
            query: (destinationId) => ({
                url: '/users/me',
                method: 'PUT',
                body: { userDestinationLikes: { connect: [destinationId] } },
            }),
        }),
        removeDestinationLike: builder.mutation({
            query: (destinationId) => ({
                url: '/users/me',
                method: 'PUT',
                body: { userDestinationLikes: { disconnect: [destinationId] } },
            }),
        }),


    }),
});

export const {
    useGetUserDetailsQuery,
    useLazyGetUserDetailsQuery,
    useLazyGetUserNotificationPreferencesQuery,
    useUpdateUserProfileMutation,
    useAddUniversityLikeMutation,
    useRemoveUniversityLikeMutation,
    useAddProgramLikeMutation,
    useRemoveProgramLikeMutation,
    useAddSubjectLikeMutation,
    useRemoveSubjectLikeMutation,
    useUpdateFeedbackQ1Mutation,
    useUpdateFeedbackQ2Mutation,
    useUpdateFeedbackQ3Mutation,
    useAddFacilityLikeMutation,
    useRemoveFacilityLikeMutation,
    useAddDestinationLikeMutation,
    useRemoveDestinationLikeMutation,
} = usersAPI
