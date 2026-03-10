import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleUIState } from '../app/features/ui/UIReducer';
import CrossBtnLight from '../images/icons/CrossLight.png';
import SCLogoWhite from '../images/logos/SCLogoWhiteBG.png';

export default function LoginError() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(10);
    
    // get error Type from Redux 
    const errorType = useSelector(state => state.ui.loginErrorType);

    useEffect(() => {      
        document.body.style.overflow = 'hidden';
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleReturnLogin();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearInterval(timer);
            document.body.style.overflow = 'auto';
        };
    }, []);

    const handleReturnLogin = () => {
        dispatch(toggleUIState({ key: 'showLoginError', value: false }));
        dispatch(toggleUIState({ key: 'showLogin', value: true }));
        navigate('/', { replace: true });
    };

    const handleReturnHome = () => {
        dispatch(toggleUIState({ key: 'showLoginError', value: false }));
        navigate('/', { replace: true });
    };

    const getErrorMessage = () => {
        switch (errorType) {
            case 'email_conflict':
                return "This email is already registered with another login method. Please use the original login method to sign in.";
            case 'oauth_failed':
                return "Authentication failed. Please try again.";
            default:
                return "An error occurred during login. Please try again.";
        }
    };

    return (
        <div className="fixed top-0 left-0 sm:m-0 w-screen h-[100dvh] flex justify-center items-center z-10 bg-black bg-opacity-50 overflow-y-auto">
            <div className="popUpStyling overflow-y-scroll">

                {/* Close button */}
                <div className="flex justify-end items-center relative w-full h-[8vh] mt-12 sm:mt-8">
                    <img
                        src={CrossBtnLight}
                        className="h-[55px] w-[55px] ml-3 bg-white dark:bg-gray-600 rounded-md shadow-md sm:hover:shadow-xl transition duration-300 cursor-pointer"
                        alt="Cancel button"
                        onClick={handleReturnHome}
                    />
                </div>

                {/* Content */}
                <div className="flex flex-col items-center justify-center w-full px-6 sm:px-8 py-6 min-h-[30vh] space-y-8">
                    <img src={SCLogoWhite} className="h-24 sm:h-28 mt-2" alt="Logo" />
                    <h1 className="text-center mb-6 text-2xl sm:text-3xl font-bold text-sc-red dark:text-gray-300">
                        Login Failed
                    </h1>
                    <p className="text-gray-700 dark:text-gray-300 text-center text-lg sm:text-xl px-4">
                        {getErrorMessage()}
                    </p>
                    <button
                        onClick={handleReturnLogin}
                        className="w-full max-w-[360px] py-3 rounded bg-rose-900 text-white text-lg font-semibold transition hover:bg-rose-800"
                    >
                        Return to Login ({countdown}s)
                    </button>
                </div>
            </div>
        </div>
    );
}
