import CrossBtnLight from '../images/icons/CrossLight.png';
import React, { useEffect, useState } from "react";
import { useUpdateUserProfileMutation } from "../app/service/usersAPI";
import { setCredentials } from "../app/features/authentication/AuthenticationReducer";
import { useDispatch, useSelector } from "react-redux";
import { toggleUIState } from "../app/features/ui/UIReducer";

// Default notification preferences
const defaultNotificationPreferences = {
    inApp: {
        like: true,
        comment: true,
        systemUpdates: true,
    },
    email: {
        systemUpdates: true,
        activityDigest: "monthly", // Options: 'none', 'weekly', 'monthly'
    }
};

const BellIcon = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke-width="1.5" 
        stroke="currentColor" 
        className={className}>
        <path 
            stroke-linecap="round" 
            stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
    </svg>
);

const EmailIcon = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" viewBox="0 0 24 24" 
        stroke-width="1.5" 
        stroke="currentColor" 
        className={className}>
        <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
    </svg>
);

// Helper to get user preferences with defaults
export const getUserPreferences = (user) => {
    return user?.notificationPreferences || defaultNotificationPreferences;
};

function NotificationSettings() {
    
    useEffect(() => {
        // Disable background scrolling
        document.body.style.overflow = 'hidden';
        
        // Clean up function to re-enable scrolling when the component unmounts
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const { user, jwt, loginMethod } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const [preferences, setPreferences] = useState(getUserPreferences(user));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [updateUserProfile] = useUpdateUserProfileMutation();

    // Update preferences when user changes
    useEffect(() => {
        if (user) {
            setPreferences(getUserPreferences(user));
        }
    }, [user]);

    const handlePreferenceChange = (category, setting, value) => {
        const newPreferences = {
            ...preferences,
            [category]: {
                ...preferences[category],
                [setting]: value
            }
        };
        setPreferences(newPreferences);
    };

    const handleSavePreferences = async () => {
        try {
            setLoading(true);
            setError("");
            setSuccessMessage("");

            const updatedUser = {
                ...user,
                notificationPreferences: preferences
            };

            const updateResponse = await updateUserProfile(updatedUser).unwrap();
            console.log('Notification preferences updated:', updateResponse);
            
            dispatch(setCredentials({
                user: updatedUser,
                jwt: jwt,
                loginMethod: loginMethod
            }));
            setSuccessMessage("Notification preferences updated successfully!");
            
        } catch (updateError) {
            console.error('Error updating notification preferences:', updateError);
            setError(updateError?.message ?? "Error updating preferences!");
        } finally {
            console.log('Finished updating preferences: ', user);
            setLoading(false);
        }
    };

    // Toggle Switch Component
    const ToggleSwitch = ({ label, checked, onChange, disabled = false }) => (
        <div className="flex justify-between items-center py-3 px-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm mb-3">
            <span className="text-gray-700 dark:text-gray-200 font-medium">{label}</span>
            <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    disabled={disabled}
                    className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-sc-red"></div>
            </label>
        </div>
    );

    // Custom Selector Component for activity digest settings
    const DigestSelector = ({ value, onChange }) => {
        const options = [
            { key: 'none', label: 'None' },
            { key: 'weekly', label: 'Weekly' },
            { key: 'monthly', label: 'Monthly' }
        ];

        return (
            <div className="flex justify-between items-center py-3 px-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm mb-3">
                <span className="text-gray-700 dark:text-gray-200 font-medium">Activity digest emails</span>
                <div className="relative bg-gray-200 dark:bg-gray-600 rounded-lg p-1 flex">
                    {options.map((option) => (
                        <button
                            key={option.key}
                            onClick={() => onChange(option.key)}
                            className={`
                                relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 z-10
                                ${value === option.key 
                                    ? 'text-white bg-sc-red shadow-md' 
                                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
                                }
                            `}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="fixed top-0 left-0 m-0 w-screen h-[100dvh] flex justify-center items-center z-10 bg-black bg-opacity-50">
            <div className="popUpStyling justify-between min-h-full max-h-full overflow-y-auto">
                <div className="flex flex-col justify-center items-center w-full flex-grow mt-12 sm:mt-0">
                    {user && (
                        <div className="mx-auto text-center w-full h-full flex flex-col justify-between flex-grow">

                            {/* Header with buttons */}
                            <div className="flex justify-between items-center relative w-full h-[8vh] sm:mt-[-10px]">
                                <button 
                                    className="bg-sc-red shadow-md rounded-md flex justify-evenly items-center text-white font-bold cursor-pointer w-[150px] h-[50px] py-2 px-4 sm:hover:shadow-xl transition duration-300"
                                    onClick={handleSavePreferences}
                                    disabled={loading}
                                >
                                    <p>{loading ? "Saving..." : "Save Settings"}</p>
                                </button>

                                <div className="flex">
                                    <button
                                        className="h-[50px] w-[150px] rounded-md bg-white dark:bg-gray-600 shadow-md text-xl font-bold text-gray-500 dark:text-gray-200 sm:hover:shadow-xl transition duration-300"
                                        onClick={() => {
                                            dispatch(toggleUIState({ key: 'showNotificationSettings' }));
                                            dispatch(toggleUIState({ key: 'showProfile' }));
                                        }}
                                    >
                                        Back to Profile
                                    </button>
                                    <img 
                                        src={CrossBtnLight}
                                        className="h-[50px] ml-3 bg-white dark:bg-gray-600 rounded-md shadow-md sm:hover:shadow-xl transition duration-300 cursor-pointer"
                                        alt="Cancel button"
                                        onClick={() => dispatch(toggleUIState({ key: 'showNotificationSettings' }))}
                                    />
                                </div>
                            </div>

                            {/* Title */}
                            <div className="mb-6">
                                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                                    Notification Settings
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Manage how you receive notifications
                                </p>
                            </div>

                            {/* Settings Content */}
                            <div className="flex-grow w-full max-w-2xl mx-auto space-y-6">
                                
                                {/* In-App Notifications Section */}
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                                        <BellIcon className="w-6 h-6 mr-2" />
                                        In-App Notifications
                                    </h3>
                                    
                                    <ToggleSwitch
                                        label="Likes on your posts"
                                        checked={preferences.inApp.like}
                                        onChange={(value) => handlePreferenceChange('inApp', 'like', value)}
                                    />
                                    
                                    <ToggleSwitch
                                        label="Comments on your posts"
                                        checked={preferences.inApp.comment}
                                        onChange={(value) => handlePreferenceChange('inApp', 'comment', value)}
                                    />
                                    
                                    <ToggleSwitch
                                        label="System updates and announcements"
                                        checked={preferences.inApp.systemUpdates}
                                        onChange={(value) => handlePreferenceChange('inApp', 'systemUpdates', value)}
                                    />
                                </div>

                                {/* Email Notifications Section */}
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                                        <EmailIcon className="w-6 h-6 mr-2" />
                                        Email Notifications
                                    </h3>
                                    
                                    <ToggleSwitch
                                        label="System updates and announcements"
                                        checked={preferences.email.systemUpdates}
                                        onChange={(value) => handlePreferenceChange('email', 'systemUpdates', value)}
                                    />

                                    <DigestSelector
                                        value={preferences.email.activityDigest}
                                        onChange={(value) => handlePreferenceChange('email', 'activityDigest', value)}
                                    />
                                </div>
                            </div>

                            {/* Status Messages */}
                            {error && (
                                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                    {error}
                                </div>
                            )}
                            
                            {successMessage && (
                                <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                                    {successMessage}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default NotificationSettings;