import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isMobileView: false,
    showLogin: false,
    showLoginPost: false,
    showEmailLogin: false,
    showLoginError: false,
    loginErrorType: 'oauth_failed',

    showProfile: false,
    showMobSearch: false,
    showEditProfile: false,
    showNotificationSettings: false,
    showSignUp: false,
    showCreateProfile: false,
    showCreatePost: false,
    interactionName: '',
    selectedButton: 'blog',
    secondMenubarOpen: false,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleUIState: (state, action) => {
            const { key, value } = action.payload;
            state[key] = value !== undefined ? value : !state[key];
        },
        setIsMobileView: (state, action) => {
            state.isMobileView = action.payload;
        },
        resetUIState: () => initialState,
        setInteractionName: (state, action) => {
            state.interactionName = action.payload;
        },
        setSelectedButton: (state, action) => {
            state.selectedButton = action.payload;
        },
    },
});

export const {
    toggleUIState,
    setIsMobileView,
    resetUIState,
    setInteractionName,
    setSelectedButton
} = uiSlice.actions;

export default uiSlice.reducer;
