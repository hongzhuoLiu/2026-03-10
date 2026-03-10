import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import PlusIcon from '../../images/icons/plus-circle.png'; 
import PinIcon from '../../images/icons/thumbtack.png';
import PinIconFilled from '../../images/icons/thumbtack-filled.png'; 

import { useDispatch, useSelector } from 'react-redux';
import { toggleUIState } from '../../app/features/ui/UIReducer';

const SecondMenubar = ({ isMobile = false, onMobileLinkClick = null }) => {
  const dispatch = useDispatch();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [showMobileView, setShowMobileView] = useState(false);
  
  const { showCreatePost, showProfile, showEditProfile, showNotificationSettings } = useSelector((state) => state.ui);

  // Track previous state before profile was shown
  const previousStateRef = useRef({ isOpen: false, isPinned: false });

  const plusButtonRef = useRef(null);
  const menuRef = useRef(null);
  
  const closeTimeoutRef = useRef(null);

  const categories = [
    { name: 'Destinations', path: '/destinations' },
    { name: 'Accommodation', path: '/accommodation' },
    { name: 'Health', path: '/health' },
    { name: 'Fitness', path: '/fitness' },
    { name: 'Eateries', path: '/eateries' },
    { name: 'Clubs & Societies', path: '/clubs-societies' },
    { name: 'Culture & Religion', path: '/culture-religion' },
  ];
  
  // Handle profile visibility changes
  useEffect(() => {
    if (showCreatePost || showProfile || showEditProfile || showNotificationSettings) {
      // Store current state before closing
      previousStateRef.current = { isOpen, isPinned };
      setIsOpen(false);
    } else if (previousStateRef.current.isPinned) {
      // Restore menu if it was pinned before profile was shown
      setIsOpen(true);
    }
  }, [showCreatePost, showProfile, showEditProfile, showNotificationSettings, isOpen, isPinned]);

  useEffect(() => {
    if (!isMobile) {
      dispatch(toggleUIState({ key: 'secondMenubarOpen', value: isOpen }));
      
      // Add padding to the main content wrapper when menu is open
      const contentElement = document.getElementById('main-content-wrapper');
      if (contentElement) {
        const menuHeight = menuRef.current?.clientHeight || 0;
        if (isOpen) {
          contentElement.style.paddingTop = `calc(3vh + ${menuHeight}px)`;
          contentElement.style.transition = 'padding-top 0.3s ease';
        } else {
          contentElement.style.paddingTop = '3vh';
        }
      }
    }
  }, [isOpen, dispatch, isMobile]);
  
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const togglePin = () => {
    if (!isMobile) {
      const newPinnedState = !isPinned;
      setIsPinned(newPinnedState);
      
      // Update the reference with new pin state
      previousStateRef.current = { 
        ...previousStateRef.current, 
        isPinned: newPinnedState 
      };
      
      if (!newPinnedState && !showCreatePost && !showProfile && !showEditProfile && !showNotificationSettings) {
        // If unpinning and no profile is shown, keep menu open temporarily
        setIsOpen(true);
      }
    }
  };

  const handleMouseEnter = () => {
    if (!isMobile && !showProfile && !showEditProfile && !showNotificationSettings) {
      // Clear any pending close timeout
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile && !isPinned) {
      closeTimeoutRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 300); 
    }
  };
  
  const handleMenuEnter = handleMouseEnter;
  const handleMenuLeave = handleMouseLeave;

  const toggleMobileCategories = () => {
    setShowMobileView(!showMobileView);
  };

  const handleMobileLinkClick = () => {
    if (onMobileLinkClick) {
      onMobileLinkClick();
    }
    setShowMobileView(false);
  };

  // Render for Mobile View
  if (isMobile) {
    return (
      <>
        {/* Mobile Second Menu Toggle Button */}
        <div className="flex items-center justify-end mb-3 mr-4 cursor-pointer" onClick={toggleMobileCategories}>
          <img 
            src={PlusIcon} 
            alt="Categories" 
            className="invert h-8 w-8 ml-2"
          />
        </div>
        
        {/* Mobile Second Menu Dropdown */}
        <div 
          className={`w-full flex flex-col items-end transition-all duration-300 ease-in-out overflow-hidden ${
            showMobileView ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {categories.map((category, index) => (
            <Link
              key={index}
              to={category.path}
              style={{ textDecoration: 'none' }}
              onClick={handleMobileLinkClick}
              className="w-full flex justify-end"
            >
              <p className="text-white text-2xl mb-3 mr-5 font-bold">
                {category.name}
              </p>
            </Link>
          ))}
        </div>
      </>
    );
  }

  // Render for Desktop View
  return (
    <>
      {/* Plus button trigger in main navigation */}
      <div 
        ref={plusButtonRef}
        className="h-full flex items-center justify-center px-3 cursor-pointer"
        onClick={() => {
          if (!showProfile && !showEditProfile && !showNotificationSettings) {
            setIsOpen(!isOpen);
          }
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img src={PlusIcon} alt="Categories" className="invert h-8 w-8" />
      </div>

      {/* Second Menubar - Only show if no profile is displayed or menu is pinned */}
      {isOpen && !(showProfile || showEditProfile || showNotificationSettings) && (
        <div
          ref={menuRef}
          className="fixed left-0 right-0 bg-gray-600 text-white shadow-md z-50 transition-all duration-300"
          style={{ top: '7vh' }} 
          onMouseEnter={handleMenuEnter}
          onMouseLeave={handleMenuLeave}
        >
          <div className="container-fluid mx-auto">
            <div className="flex justify-between items-center">
              <nav className="flex flex-wrap">
                {categories.map((category, index) => (
                  <Link
                    key={index}
                    to={category.path}
                    className="px-4 py-3 hover:bg-gray-600 transition-colors duration-200 text-white no-underline block group"
                  >
                    <span className="text-white text-xl font-extrabold transition-transform duration-200 group-hover:scale-110 inline-block">
                      {category.name}
                    </span>
                  </Link>
                ))}
              </nav>
              <div className="flex items-center pr-4">
                <button
                  onClick={togglePin}
                  className="p-2 rounded-full hover:bg-gray-600 transition-colors duration-200"
                  aria-label={isPinned ? "Unpin menu" : "Pin menu"}
                >
                  {/* Use different pin icon based on pin state */}
                  <img 
                    src={isPinned ? PinIconFilled : PinIcon} 
                    alt="Pin"
                    className="h-5 w-5 invert" 
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SecondMenubar;