import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { universityPagesAPI } from "./service/university-pagesAPI";
import { iconsAPI } from "./service/iconsAPI";
import authReducer from "./features/authentication/AuthenticationReducer";
import uiReducer from "./features/ui/UIReducer";
import { usersAPI } from "./service/usersAPI";
import { addPostAPI } from "./service/addPostAPI";
import { uploadAPI } from "./service/uploadAPI";
import { fuzzySearchAPI } from "./service/fuzzy-search";
import filteringSubjectsAndProgramsReducer from "./features/filteringSubjectsAndPrograms/filteringSubjectsAndProgramsReducer";
import { fieldComponentsAPI } from "./service/field-componentsAPI";
import { anyPagesAPI } from "./service/any-pagesAPI";
import { homepageAPI } from './service/homepageAPI';
import { universitiesPageTextAPI } from './service/universitiesPageTextAPI';
import { addCommentAPI } from "./service/addCommentAPI";
import { reviewCardLikesAndDislikesAPI } from "./service/reviewCardLikesAndDislikesAPI";
import { commentLikesAndDislikesAPI } from "./service/commentLikesAndDislikesAPI";
import { deletePostAPI } from './service/deletePostAPI';
import { notificationsAPI } from "./service/notificationsAPI";
import { helpfulLinksApi } from "./service/helpfulLinksAPI";

import displayedLikeDislikeReducer from './features/syncingIconStates/displayedLikeDislike';
import { facilitiesApi } from './service/facilitiesApi';
import { destinationsApi } from './service/destinationsAPI';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        ui: uiReducer,
        filteringSubjectsAndPrograms: filteringSubjectsAndProgramsReducer,
        displayedLikeDislike: displayedLikeDislikeReducer,
        [anyPagesAPI.reducerPath]: anyPagesAPI.reducer,
        [addPostAPI.reducerPath]: addPostAPI.reducer,
        [deletePostAPI.reducerPath]: deletePostAPI.reducer,
        [addCommentAPI.reducerPath]: addCommentAPI.reducer,
        [fieldComponentsAPI.reducerPath]: fieldComponentsAPI.reducer,
        [fuzzySearchAPI.reducerPath]: fuzzySearchAPI.reducer,
        [universityPagesAPI.reducerPath]: universityPagesAPI.reducer,
        [iconsAPI.reducerPath]: iconsAPI.reducer,
        [uploadAPI.reducerPath]: uploadAPI.reducer,
        [usersAPI.reducerPath]: usersAPI.reducer,
        [homepageAPI.reducerPath]: homepageAPI.reducer,
        [universitiesPageTextAPI.reducerPath]: universitiesPageTextAPI.reducer,
        [reviewCardLikesAndDislikesAPI.reducerPath]: reviewCardLikesAndDislikesAPI.reducer,
        [commentLikesAndDislikesAPI.reducerPath]: commentLikesAndDislikesAPI.reducer,
        [facilitiesApi.reducerPath]: facilitiesApi.reducer,
        [destinationsApi.reducerPath]: destinationsApi.reducer,
        [notificationsAPI.reducerPath]: notificationsAPI.reducer,
        [helpfulLinksApi.reducerPath]: helpfulLinksApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(addPostAPI.middleware)
            .concat(deletePostAPI.middleware)
            .concat(anyPagesAPI.middleware)
            .concat(addCommentAPI.middleware)
            .concat(fieldComponentsAPI.middleware)
            .concat(fuzzySearchAPI.middleware)
            .concat(universityPagesAPI.middleware)
            .concat(iconsAPI.middleware)
            .concat(uploadAPI.middleware)
            .concat(usersAPI.middleware)
            .concat(homepageAPI.middleware)
            .concat(universitiesPageTextAPI.middleware)
            .concat(reviewCardLikesAndDislikesAPI.middleware)
            .concat(commentLikesAndDislikesAPI.middleware)
            .concat(facilitiesApi.middleware)
            .concat(destinationsApi.middleware)
            .concat(notificationsAPI.middleware)
            .concat(helpfulLinksApi.middleware),
            
})

setupListeners(store.dispatch);
export default store
