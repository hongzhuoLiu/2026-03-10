import SCLogo from '../../images/logos/SCLogo.png';
import SearchWhite from '../../images/icons/SearchWhite.png';
import MenuBars from '../../images/icons/MenuBars.png';
import SecondMenubar from './SecondMenubar';

import { BASE_URL } from "../../API";
import DefaultProfilePic from "../../images/miscellaneous/DefaultProfilePhoto.jpg";

import Login from '../../Profile/Login';
import LoginOptions from "../../Profile/LoginOptions";
import LoginError from '../../Profile/LoginError';
import Profile from '../../Profile/Profile Stats';
import MobSearch from './MobSearch';

import React, { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useNavigate } from "react-router-dom";




// Import Tailwind
import '../../input.css';

import { useDispatch, useSelector } from "react-redux";
import { useGetUserDetailsQuery } from "../../app/service/usersAPI";
import { setCredentials } from "../../app/features/authentication/AuthenticationReducer";
import { toggleUIState } from "../../app/features/ui/UIReducer";
import { useFuzzySearchQuery } from "../../app/service/fuzzy-search";
import EditProfile from "../../Profile/Edit Profile";
import NotificationSettings from "../../Profile/NotificationSettings";
import SignUp from "../../Profile/SignUp";
import CreateProfile from "../../Profile/Create Profile";
import AddPostPopup from "../Posts/AddPostPopup";



import NotificationBell from '../../app/features/notifications/NotificationBell';
const SHOW_BELL = true;

function Menubar() {
    const dispatch = useDispatch();
    const {
        isMobileView,
        showLogin,
        showLoginPost,
        showEmailLogin,
        showLoginError,
        showSignUp,
        showCreateProfile,
        showProfile,
        showMobSearch,
        showEditProfile,
        showNotificationSettings,
        showCreatePost,
        secondMenubarOpen
    } = useSelector((state) => state.ui);

    const { data, isLoading } = useGetUserDetailsQuery('userDetails', {
        pollingInterval: 900000,
    })

    useEffect(() => {
        if (data !== undefined) {
            dispatch(setCredentials(data))
        }
    }, [data, dispatch])

    useEffect(() => {
        const updateView = () => {
            dispatch(toggleUIState({ key: 'isMobileView', value: window.innerWidth <= 640 }));
        };
        updateView();

        window.addEventListener('resize', updateView);

        return () => {
            window.removeEventListener('resize', updateView);
        };
    }, [dispatch]);

    return (
        <>
            <div className="dark" style={{
                margin: '0', width: '100vw', height: '7vh', position: 'fixed', top: 0, left: 0, zIndex: 100
            }}>
                {isMobileView ? (<MobileMenuBar />) : (<DesktopMenuBar loading={isLoading} />)}
                {showLogin && <LoginOptions loginMessage={"Welcome to Student's Choice"} />}
                {showLoginPost && <LoginOptions loginMessage={"Please login to create or interact with a post!"} />}
                {showEmailLogin && <Login />} 
                {showLoginError && <LoginError />}
                {showProfile && <Profile />}
                {showSignUp && <SignUp />}
                {showCreateProfile && <CreateProfile />}
                {showEditProfile && <EditProfile />}
                {showNotificationSettings && <NotificationSettings />}
                {showMobSearch && <MobSearch />}
                {showCreatePost && <AddPostPopup />}
            </div>
            
            {/* content wrapper for resolve second menubar overlay */}
            <div id="main-content-wrapper" style={{
                paddingTop: '3vh',
                transition: 'padding-top 0.3s ease'
            }}>
                <Outlet />
            </div>
        </>
    );
}

function MobileMenuBar() {
    const dispatch = useDispatch();
    const [isMobTextVisible, setIsMobTextVisible] = useState(false);
    const [areLinksVisible, setAreLinksVisible] = useState(false);
    const { user } = useSelector((state) => state.auth);

    const toggleMobText = () => {
        if (!isMobTextVisible) {
            setIsMobTextVisible(true);
            setTimeout(() => setAreLinksVisible(true), 250);
        } else {
            closeMenu();
        }
    };

    const closeMenu = () => {
        setAreLinksVisible(false);
        setTimeout(() => setIsMobTextVisible(false), 100);
    };

    const handleLinkClick = () => {
        dispatch(toggleUIState({ key: 'showMobSearch', value: false }));
        dispatch(toggleUIState({ key: 'showProfile', value: false }));
        dispatch(toggleUIState({ key: 'showLogin', value: false }));
        closeMenu();
    };

    return (
        <div className="h-full relative z-50">
            {/* Mobile header */}
            <div className="h-full flex items-center justify-between bg-sc-red">
                <Link to="/" className="h-full" onClick={handleLinkClick}>
                    <img src={SCLogo} alt="Logo" className="max-h-full max-w-full" />
                </Link>
                <div className="h-1/2 flex items-center mr-6">
                    <img src={SearchWhite} alt="Search Button" className="h-[150%] mr-[15%]" onClick={() => {
                        handleLinkClick();
                        dispatch(toggleUIState({ key: 'showMobSearch' }));
                    }} />
                    {SHOW_BELL && user?.id && (
                    <div className="mx-2">
                    <NotificationBell autoFeed={false} userId={user.id} />
                    </div>
                    )}


                    <img src={MenuBars} alt="Menu Button" className="h-full" onClick={toggleMobText} />
                </div>
            </div>

            {/* Mobile navigation menu */}
            <div
                className={`${isMobTextVisible ? "bg-sc-red max-h-screen transition-max-height duration-500 ease-out" : "bg-sc-red max-h-0 overflow-hidden transition-max-height duration-500 ease-out"}`}>
                <div
                    className={`flex flex-col items-end justify-center transition-opacity duration-500 ${areLinksVisible ? "opacity-100" : "opacity-0"}`}>
                    <Link to="/" style={{ textDecoration: 'none' }} onClick={handleLinkClick}>
                        <p className="text-white text-3xl mt-4 mr-4 font-bold">Home</p>
                    </Link>
                    <Link to="/universities" style={{ textDecoration: 'none' }} onClick={handleLinkClick}>
                        <p className="text-white text-3xl mt-4 mr-4 font-bold">Universities</p>
                    </Link>
                    <Link to="/programs" style={{ textDecoration: 'none' }} onClick={handleLinkClick}>
                        <p className="text-white text-3xl mt-4 mr-4 font-bold">Programs</p>
                    </Link>
                    <Link to="/subjects" style={{ textDecoration: 'none' }} onClick={handleLinkClick}>
                        <p className="text-white text-3xl mt-4 mr-4 font-bold">Subjects</p>
                    </Link>
                    {user ? (<p className="text-white text-3xl mt-4 mb-4 mr-4 cursor-pointer font-bold" onClick={() => {
                        handleLinkClick();
                        dispatch(toggleUIState({ key: 'showProfile' }));
                    }}>Profile</p>) : (
                        <p className="text-white text-3xl mt-4 mb-4 mr-4 cursor-pointer font-bold" onClick={() => {
                            handleLinkClick();
                            dispatch(toggleUIState({ key: 'showLogin' }));
                        }}>Login</p>)}
                    <SecondMenubar isMobile={true} onMobileLinkClick={handleLinkClick} />
                </div>
            </div>
        </div>
    );
}

function DesktopMenuBar({ loading }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
  
    // Robust userId extraction so the bell won't disappear due to shape differences
    const userId = user?.id ?? user?._id ?? user?.user?.id;
  
    const [searchQuery, setSearchQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    const resultsReference = useRef(null);
  
    const { data: searchResult, refetch } = useFuzzySearchQuery(searchQuery, {
      skip: !searchQuery,
    });
  
    const handleSearch = async () => {
      if (searchQuery.trim()) {
        refetch();
        setShowResults(true);
      }
    };
  
    const handleClickOutside = (event) => {
      if (resultsReference.current && !resultsReference.current.contains(event.target)) {
        setShowResults(false);
      }
    };
  
    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
  
    return (
      <>
        <div className="h-full bg-sc-red shadow-xl">
          <div className="flex justify-between items-center h-full mr-10 ml-5">
            {/* Left: Logo (unchanged) */}
            <Link to="/" style={{ textDecoration: 'none', height: '100%' }}>
              <img src={SCLogo} alt="Logo" className="max-w-full max-h-full" />
            </Link>
  
            {/* Center: Primary nav (unchanged) */}
            <div className="flex items-center justify-between w-2/5 -ml-6">
              {['Universities', 'Programs', 'Subjects'].map((text, index) => (
                <Link key={index} to={`/${text.toLowerCase()}`}>
                  <p className="text-white sm:hover:scale-105 transition duration-300 text-2xl font-bold">
                    {text}
                  </p>
                </Link>
              ))}
              <SecondMenubar isMobile={false} />
            </div>
  
            {/* Right: Search + Actions (bell + avatar/login) */}
            <div className="flex items-center">
              {/* Keep search bar layout/size the same as before */}
              <div
                className="SearchBar hidden lg:flex h-[70%] bg-sc-red px-2 rounded-md"
                style={{ width: '20vw', boxShadow: 'inset 0 0 20px 0 rgba(0, 0, 0, 0.5)' }}
              >
                <input
                  className="w-full border-none bg-transparent outline-none shadow-none text-white text-xl font-bold"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearch();
                  }}
                />
                {/* Inline SVG with fixed size to avoid global CSS enlarging/positioning issues */}
                <button
                  type="button"
                  onClick={handleSearch}
                  className="ml-2 p-1 shrink-0 flex items-center justify-center"
                  aria-label="Search"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="11" cy="11" r="7" stroke="white" strokeWidth="2" />
                    <line x1="20" y1="20" x2="16.65" y2="16.65" stroke="white" strokeWidth="2" />
                  </svg>
                </button>
              </div>
  
              {/* Actions container: bell + avatar/login (sits next to search, doesn't affect layout) */}
              <div className="hidden lg:flex items-center gap-3 ml-3">
                {/* Remove the `!loading` guard so the bell doesn't flicker off while fetching */}
                {SHOW_BELL && userId && <NotificationBell userId={userId} />}
  
                {loading ? (
                  <p className="bg-white px-4 py-1 rounded-md text-sc-red cursor-pointer sm:hover:scale-105 transition duration-300 text-2xl font-bold">
                    Loading...
                  </p>
                ) : user ? (
                  <img
                    src={
                      user?.avatar?.formats?.thumbnail?.url
                        ? `${BASE_URL}${user.avatar.formats.thumbnail.url}`
                        : DefaultProfilePic
                    }
                    alt="Profile"
                    className="w-12 h-12 rounded-full cursor-pointer sm:hover:scale-105 transition duration-300 border-4 border-white"
                    onClick={() => dispatch(toggleUIState({ key: 'showProfile' }))}
                  />
                ) : (
                  <p
                    className="bg-white px-4 py-1 rounded-md text-sc-red cursor-pointer sm:hover:scale-105 transition duration-300 text-2xl font-bold"
                    onClick={() => dispatch(toggleUIState({ key: 'showLogin' }))}
                  >
                    Login
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
  
        {showResults && searchResult && (
          <div ref={resultsReference} className="fixed top-0 left-0 w-full h-full z-50">
            <div className="fixed top-0 left-0 w-full h-full" onClick={() => setShowResults(false)} />
            <div className="searchResults relative z-10 bg-white rounded-md shadow-md overflow-y-auto mt-[5.65vh]">
              <ul>
                {searchResult['university-pages']?.map((item) => (
                  <li
                    key={item.id}
                    onClick={() => {
                      navigate(`/universities/${item.id}`);
                      setShowResults(false);
                    }}
                    className="cursor-pointer p-2 hover:bg-gray-200"
                  >
                    {item.universityName}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </>
    );
  }
  
  

export default Menubar;