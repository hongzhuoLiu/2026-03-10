import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API } from '../../../API'; 
//import { logoutUser } from '../../features/authSlice';

/**
 * Core baseQuery with cookie & token support
 */
const rawBaseQuery = fetchBaseQuery({
    baseUrl: API,

    // Include cookies in all requests for session-based auth
    credentials: 'include',

    // Automatically attach JWT token from Redux store
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth?.jwt;
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

/**
 * Enhanced baseQuery with global 401 fallback handling
 */
export const customBaseQuery = async (args, api, extraOptions) => {
    const result = await rawBaseQuery(args, api, extraOptions);

    if (result.error?.status === 401) {
        console.warn('401 Unauthorized detected. Triggering logout...');

        // Dispatch logout to clear user state
        //api.dispatch(logoutUser());

        // Optionally show a global UI message
        // toast.error("Session expired. Please log in again.");
        // api.dispatch(showToast("Session expired. Please log in again."));

        // Optionally force redirect (less preferred)
        // window.location.href = "/login";

        return result;
    }

    // TODO: handle 403 Forbidden or 500 Server Error globally if needed
    // if (result.error?.status === 403) {...............

    // if (result.error?.status === 500) {...............


    return result;
};