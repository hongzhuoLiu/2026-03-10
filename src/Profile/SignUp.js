import React, { useEffect, useState } from "react";
import CrossBtnLight from '../images/icons/CrossLight.png';
import SCLogoWhite from "../images/logos/SCLogoWhiteBG.png";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, userLogin } from "../app/features/authentication/AuthenticationInteractions";
import { toggleUIState } from "../app/features/ui/UIReducer";

function SignUp() {
    const [localError, setLocalError] = useState(null);  // Local error to handle password mismatch

    useEffect(() => {
        // Disable background scrolling only if necessary
        document.body.style.overflow = 'hidden';
        
        // Clean up function to re-enable scrolling when the component unmounts
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const { isLoading, error: reduxError } = useSelector(
        (state) => state.auth
    );

    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const username = e.target.elements.username.value;
        const email = e.target.elements.email.value;
        const password = e.target.elements.password.value;
        const passwordConfirm = e.target.elements.passwordConfirm.value;

        if (password === passwordConfirm) {
            setLocalError(null); // Clear any previous local errors
            const result = await dispatch(registerUser({ username, email, password }));

            if (result.type !== "auth/register/rejected") {
                await dispatch(userLogin({ email, password }));

                dispatch(toggleUIState({ key: 'showSignUp' }));
                dispatch(toggleUIState({ key: 'showCreateProfile' }));
            }
        } else {
            setLocalError("Passwords do not match.");  // Set local error for password mismatch
        }
    };

    return (
        <div className="absolute top-0 left-0 m-0 w-screen h-[100dvh] flex justify-center items-center z-10 bg-black bg-opacity-50 overflow-y-auto">
            <div className="popUpStyling max-h-full overflow-y-auto">
                <div className="flex justify-end items-center relative w-full h-[8vh] mt-12 sm:mt-0">
                    <img src={CrossBtnLight}
                         className="h-[50px] ml-3 bg-white dark:bg-gray-600 rounded-md shadow-md sm:hover:shadow-xl transition duration-300 cursor-pointer"
                         alt="Cancel button" onClick={() => { dispatch(toggleUIState({ key: 'showSignUp' })) }} />
                </div>

                <img src={SCLogoWhite} className="h-1/6" alt="Student's Choice Logo" />

                <h1 className="text-center mb-0 text-2xl font-bold text-sc-red dark:text-gray-300">Welcome to Student's Choice</h1>

                <form className="w-4/5 m-auto flex-col items-center" onSubmit={handleSubmit}>
                    <h2 className="inputTitleText">Display Name</h2>
                    <input className="editInputStyling" name="username" type="text"
                           placeholder="What should we call you" required />

                    <h2 className="inputTitleText">Email</h2>
                    <input className="editInputStyling" name="email" type="email" placeholder="Enter your email"
                           required />

                    <h2 className="inputTitleText">Password</h2>
                    <input className="editInputStyling" name="password" type="password"
                           placeholder="Enter your password" minLength={6} required />

                    <h2 className="inputTitleText">Confirm Password</h2>
                    <input className="editInputStyling" name="passwordConfirm" type="password"
                           placeholder="Enter your password" minLength={6} required />
                    <p className="text-xs text-gray-500 text-center mt-2">
                        By clicking Sign Up, you agree to our{" "}
                        <a href="/termsandconditions" className="underline hover:text-gray-700">Terms & Conditions</a>,{" "}
                        <a href="/privacy" className="underline hover:text-gray-700">Privacy Policy</a> and{" "}
                        <a href="/cookies" className="underline hover:text-gray-700">Cookies Policy</a>.
                    </p>
                    <button type="submit" className="popUpButtonStyling2 bg-rose-900" disabled={isLoading}>
                        {isLoading ? "Signing in..." : "Sign up"}
                    </button>

                    <button
                        className="popUpButtonStyling"
                        onClick={(e) => {
                            e.preventDefault(); 
                            dispatch(toggleUIState({ key: 'showSignUp', value: false }));
                            dispatch(toggleUIState({ key: 'showLogin', value: true }));
                        }}
                        >
                        Login instead
                    </button>

                    {/* Display either the local (password mismatch) error or the redux error */}
                    {(localError || reduxError) && <h4 className="error">{localError || reduxError}</h4>}
                </form>
                <br />
            </div>
        </div>
    );
}

export default SignUp;