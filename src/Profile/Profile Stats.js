import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import CrossBtnLight from '../images/icons/CrossLight.png';
import { useDispatch, useSelector } from "react-redux";
import { logout } from '../app/features/authentication/AuthenticationReducer';
import { toggleUIState } from "../app/features/ui/UIReducer";

import InterestCircle from "../components/Elements/InterestCircle";
import UserProfile from "./UserProfile";

function ProfileStats() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        // Disable background scrolling when component mounts
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto'; // Enable background scrolling when component unmounts
        };
    }, []);

    const logoutUser = () => {
        dispatch(logout());
        dispatch(toggleUIState({ key: 'showProfile' }));
        navigate("/", { replace: true });
    };

    return (
        <div className="fixed top-0 left-0 m-0 w-screen h-[100dvh] flex justify-center items-center z-10 bg-black bg-opacity-50">
            <div className="popUpStyling">
                <div className="flex justify-center items-center w-full h-full">
                    {user && (
                        <div className="relative mx-auto text-center w-full h-full flex flex-col justify-between">
                            {/* Header section */}
                            <div className="flex justify-between items-center relative w-full h-[8vh] mt-12 sm:mt-[-10px]">
                                <button
                                    className="bg-sc-red shadow-md rounded-md flex justify-evenly items-center text-white font-bold cursor-pointer w-[150px] h-[50px] py-2 px-4 sm:hover:shadow-xl transition duration-300"
                                    onClick={logoutUser}
                                >
                                    <p>Logout</p>
                                </button>
                                <div className="flex">
                                    <button
                                        className="h-[50px] w-[150px] rounded-md bg-white dark:bg-gray-600 shadow-md text-xl font-bold text-gray-500 dark:text-gray-200 sm:hover:shadow-xl transition duration-300"
                                        onClick={() => {
                                            dispatch(toggleUIState({ key: 'showProfile' }));
                                            dispatch(toggleUIState({ key: 'showNotificationSettings' }));
                                        }}
                                    >
                                        Notifications
                                    </button>
                                    <button
                                        className="h-[50px] w-[150px] ml-3 rounded-md bg-white dark:bg-gray-600 shadow-md text-xl font-bold text-gray-500 dark:text-gray-200 sm:hover:shadow-xl transition duration-300"
                                        onClick={() => {
                                            dispatch(toggleUIState({ key: 'showProfile' }));
                                            dispatch(toggleUIState({ key: 'showEditProfile' }));
                                        }}
                                    >
                                        Edit Profile
                                    </button>
                                    <img
                                        src={CrossBtnLight}
                                        className="h-[50px] ml-3 bg-white dark:bg-gray-600 rounded-md shadow-md sm:hover:shadow-xl transition duration-300 cursor-pointer"
                                        alt="Cancel button"
                                        onClick={() => {
                                            dispatch(toggleUIState({ key: 'showProfile' }));
                                        }}
                                    />
                                </div>
                                
                            </div>

                            <div className="w-full">
                                <InterestCircle 
                                    dispatch={dispatch}
                                    user={user}
                                    userInterests={user.interests}
                                />
                            </div>
                            
                            {user.university && (
                                <h2 className="text-2xl text-gray-500 dark:text-gray-300">{user?.university.universityName}</h2>
                            )}

                            <div className="mt-5">
                                <UserProfile />
                            </div>
                            

                            {/* Logout button */}
                            
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProfileStats;