import React from "react";
import googleIcon from "../images/logos/googleLogin.png";
import emailIcon from "../images/logos/emailLogin.png";
import facebookIcon from "../images/logos/FacebookIcon.png";
import CrossBtnLight from '../images/icons/CrossLight.png';
import SCLogoWhite from '../images/logos/SCLogoWhiteBG.png';
import { useDispatch, useSelector } from "react-redux";
import { toggleUIState } from "../app/features/ui/UIReducer";

export default function LoginOptions({ loginMessage = "Welcome to Student's Choice" }) {
    const dispatch = useDispatch();
    //const { showLogin, showLoginPost } = useSelector((state) => state.ui);

    const closeAll = () => {
        dispatch(toggleUIState({ key: "showLoginPost", value: false }));
        dispatch(toggleUIState({ key: "showLogin", value: false }));
    };

    const handleEmailClick = () => {
        closeAll();
        dispatch(toggleUIState({ key: "showEmailLogin", value: true }));
    };
    

    const handleOAuthClick = (provider) => {
        closeAll();
        const url = `https://backend-dev.studentschoice.blog/api/connect/${provider}`;
        window.location.href = url;
    };

    return (
        <div className="fixed top-0 left-0 sm:m-0 w-screen h-[100dvh] flex justify-center items-center z-10 bg-black bg-opacity-50 overflow-y-auto">
            <div className="popUpStyling overflow-y-scroll">
                <div className="flex justify-end items-center relative w-full h-[8vh] mt-12 sm:mt-0">
                    <img
                        src={CrossBtnLight}
                        className="h-[50px] ml-3 bg-white dark:bg-gray-600 rounded-md shadow-md sm:hover:shadow-xl transition duration-300 cursor-pointer"
                        alt="Cancel button"
                        onClick={closeAll}
                    />
                </div>

                <img src={SCLogoWhite} className="h-1/6" alt="Student's Choice Logo" />

                <h1 className="text-center mb-4 text-2xl font-bold text-sc-red dark:text-gray-300">
                    {loginMessage}
                </h1>

                <div className="flex flex-col items-center justify-center w-full mt-6 min-h-[30vh] space-y-6">

                   {/* Google Login */}
                    <button
                        onClick={() => handleOAuthClick("google")}
                        className="relative flex justify-center items-center w-[360px] border border-gray-300 px-4 py-2 rounded-md bg-white shadow-sm hover:shadow-md transition"
                    >
                        <img src={googleIcon} className="absolute left-3 w-8 h-8" alt="Google" />
                        <span className="text-base font-semibold text-gray-700">Continue with Google</span>
                    </button>

                    {/* Facebook Login */}
                    <button
                        //disabled
                        onClick={() => handleOAuthClick("facebook")}
                        className="relative flex justify-center items-center w-[360px] border border-gray-300 px-4 py-2 rounded-md bg-white shadow-sm hover:shadow-md transition"
                    >
                        <img
                            src={facebookIcon}
                            alt="Facebook"
                            className="absolute w-5 h-5"
                            style={{ left: '18px' }} // == left-4.5
                            />

                        <span className="text-base font-semibold text-gray-700">Continue with Facebook</span>
                    </button>

                    {/* Email Login */}
                    <button
                        onClick={handleEmailClick}
                        className="relative flex justify-center items-center w-[360px] border border-gray-300 px-4 py-2 rounded-md bg-white shadow-sm hover:shadow-md transition"
                    >
                        <img src={emailIcon} className="absolute left-4 w-6 h-6" alt="Email" />
                        <span className="text-base font-semibold text-gray-700">Continue with Email</span>
                    </button>
                    <p className="text-xs text-gray-500 text-center mt-2">
                        By continuing, you agree to our{" "}
                        <a href="/termsandconditions" className="underline hover:text-gray-700">Terms & Conditions</a>,{" "}
                        <a href="/privacy" className="underline hover:text-gray-700">Privacy Policy</a> and{" "}
                        <a href="/cookies" className="underline hover:text-gray-700">Cookies Policy</a>.
                    </p>


                </div>

            </div>
        </div>
    );
}
