import React from 'react';
import { useState } from 'react';

import SelectButtonGroup from '../Elements/SelectButtonGroup';

const UserProfileBar = ({ active, onButtonClick }) => {

    const profileButtons = [
        // { text: "Home", type: "home" },
        { text: "My Bookmarks", type: "bookmarks" },
        { text: "My Activity", type: "activity" },
    ];

    const [profileButton, setProfileButton] = useState("bookmarks");

    return (
        <div className="w-full">
            <div className="w-[95%] sm:w-1/2 lg:w-1/3 mx-auto">

            <SelectButtonGroup
                options={profileButtons}
                selectedOption={profileButton}
                onOptionChange={(buttonType) => {
                    setProfileButton(buttonType);
                    onButtonClick(buttonType);  // Ensure this triggers the page change in UserProfile
                }}
            />

                {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-6">
                    Home button
                    <button 
                        className={`flex items-center justify-center space-x-4 px-4 py-4 rounded-lg transition-all duration-300 ${getButtonClass('home')}`}
                        onClick={() => onButtonClick('home')}
                    >
                        <p className="text-lg sm:text-xl lg:text-2xl">Home</p>
                        <img 
                            src={HomeIcon} 
                            alt="Home" 
                            className={`h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 transition-all duration-300 ${active !== 'home' ? 'filter invert' : ''}`} 
                        />
                    </button>

                    Bookmarks button
                    <button 
                        className={`flex items-center justify-center space-x-4 px-4 py-4 rounded-lg transition-all duration-300 ${getButtonClass('bookmarks')}`}
                        onClick={() => onButtonClick('bookmarks')}
                    >
                        <p className="text-lg sm:text-xl lg:text-2xl">My Bookmarks</p>
                        <img 
                            src={BookmarkIcon} 
                            alt="My Bookmarks" 
                            className={`h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 transition-all duration-300 ${active !== 'bookmarks' ? 'filter invert' : ''}`} 
                        />
                    </button>

                    Activity button
                    <button 
                        className={`flex items-center justify-center space-x-4 px-4 py-4 rounded-lg transition-all duration-300 ${getButtonClass('activity')}`}
                        onClick={() => onButtonClick('activity')}
                    >
                        <p className="text-lg sm:text-xl lg:text-2xl">My Activity</p>
                        <img 
                            src={ActivityIcon} 
                            alt="My Activity" 
                            className={`h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 transition-all duration-300 ${active !== 'activity' ? 'filter invert' : ''}`} 
                        />
                    </button>

                    Profile button
                    <button 
                        className={`flex items-center justify-center space-x-4 px-4 py-4 rounded-lg transition-all duration-300 ${getButtonClass('profile')}`}
                        onClick={() => onButtonClick('profile')}
                    >
                        <p className="text-lg sm:text-xl lg:text-2xl">My Profile</p>
                        <img 
                            src={ProfileIcon} 
                            alt="My Profile" 
                            className={`h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 transition-all duration-300 ${active !== 'profile' ? 'filter invert' : ''}`} 
                        />
                    </button>
                </div> */}
            </div>
        </div>
    );
};

export default UserProfileBar;