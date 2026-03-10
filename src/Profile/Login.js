// Images
import CrossBtnLight from '../images/icons/CrossLight.png';
import SCLogoWhite from '../images/logos/SCLogoWhiteBG.png';

import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from 'react-redux'

import {userLogin} from "../app/features/authentication/AuthenticationInteractions";
import {clearError} from "../app/features/authentication/AuthenticationReducer";
import {toggleUIState} from "../app/features/ui/UIReducer";
import PasswordReset from "./PasswordReset"; // 导入密码重置组件

import { useNavigate } from 'react-router-dom';

function Login({loginMessage}) {
    const navigate = useNavigate();
    
    // 添加忘记密码状态
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    useEffect(() => {
        // Disable background scrolling
        document.body.style.overflow = 'hidden';
        
        // Clean up function to re-enable scrolling when the component unmounts
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const {isLoading, error, user} = useSelector((state) => state.auth)
    const {showLogin, showLoginPost, showEmailLogin} = useSelector((state) => state.ui)

    const dispatch = useDispatch()

    const handleSubmit = (e) => {
        e.preventDefault();
        const email = e.target.elements.email.value;
        const password = e.target.elements.password.value;

        dispatch(userLogin({email, password}))
    };

    useEffect(() => {
        if (user) {
            if (showLogin) {
                dispatch(toggleUIState({ key: 'showLogin', value: false }));
                dispatch(toggleUIState({ key: 'showProfile', value: false }));
            }
    
            if (showLoginPost) {
                dispatch(toggleUIState({ key: 'showLoginPost', value: false }));
                dispatch(toggleUIState({ key: 'showCreatePost', value: true }));
            }
    
            if (showEmailLogin) {
                dispatch(toggleUIState({ key: 'showEmailLogin', value: false }));
                navigate('/');
            }
        }
    }, [user, dispatch, showLogin, showLoginPost, showEmailLogin, navigate]);
    

    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    // 如果显示忘记密码界面，则渲染密码重置组件
    if (showForgotPassword) {
        return <PasswordReset onClose={() => setShowForgotPassword(false)} />;
    }

    return (
        <div className="fixed top-0 left-0 sm:m-0 w-screen h-[100dvh] flex justify-center items-center z-10 bg-black bg-opacity-50 overflow-y-auto">

            <div className="popUpStyling overflow-y-scroll">
                <div className="flex justify-end items-center relative w-full h-[8vh] mt-12 sm:mt-0">
                    <img src={CrossBtnLight}
                         className="h-[50px] ml-3 bg-white dark:bg-gray-600 rounded-md shadow-md sm:hover:shadow-xl transition duration-300 cursor-pointer"
                         alt="Cancel button"
                         onClick={() => {
                            dispatch(toggleUIState({ key: 'showEmailLogin', value: false }));
                        }}/>
                </div>

                <img src={SCLogoWhite} className="h-1/6" alt="Student's Choice Logo"/>

                <h1 className="text-center mb-0 text-2xl font-bold text-sc-red dark:text-gray-300">{loginMessage}</h1>

                <form className="w-4/5 m-auto flex-col items-center" onSubmit={handleSubmit}>
                    <h2 className="inputTitleText">Email</h2>
                    <input className="editInputStyling" name="email" type="email" placeholder="Enter your email"
                           required/>

                    <h2 className="inputTitleText">Password</h2>
                    <input className="editInputStyling" name="password" type="password"
                           placeholder="Enter your password" required/>
                    
                    {/* 将忘记密码按钮移到密码输入框正下方 */}
                    <div className="w-full flex justify-start mt-2 mb-4">
                        <button
                            type="button" 
                            className="text-sm text-sc-red hover:text-red-700 underline transition duration-200"
                            onClick={() => setShowForgotPassword(true)}
                        >
                            Forgot Password?
                        </button>
                    </div>

                    <button type="submit" className="popUpButtonStyling2 bg-rose-900" disabled={isLoading}>
                        {isLoading ? "Logging in..." : "Log In"}
                    </button>

                    <button
                        type="button" 
                        className="popUpButtonStyling"
                        onClick={() => {
                            dispatch(toggleUIState({ key: 'showSignUp', value: true }));
                            dispatch(toggleUIState({ key: 'showEmailLogin', value: false }));
                        }}
                    >
                        New? Sign Up
                    </button>

                    <div className="mt-8 text-left pl-2 min-h-[3.5rem] transition-all duration-200">
                        <p
                            className={`text-base font-medium transition-opacity duration-200 ${
                            error ? "opacity-100" : "opacity-0"
                            }`}
                        >
                            Incorrect email or password.
                        </p>
                        <p
                            className={`text-sm transition-opacity duration-200 ${
                            error ? "opacity-100" : "opacity-0"
                            }`}
                        >
                            If you've previously signed up using Google or Facebook, please try logging in that way.
                        </p>
                    </div>
                </form>

                <br/>
            </div>
        </div>
    );
}

export default Login;