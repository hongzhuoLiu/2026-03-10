import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '../../app/features/authentication/AuthenticationReducer';
import { toggleUIState } from '../../app/features/ui/UIReducer';
import { API } from '../../API';

function GoogleCallback() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');

    if (!accessToken) {
      console.error('No access_token found in callback URL');
      dispatch(toggleUIState({ key: 'showLoginError', value: true }));
      dispatch(toggleUIState({ key: 'loginErrorType', value: 'oauth_failed' }));
      return;
    }

    fetch(`${API}/auth/google/callback?access_token=${accessToken}`)
      .then(async res => {
        if (!res.ok) {
          const errorData = await res.json();
          console.log('Strapi error response:', errorData);
          throw errorData;
        }
        return res.json();
      })
      .then(({ jwt, user }) => {
        if (!jwt) throw new Error('No JWT returned from Strapi');
        localStorage.setItem('jwt', jwt);
        dispatch(setCredentials({ user, jwt, loginMethod: 'google' }));
        navigate('/', { replace: true });
      })
      .catch(err => {
        console.error('Google login failed:', err);
        const errorMessage = err.error?.message || err.message || 'Authentication failed';
        console.log('Error message:', errorMessage);
        
        const isEmailConflict = 
          errorMessage.toLowerCase().includes('email') || 
          errorMessage.toLowerCase().includes('already exists') ||
          errorMessage.toLowerCase().includes('already registered');
        
        dispatch(toggleUIState({ key: 'showLoginError', value: true }));
        dispatch(toggleUIState({ key: 'loginErrorType', value: isEmailConflict ? 'email_conflict' : 'oauth_failed' }));
      });
  }, [dispatch, navigate]);

  return <div>Signing in with Google, please wait...</div>;
}

export default GoogleCallback;
