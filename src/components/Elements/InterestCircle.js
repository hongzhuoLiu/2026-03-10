import { useState, useEffect, useRef } from "react";
import { motion } from 'framer-motion';
import ColorThief from 'colorthief';
import CrossBtnLight from '../../images/icons/CrossLight.png';
import DefaultProfilePic from "../../images/miscellaneous/DefaultProfilePhoto.jpg";
import { BASE_URL } from "../../API";

function InterestCircle({ userInterests, setUserInterests, updateUserProfile, dispatch, setCredentials, user, edit = false }) {
    const imgRef = useRef(null); // Reference for the image
    const [averageColor, setAverageColor] = useState('rgba(255,255,255,0)'); // Default to transparent
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Check for dark mode
    useEffect(() => {
        // Check initial dark mode
        if (typeof window !== 'undefined') {
            const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            setIsDarkMode(darkModeMediaQuery.matches);
            
            // Set up listener for changes
            const handleChange = (e) => setIsDarkMode(e.matches);
            darkModeMediaQuery.addEventListener('change', handleChange);
            
            // Cleanup
            return () => darkModeMediaQuery.removeEventListener('change', handleChange);
        }
    }, []);

    useEffect(() => {
        const colorThief = new ColorThief();
        const imgElement = imgRef.current;

        const getColor = () => {
            if (imgElement && imgElement.complete) {
                const result = colorThief.getColor(imgElement);
                setAverageColor(`rgb(${result[0]}, ${result[1]}, ${result[2]})`);
            } else if (imgElement) {
                imgElement.addEventListener('load', () => {
                    const result = colorThief.getColor(imgElement);
                    setAverageColor(`rgb(${result[0]}, ${result[1]}, ${result[2]})`);
                });
            }
        };

        getColor();
    }, [user.avatar]);

    const handleRemoveInterest = async (interest) => {
        const updatedInterests = userInterests.filter(i => i.programFieldName !== interest.programFieldName);
        setUserInterests(updatedInterests); // Update UI

        // Update backend
        try {
            const updatedUser = { ...user, interests: updatedInterests };
            await updateUserProfile(updatedUser).unwrap(); // Update profile in the backend
            dispatch(setCredentials(updatedUser)); // Update Redux state
        } catch (error) {
            console.error("Error updating interests", error);
        }
    };

    return (
        <div>
            <div className="w-full flex justify-center mt-[-5%]">
                <div
                    className="relative w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] rounded-full"
                    style={{
                        background: `radial-gradient(circle, ${averageColor} 0%, transparent 50%)`,
                    }}
                >
                    {userInterests && (
                        userInterests.slice(0, Math.min(userInterests.length, 8)).map((interest, index) => {
                            const totalItems = userInterests.length >= 8 ? 8 : userInterests.length;
                            const angle = (360 / totalItems) * index - 90;
                            const radius = window.innerWidth >= 640 ? 180 : 140;
                            const x = radius * Math.cos((angle * Math.PI) / 180);
                            const y = radius * Math.sin((angle * Math.PI) / 180);

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 260,
                                        damping: 20,
                                        delay: index * 0.1,
                                        ease: 'easeInOut',
                                    }}
                                    className="absolute w-[100px] sm:w-[130px] h-[40px] sm:h-[50px] bg-white bg-opacity-50 dark:bg-gray-800 dark:bg-opacity-30 rounded-md shadow-[0_0_10px_rgba(255,255,255,0.6)] dark:shadow-none flex items-center justify-center"
                                    style={{
                                        top: `calc(50% + ${y}px)`,
                                        left: `calc(50% + ${x}px)`,
                                        transform: 'translate(-50%, -50%)',
                                    }}
                                >
                                    <p className="text-sm sm:text-base font-bold text-gray-500 dark:text-gray-200">
                                        {interest.programFieldName}
                                    </p>
                                    {/* Only show the "x" button if edit is true */}
                                    {edit && (
                                        <button
                                            className="absolute top-[-10px] right-[-10px] bg-gray-50 dark:bg-gray-600 p-1 rounded-md"
                                            onClick={() => handleRemoveInterest(interest)}
                                        >
                                            <img src={CrossBtnLight} alt="Remove" className="h-[15px] w-[15px]" />
                                        </button>
                                    )}
                                </motion.div>
                            );
                        })
                    )}
                    <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
                        <img
                            ref={imgRef}
                            src={user.avatar ? `${BASE_URL}${user.avatar.formats.thumbnail.url}` : DefaultProfilePic}
                            className="w-[150px] h-[150px] relative overflow-hidden rounded-full object-fill"
                            alt="Profile avatar"
                            crossOrigin="anonymous"
                        />
                    </div>
                </div>
            </div>
            {!edit && (
                <h1 
                    className="font-bold text-4xl dark:text-gray-200 mt-[0%]" 
                    style={!isDarkMode ? { color: averageColor } : {}}
                >
                    Hey, {user.username}
                </h1>
            )}
        </div>
    );
}

export default InterestCircle;