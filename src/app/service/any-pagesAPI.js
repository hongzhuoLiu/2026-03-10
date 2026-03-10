// any-pagesAPI.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from './shared/apiBaseQuery';


export const anyPagesAPI = createApi({

  reducerPath: 'anyPagesAPI',
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    getSearchResults: builder.query({
      query: ({ pageType, universityId, graduationLevel, fieldId, fieldComponentName, graduationLevelField }) => {
        let url = `/${pageType}-pages?populate[university_page][populate]=true&populate[${fieldComponentName}][populate]=true`;

        if (universityId) {
          url += `&filters[university_page][id][$eq]=${universityId}`;
        }
        if (graduationLevel) {
          url += `&filters[${graduationLevelField}][$eq]=${graduationLevel}`;
        }
        if (fieldId) {
          url += `&filters[${fieldComponentName}][id][$eq]=${fieldId}`;
        }

        return url;
      },
    }),

    getReviewData: builder.query({
      query: (interactionName) => {
        // For facilities pages, we need to query reviews directly
        if (interactionName.startsWith('facilities/')) {
          const facilityId = interactionName.split('/')[1];
          return `reviews?populate[users_permissions_user][populate][avatar]=true&populate[users_permissions_user][fields][0]=username&populate[comments][populate][users_permissions_user][populate][avatar]=true&populate[comments][populate][users_permissions_user][fields][0]=username&populate[comments][fields][0]=commentText&populate[comments][fields][1]=commentLikes&populate[comments][fields][2]=createdAt&populate[review_likes][populate][users_permissions_user][populate][avatar]=true&populate[review_likes][populate][users_permissions_user][fields][0]=username&populate[review_likes][fields][0]=createdAt&populate[review_dislikes][populate][users_permissions_user][populate][avatar]=true&populate[review_dislikes][populate][users_permissions_user][fields][0]=username&populate[review_dislikes][fields][0]=createdAt&populate[facility]=true&filters[facility][id][$eq]=${facilityId}&sort[0]=updatedAt:desc`;
        }
        
        // For destination pages, we need to query reviews directly
        if (interactionName.startsWith('destination-pages/')) {
          return `reviews?populate[users_permissions_user][populate][avatar]=true&populate[users_permissions_user][fields][0]=username&populate[comments][populate][users_permissions_user][populate][avatar]=true&populate[comments][populate][users_permissions_user][fields][0]=username&populate[comments][fields][0]=commentText&populate[comments][fields][1]=commentLikes&populate[comments][fields][2]=createdAt&populate[review_likes][populate][users_permissions_user][populate][avatar]=true&populate[review_likes][populate][users_permissions_user][fields][0]=username&populate[review_likes][fields][0]=createdAt&populate[review_dislikes][populate][users_permissions_user][populate][avatar]=true&populate[review_dislikes][populate][users_permissions_user][fields][0]=username&populate[review_dislikes][fields][0]=createdAt&populate[destination_page]=true&filters[destination_page][id][$eq]=${interactionName.split('/')[1]}&sort[0]=updatedAt:desc`;
        }
        
        // For other pages, use the original query
        return `/${interactionName}
        ?populate[reviews][populate][users_permissions_user][populate][avatar]=true
        &populate[reviews][populate][users_permissions_user][fields][0]=username
        &populate[reviews][populate][comments][populate][users_permissions_user][populate][avatar]=true
        &populate[reviews][populate][comments][populate][users_permissions_user][fields][0]=username
        &populate[reviews][populate][comments][fields][0]=commentText
        &populate[reviews][populate][comments][fields][1]=commentLikes
        &populate[reviews][populate][comments][fields][2]=createdAt
        &populate[reviews][populate][review_likes][populate][users_permissions_user][populate][avatar]=true
        &populate[reviews][populate][review_likes][populate][users_permissions_user][fields][0]=username
        &populate[reviews][populate][review_likes][fields][0]=createdAt
        &populate[reviews][populate][review_dislikes][populate][users_permissions_user][populate][avatar]=true
        &populate[reviews][populate][review_dislikes][populate][users_permissions_user][fields][0]=username
        &populate[reviews][populate][review_dislikes][fields][0]=createdAt
        &populate[reviews][fields][0]=createdAt
        &populate[reviews][fields][1]=reviewLikes
        &populate[reviews][fields][2]=reviewDislikes
        &populate[reviews][fields][3]=reviewText
        &populate[reviews][fields][4]=updatedAt
        &populate[reviews][fields][5]=reviewRating
        &populate[reviews][fields][6]=id
        &sort[0]=updatedAt:desc`;
      },
    }),

    getBlogData: builder.query({
      query: (interactionName) => {
        // For facilities pages, we need to query blogs directly
        if (interactionName.startsWith('facilities/')) {
          const facilityId = interactionName.split('/')[1];
          return `blogs?populate[users_permissions_user][populate][avatar]=true&populate[users_permissions_user][fields][0]=username&populate[comments][populate][users_permissions_user][populate][avatar]=true&populate[comments][populate][users_permissions_user][fields][0]=username&populate[comments][fields][0]=commentText&populate[comments][fields][1]=commentLikes&populate[comments][fields][2]=createdAt&populate[blog_likes][populate][users_permissions_user][populate][avatar]=true&populate[blog_likes][populate[users_permissions_user][fields][0]=username&populate[blog_likes][fields][0]=createdAt&populate[blog_dislikes][populate][users_permissions_user][populate][avatar]=true&populate[blog_dislikes][populate][users_permissions_user][fields][0]=username&populate[blog_dislikes][fields][0]=createdAt&populate[facility]=true&filters[facility][id][$eq]=${facilityId}&sort[0]=updatedAt:desc`;
        }
        
        // For destination pages, we need to query blogs directly
        if (interactionName.startsWith('destination-pages/')) {
          return `blogs?populate[users_permissions_user][populate][avatar]=true&populate[users_permissions_user][fields][0]=username&populate[comments][populate][users_permissions_user][populate][avatar]=true&populate[comments][populate][users_permissions_user][fields][0]=username&populate[comments][fields][0]=commentText&populate[comments][fields][1]=commentLikes&populate[comments][fields][2]=createdAt&populate[blog_likes][populate][users_permissions_user][populate][avatar]=true&populate[blog_likes][populate][users_permissions_user][fields][0]=username&populate[blog_likes][fields][0]=createdAt&populate[blog_dislikes][populate][users_permissions_user][populate][avatar]=true&populate[blog_dislikes][populate][users_permissions_user][fields][0]=username&populate[blog_dislikes][fields][0]=createdAt&populate[destination_page]=true&filters[destination_page][id][$eq]=${interactionName.split('/')[1]}&sort[0]=updatedAt:desc`;
        }
        
        // For other pages, use the original query
        return `/${interactionName}
        ?populate[blogs][populate][users_permissions_user][populate][avatar]=true
        &populate[blogs][populate][users_permissions_user][fields][0]=username
        &populate[blogs][populate][comments][populate][users_permissions_user][populate][avatar]=true
        &populate[blogs][populate][comments][populate][users_permissions_user][fields][0]=username
        &populate[blogs][populate][comments][fields][0]=commentText
        &populate[blogs][populate][comments][fields][1]=commentLikes
        &populate[blogs][populate][comments][fields][2]=createdAt
        &populate[blogs][populate][blog_likes][populate][users_permissions_user][populate][avatar]=true
        &populate[blogs][populate][blog_likes][populate][users_permissions_user][fields][0]=username
        &populate[blogs][populate][blog_likes][fields][0]=createdAt
        &populate[blogs][populate][blog_dislikes][populate][users_permissions_user][populate][avatar]=true
        &populate[blogs][populate][blog_dislikes][populate[users_permissions_user][fields][0]=username
        &populate[blogs][populate][blog_dislikes][fields][0]=createdAt
        &populate[blogs][fields][0]=createdAt
        &populate[blogs][fields][1]=blogLikes
        &populate[blogs][fields][2]=blogDislikes
        &populate[blogs][fields][3]=blogText
        &populate[blogs][fields][4]=updatedAt
        &populate[blogs][fields][5]=id
        &sort[0]=updatedAt:desc`;
      },
    }),

    getQnAData: builder.query({
      query: (interactionName) => {
        // For facilities pages, we need to query qnas directly
        if (interactionName.startsWith('facilities/')) {
          const facilityId = interactionName.split('/')[1];
          return `qnas?populate[users_permissions_user][populate][avatar]=true&populate[users_permissions_user][fields][0]=username&populate[comments][populate][users_permissions_user][populate][avatar]=true&populate[comments][populate][users_permissions_user][fields][0]=username&populate[comments][fields][0]=commentText&populate[comments][fields][1]=commentLikes&populate[comments][fields][2]=createdAt&populate[qna_likes][populate][users_permissions_user][populate][avatar]=true&populate[qna_likes][populate][users_permissions_user][fields][0]=username&populate[qna_likes][fields][0]=createdAt&populate[qna_dislikes][populate][users_permissions_user][populate][avatar]=true&populate[qna_dislikes][populate][users_permissions_user][fields][0]=username&populate[qna_dislikes][fields][0]=createdAt&populate[facility]=true&filters[facility][id][$eq]=${facilityId}&sort[0]=updatedAt:desc`;
        }
        
        // For destination pages, we need to query qnas directly
        if (interactionName.startsWith('destination-pages/')) {
          return `qnas?populate[users_permissions_user][populate][avatar]=true&populate[users_permissions_user][fields][0]=username&populate[comments][populate][users_permissions_user][populate][avatar]=true&populate[comments][populate][users_permissions_user][fields][0]=username&populate[comments][fields][0]=commentText&populate[comments][fields][1]=commentLikes&populate[comments][fields][2]=createdAt&populate[qna_likes][populate][users_permissions_user][populate][avatar]=true&populate[qna_likes][populate][users_permissions_user][fields][0]=username&populate[qna_likes][fields][0]=createdAt&populate[qna_dislikes][populate][users_permissions_user][populate][avatar]=true&populate[qna_dislikes][populate][users_permissions_user][fields][0]=username&populate[qna_dislikes][fields][0]=createdAt&populate[destination_page]=true&filters[destination_page][id][$eq]=${interactionName.split('/')[1]}&sort[0]=updatedAt:desc`;
        }
        
        // For other pages, use the original query
        return `/${interactionName}
        ?populate[qnas][populate][users_permissions_user][populate][avatar]=true
        &populate[qnas][populate][users_permissions_user][fields][0]=username
        &populate[qnas][populate][comments][populate][users_permissions_user][populate][avatar]=true
        &populate[qnas][populate][comments][populate][users_permissions_user][fields][0]=username
        &populate[qnas][populate][comments][fields][0]=commentText
        &populate[qnas][populate][comments][fields][1]=commentLikes
        &populate[qnas][populate][comments][fields][2]=createdAt
        &populate[qnas][populate][qna_likes][populate][users_permissions_user][populate][avatar]=true
        &populate[qnas][populate][qna_likes][populate][users_permissions_user][fields][0]=username
        &populate[qnas][populate][qna_likes][fields][0]=createdAt
        &populate[qnas][populate][qna_dislikes][populate][users_permissions_user][populate][avatar]=true
        &populate[qnas][populate][qna_dislikes][populate][users_permissions_user][fields][0]=username
        &populate[qnas][populate][qna_dislikes][fields][0]=createdAt
        &populate[qnas][fields][0]=createdAt
        &populate[qnas][fields][1]=qnaLikes
        &populate[qnas][fields][2]=qnaDislikes
        &populate[qnas][fields][3]=qnaText
        &populate[qnas][fields][4]=updatedAt
        &populate[qnas][fields][5]=id
        &sort[0]=updatedAt:desc`;
      },
    }),

    // >>> get helpful link <<<
    getHelpfulLinksData: builder.query({
      query: (interactionName) => {
        // For destination pages, we need to query helpfulLinks directly
        if (interactionName.startsWith('destination-pages/')) {
          return `helpfulLinks?populate=destination_page&sort[0]=updatedAt:desc`;
        }
        
        // For facilities pages, we need to query helpfulLinks directly
        if (interactionName.startsWith('facilities/')) {
          const facilityId = interactionName.split('/')[1];
          return `helpfulLinks?populate=facility&filters[facility][id][$eq]=${facilityId}&sort[0]=updatedAt:desc`;
        }
        
        // For other pages, use the original query
        return `/${interactionName}
          ?populate[helpfulLinks][populate]=university_page,program_page,subject_page,destination_page
          &populate[helpfulLinks][fields][0]=linkName
          &populate[helpfulLinks][fields][1]=linkUrl
          &populate[helpfulLinks][fields][2]=id
          &sort[0]=updatedAt:desc`;
      },
    }),

    // >>> SEO endpoints <<<
    getDestinationSEOData: builder.query({
      query: (destinationId) => `destination-pages/${destinationId}?fields[0]=destinationName&fields[1]=destinationLocation&fields[2]=destinationRating&fields[3]=destinationDescription&populate[destinationHeaderImage][fields][0]=formats`,
      transformResponse: (response) => ({
        id: response.data.id,
        name: response.data.attributes.destinationName,
        location: response.data.attributes.destinationLocation,
        rating: response.data.attributes.destinationRating,
        description: response.data.attributes.destinationDescription,
        image: response.data.attributes.destinationHeaderImage?.data?.attributes?.formats?.large?.url || 
               response.data.attributes.destinationHeaderImage?.data?.attributes?.formats?.medium?.url || 
               response.data.attributes.destinationHeaderImage?.data?.attributes?.formats?.small?.url || 
               response.data.attributes.destinationHeaderImage?.data?.attributes?.formats?.thumbnail?.url || null
      })
    }),

    getFacilitySEOData: builder.query({
      query: (facilityId) => `facilities/${facilityId}?fields[0]=facilityName&fields[1]=facilityType&fields[2]=facilityLocation&fields[3]=facilityDescription&fields[4]=facilityRating&populate[university_page][fields][0]=universityName`,
      transformResponse: (response) => ({
        id: response.data.id,
        name: response.data.attributes.facilityName,
        type: response.data.attributes.facilityType,
        location: response.data.attributes.facilityLocation,
        description: response.data.attributes.facilityDescription,
        rating: response.data.attributes.facilityRating,
        university: response.data.attributes.university_page?.data?.attributes?.universityName || null
      })
    }),
  }),
});

export const {
  useGetSearchResultsQuery,
  useGetReviewDataQuery,
  useGetBlogDataQuery,
  useGetQnADataQuery,
  useGetHelpfulLinksDataQuery,
  useGetDestinationSEODataQuery,
  useGetFacilitySEODataQuery,
} = anyPagesAPI;
