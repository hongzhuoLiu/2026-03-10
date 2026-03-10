import React from 'react';
import { useSelector } from 'react-redux';
import ProfileIcon from '../../images/icons/my_profile.png'; // Adjust the path as necessary

const UserProfileDetail = () => {
    const { user } = useSelector((state) => state.auth);

    return (
        <div className="max-w-7xl mx-auto px-8 my-8">
            <div className="flex flex-col md:flex-row items-center bg-white shadow-lg rounded-lg p-6">
                <div className="flex justify-center md:flex-1 md:max-w-[33%] mb-4 md:mb-0">
                    <img 
                        src={user?.avatar?.formats?.thumbnail?.url || ProfileIcon} 
                        alt="Profile" 
                        className="w-24 h-24 md:w-48 md:h-48 rounded-full shadow-md object-cover" 
                    />
                </div>
                <div className="flex-1 md:flex-2 md:pl-8">
                    <h1 className="text-2xl font-bold text-center md:text-left mb-4">
                        {user?.username || 'Username'}
                    </h1>
                    <div className="text-md text-gray-600 text-center md:text-left mb-4">
                        <p>{user?.bio || 'This user has not added a bio yet.'}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                        <p><span className="font-semibold">Email:</span> {user?.email || 'Not provided'}</p>
                        <p><span className="font-semibold">University:</span> {user?.university?.universityName || 'Not specified'}</p>
                        <p><span className="font-semibold">Student Status:</span> {user?.studentStatus || 'Not specified'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfileDetail;