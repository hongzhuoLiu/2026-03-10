import {createAsyncThunk} from '@reduxjs/toolkit'
import {API} from "../../../API";

export const userLogin = createAsyncThunk(
    'auth/login',
    async ({email, password}, {rejectWithValue}) => {

        try {
            const value = {
                identifier: email,
                password: password,
            };

            const response = await fetch(`${API}/auth/local`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(value),
            });

            if (!response.ok) {
                const error = await response.json();
                return rejectWithValue(error.error.message);
            }

            const data = await response.json();

            localStorage.setItem('jwt', data.jwt)

            const userDetailsResponse = await fetch(`${API}/users/me?fields[0]=username&fields[1]=email&fields[2]=studentStatus&fields[3]=notificationPreferences&populate[university][fields][0]=universityName&populate[avatar][fields][0]=formats&populate[avatar][fields][1]=url&populate[comments][fields][0]=id&populate[reviews][fields][0]=&populate[blogs][fields][0]=&populate[qnas][fields][0]=`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${data.jwt}`,
                },
            });

            if (!userDetailsResponse.ok) {
                const error = await userDetailsResponse.json();
                return rejectWithValue(error.message);
            }

            const userDetails = await userDetailsResponse.json();

            return {...data, user: userDetails,loginMethod: 'email',};
        } catch (error) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message)
            } else {
                return rejectWithValue(error.message)
            }
        }
    }
)

export const registerUser = createAsyncThunk(
    'auth/register',
    async ({ username, email, password }, { rejectWithValue }) => {
        try {
            const usernameRegex = /^[a-zA-Z0-9]+$/;

            if (!username.trim() || !usernameRegex.test(username)) {
                return rejectWithValue("Username must contain only letters and numbers, and cannot be empty.");
            }

            const response = await fetch(`${API}/auth/local/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();
            if (data?.error) {
                throw data?.error;
            }


        } catch (error) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message)
            } else {
                return rejectWithValue(error.message)
            }
        }
    }
)


export const googleLogin = createAsyncThunk(
    'auth/googleLogin',
    async ({ jwt }, { rejectWithValue }) => {
      try {
        //Use the same user information query fields uniformly
        const response = await fetch(
            `${API}/users/me?fields[0]=username&fields[1]=email&fields[2]=studentStatus&fields[3]=bio&fields[4]=notificationPreferences`
            //  +
            // `&populate[interests][fields][0]=programFieldName` +
            // `&populate[university][fields][0]=universityName` +
            // `&populate[avatar][fields][0]=formats&populate[avatar][fields][1]=url` +
            // `&populate[comments][fields][0]=id&populate[reviews][fields][0]=id&populate[blogs][fields][0]=id&populate[qnas][fields][0]=id` +
            // `&populate[userUniversityLikes][fields][0]=id` +
            // `&populate[userProgramLikes][fields][0]=programName&populate[userProgramLikes][fields][1]=id` +
            // `&populate[userSubjectLikes][fields][0]=subjectName&populate[userSubjectLikes][fields][1]=id`
            ,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${jwt}`,
              },
            }
          );
  
        if (!response.ok) {
          const error = await response.json();
          return rejectWithValue(error.message);
        }
  
        const userDetails = await response.json();
        
        // storage jwt
        localStorage.setItem('jwt', jwt);
        
        return { jwt, user: userDetails , loginMethod: 'google',};
      } catch (error) {
        return rejectWithValue(error.message || 'Google login failed');
      }
    }
);
  

export const facebookLogin = createAsyncThunk(
    'auth/facebookLogin',
    async ({ jwt }, { rejectWithValue }) => {
      try {
        const response = await fetch(
          `${API}/users/me?fields[0]=username&fields[1]=email&fields[2]=studentStatus&fields[3]=bio&fields[4]=notificationPreferences&populate[interests][fields][0]=programFieldName&populate[university][fields][0]=universityName&populate[avatar][fields][0]=formats&populate[avatar][fields][1]=url&populate[comments][fields][0]=id&populate[reviews][fields][0]=&populate[blogs][fields][0]=&populate[qnas][fields][0]=&populate[userUniversityLikes][fields][0]=&populate[userProgramLikes][fields][0]=id&populate[userProgramLikes][fields][1]=programName&populate[userSubjectLikes][fields][0]=id&populate[userSubjectLikes][fields][1]=subjectName`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );
  
        if (!response.ok) {
          const error = await response.json();
          return rejectWithValue(error.message);
        }
  
        const userDetails = await response.json();
        localStorage.setItem('jwt', jwt);
  
        return { jwt, user: userDetails, loginMethod: 'facebook' };
      } catch (error) {
        return rejectWithValue(error.message || 'Facebook login failed');
      }
    }
);
  