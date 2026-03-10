import { createSlice } from '@reduxjs/toolkit'
import { registerUser, userLogin, googleLogin, facebookLogin } from './AuthenticationInteractions'

const jwt = localStorage.getItem('jwt')
    ? localStorage.getItem('jwt')
    : null

const initialState = {
    isLoading: false,
    user: null,
    loginMethod: null,
    jwt,
    error: null,
    success: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('jwt')
            state.isLoading = false
            state.user = null
            state.jwt = null
            state.error = null
            state.loginMethod = null
        },
        setCredentials: (state, { payload }) => {
            state.user = payload.user
            state.jwt = payload.jwt
            state.loginMethod = payload.loginMethod || 'facebook'
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // login user
        builder
            .addCase(userLogin.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(userLogin.fulfilled, (state, { payload }) => {
                state.isLoading = false
                state.user = payload.user
                state.jwt = payload.jwt
                state.loginMethod = payload.loginMethod;
            })
            .addCase(userLogin.rejected, (state, { payload }) => {
                state.isLoading = false
                state.error = payload
            })
            // register user
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(registerUser.fulfilled, (state, { payload }) => {
                state.isLoading = false
                state.success = true
            })
            .addCase(registerUser.rejected, (state, { payload }) => {
                state.isLoading = false
                state.error = payload
            })
            // google login
            .addCase(googleLogin.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(googleLogin.fulfilled, (state, { payload }) => {
                state.isLoading = false
                state.user = payload.user
                state.jwt = payload.jwt
                state.loginMethod = payload.loginMethod;
            })
            .addCase(googleLogin.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.error = payload || 'Google authentication failed';
                localStorage.removeItem('jwt');
            })
            // facebook login
            .addCase(facebookLogin.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(facebookLogin.fulfilled, (state, { payload }) => {
                state.isLoading = false
                state.user = payload.user
                state.jwt = payload.jwt
                state.loginMethod = payload.loginMethod;
            })
            .addCase(facebookLogin.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.error = payload || 'Facebook authentication failed';
                localStorage.removeItem('jwt');
            });
    },
});

export const { logout, setCredentials, clearError } = authSlice.actions;
export default authSlice.reducer;
