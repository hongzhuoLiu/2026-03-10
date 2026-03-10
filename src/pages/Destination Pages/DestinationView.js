import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from '../../API';
import InteractionArea from '../../components/Posts/InteractionArea';
import { useGetDestinationDetailsQuery } from '../../app/service/destinationsAPI';
import { useGetUserDetailsQuery, useUpdateUserProfileMutation } from '../../app/service/usersAPI';
import { toggleUIState } from '../../app/features/ui/UIReducer';
import { setCredentials } from '../../app/features/authentication/AuthenticationReducer';
import { useGetAllIconsQuery } from '../../app/service/iconsAPI';
import DestinationReportFlow from '../../components/Report/DestinationReportFlow';

import BookmarkDarkIcon from '../../images/icons/bookmark-grey-200.png';
import BookmarkSelectedIcon from '../../images/icons/bookmark-selected.png';
import BookmarkIcon from '../../images/icons/bookmark-black.png';
import BackIconDark from '../../images/icons/ChevronLeftDark.png';
import BackIconLight from '../../images/icons/ChevronLeft.png';
import LocationIcon from '../../images/icons/locationPin.png';
import LinkIcon from '../../images/icons/link.png';

function DestinationView() {
  const { idDestination } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const isLoggedIn = !!user;

  const { data: destination, isLoading } = useGetDestinationDetailsQuery(idDestination);
  const { data: userDetails, refetch: refetchUserDetails } = useGetUserDetailsQuery();
  const [updateUserProfile] = useUpdateUserProfileMutation();

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const iconIds = { dotsBlack: 68, dotsDarkmode: 70 };
  const { data: iconsData, isError: isIconsError, isLoading: isIconsLoading } = useGetAllIconsQuery();
  const getIconURL = (id) => {
    if (!iconsData || !iconsData.data || isIconsLoading || isIconsError) return '';
    const icon = iconsData.data.find((icon) => icon.id === id);
    return icon ? `${BASE_URL}${icon.attributes.image.data[0].attributes.formats.thumbnail.url}` : '';
  };

  useEffect(() => {
    if (isLoggedIn && userDetails?.userDestinationLikes) {
      const liked = userDetails.userDestinationLikes.some((d) => parseInt(d.id) === parseInt(idDestination));
      setIsBookmarked(liked);
    } else {
      setIsBookmarked(false);
    }
  }, [userDetails, idDestination, isLoggedIn]);

  const handleAddBookmark = async () => {
    if (!isLoggedIn) {
      dispatch(toggleUIState({ key: 'showLoginPost' }));
      return;
    }

    const updatedUser = {
      ...userDetails,
      userDestinationLikes: [
        ...(userDetails.userDestinationLikes || []),
        { id: parseInt(idDestination) },
      ],
    };

    setIsBookmarked(true);
    await updateUserProfile(updatedUser).unwrap();
    dispatch(setCredentials(updatedUser));
    await refetchUserDetails();
  };

  const handleRemoveBookmark = async () => {
    if (!isLoggedIn) {
      dispatch(toggleUIState({ key: 'showLoginPost' }));
      return;
    }

    const updatedUser = {
      ...userDetails,
      userDestinationLikes: (userDetails.userDestinationLikes || []).filter(
        (d) => parseInt(d.id) !== parseInt(idDestination)
      ),
    };

    setIsBookmarked(false);
    await updateUserProfile(updatedUser).unwrap();
    dispatch(setCredentials(updatedUser));
    await refetchUserDetails();
  };

  const getImageUrl = (formats) => {
    return formats?.large?.url || formats?.medium?.url || formats?.small?.url || formats?.thumbnail?.url || null;
  };

  // Dynamic SEO injection for Destination detail page
  useEffect(() => {
    if (!destination?.attributes) return;
    
    const dest = destination.attributes;

    const destinationName = dest.destinationName || 'Destination';
    const destinationLocation = dest.destinationLocation || '';
    const destinationRating = dest.destinationRating || 0;
    const ratingDisplay = destinationRating > 0 ? destinationRating.toFixed(1) : '4.5';
    const pageTitle = `${destinationName} | Students Choice | ${ratingDisplay} ⭐`;
    const pageDescription = `Discover ${destinationName}${destinationLocation ? ` in ${destinationLocation}` : ''} as your study abroad destination. Get detailed information, ratings, and reviews from students who have studied there. Find universities, programs, and accommodation options.`;
    const origin = window.location.origin;
    const canonicalUrl = `${origin}/destination/${idDestination}`;

    const setOrCreateMetaByName = (name, content) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    const setOrCreateMetaByProperty = (property, content) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    const setOrCreateLinkCanonical = (href) => {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", href);
    };

    const setJsonLd = (id, json) => {
      let script = document.getElementById(id);
      if (!script) {
        script = document.createElement("script");
        script.id = id;
        script.type = "application/ld+json";
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(json);
    };

    // Title
    document.title = pageTitle;

    // Meta description and robots
    setOrCreateMetaByName("description", pageDescription);
    setOrCreateMetaByName("keywords", `${destinationName}, study abroad, international education, ${destinationLocation}, study destination, university, student reviews`);
    setOrCreateMetaByName("robots", "index,follow");

    // Canonical
    setOrCreateLinkCanonical(canonicalUrl);

    // Open Graph
    setOrCreateMetaByProperty("og:type", "website");
    setOrCreateMetaByProperty("og:site_name", "StudentsChoice");
    setOrCreateMetaByProperty("og:title", pageTitle);
    setOrCreateMetaByProperty("og:description", pageDescription);
    setOrCreateMetaByProperty("og:url", canonicalUrl);
    if (bannerImgUrl) {
      setOrCreateMetaByProperty("og:image", BASE_URL + bannerImgUrl);
    } else {
      setOrCreateMetaByProperty("og:image", `${origin}/og.png`);
    }

    // Twitter
    setOrCreateMetaByName("twitter:card", "summary_large_image");
    setOrCreateMetaByName("twitter:title", pageTitle);
    setOrCreateMetaByName("twitter:description", pageDescription);
    if (bannerImgUrl) {
      setOrCreateMetaByName("twitter:image", BASE_URL + bannerImgUrl);
    } else {
      setOrCreateMetaByName("twitter:image", `${origin}/og.png`);
    }

    // JSON-LD: Place for Destination
    setJsonLd("seo-jsonld-destination", {
      "@context": "https://schema.org",
      "@type": "Place",
      "name": destinationName,
      "description": pageDescription,
      "url": canonicalUrl,
      "isPartOf": {
        "@type": "WebSite",
        "name": "StudentsChoice",
        "url": origin
      }
    });

    return undefined;
  }, [destination, idDestination]);

  if (isLoading || !destination) return <div>Loading...</div>;

  const dest = destination.attributes;
  const bannerImgUrl = getImageUrl(dest.destinationHeaderImage?.data?.attributes?.formats);

  return (
    <div className="relative m-0 bg-white dark:bg-gray-900">
      <div className="h-full flex items-start justify-between mt-2 ml-4 mr-4 mb-4">
        <div className="flex flex-col items-start gap-1 w-full sm:w-4/5">
          <div className="flex items-center gap-x-4">
            <button onClick={() => navigate('/destinations')}>
              <img className="h-[8vh] hidden dark:block" src={BackIconDark} alt="Back icon dark" />
              <img className="h-[7vh] block dark:hidden" src={BackIconLight} alt="Back icon light" />
            </button>
            <h1 className="titleTextPrimary sm:ml-4">Destinations</h1>
          </div>
            <div className="flex items-center mt-4 gap-x-4 sm:ml-12">
            <h1 className="font-bold text-4xl sm:text-4xl 2xl:text-6xl text-gray-600 dark:text-gray-200">
              {dest.destinationName}
            </h1>
            <div className="flex items-center">
              {isLoggedIn && (
                <button
                  onClick={isBookmarked ? handleRemoveBookmark : handleAddBookmark}
                  aria-label={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
                  className="shrink-0 mt-1 sm:mt-0 ml-8"
                >
                  <img
                    src={isBookmarked ? BookmarkSelectedIcon : BookmarkIcon}
                    alt="Bookmark"
                    className="sm:w-11 w-8 sm:h-11 h-8 dark:hidden"
                  />
                  <img
                    src={isBookmarked ? BookmarkSelectedIcon : BookmarkDarkIcon}
                    alt="Bookmark"
                    className="sm:w-11 w-8 sm:h-11 h-8 hidden dark:block"
                  />
                </button>
              )}
              <div className="relative shrink-0 mt-2 sm:mt-1">
                <button
                  onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                  className="p-0  hover:bg-gray-100 rounded-full transition-colors"
                >
                  {!isIconsLoading && !isIconsError && getIconURL(iconIds.dotsBlack) ? (
                    <img src={getIconURL(iconIds.dotsBlack)} className="sm:w-11 w-8 sm:h-11 h-8 dark:hidden" alt="Options" />
                  ) : (
                    <svg className="sm:w-11 w-8 sm:h-11 h-8 text-gray-600 dark:hidden" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                    </svg>
                  )}
                  {!isIconsLoading && !isIconsError && getIconURL(iconIds.dotsDarkmode) ? (
                    <img src={getIconURL(iconIds.dotsDarkmode)} className="sm:w-11 w-8 sm:h-11 h-8 hidden dark:block" alt="Options" />
                  ) : (
                    <svg className="sm:w-11 w-8 sm:h-11 h-8 text-gray-400 hidden dark:block" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                    </svg>
                  )}
                </button>
                {showOptionsMenu && (
                  <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-20 p-2 w-[160px]">
                    <ul className="space-y-2">
                      <li 
                        onClick={() => {
                          if (user) {
                            setShowReportModal(true);
                          } else {
                            dispatch(toggleUIState({ key: 'showLoginPost' }));
                          }
                          setShowOptionsMenu(false);
                        }}
                        className="cursor-pointer hover:bg-gray-100 p-2 rounded text-red-600"
                      >
                        Report listing
                      </li>
                      <li 
                        onClick={() => setShowOptionsMenu(false)}
                        className="cursor-pointer hover:bg-gray-100 p-2 rounded text-black"
                      >
                        Close
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-x-10 mt-4 sm:ml-12">
            <div className="flex items-center">
              <img className="w-7 h-7 mr-2" src={LocationIcon} alt="Location icon" />
              <p className="font-bold text-xl sm:text-2xl 2xl:text-4xl text-gray-500 dark:text-gray-300">
                {dest.destinationLocation}
              </p>
            </div>
            <div className="flex items-center">
              <img className="w-7 h-7 mr-2" src={LinkIcon} alt="Link icon" />
              <a
                href={dest.webpage}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 dark:text-gray-300 underline font-bold text-xl sm:text-2xl 2xl:text-4xl"
              >
                {dest.webpageName}
              </a>
            </div>
          </div>
          <div className="flex items-center sm:hidden mt-4">
            <img className="w-7 h-7 mr-2" src={LocationIcon} alt="Location icon" />
            <p className="font-bold text-xl sm:text-2xl 2xl:text-4xl text-gray-500 dark:text-gray-300">
              {dest.destinationLocation}
            </p>
          </div>
          <div className="flex items-center sm:hidden">
            <img className="w-7 h-7 mr-2" src={LinkIcon} alt="Link icon" />
            <a
              href={dest.webpage}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 dark:text-gray-300 underline font-bold text-xl sm:text-2xl 2xl:text-4xl"
            >
              {dest.webpageName}
            </a>
          </div>
        </div>
      </div>

      <div className="min-h-[300px] w-11/12 mx-auto">
        {bannerImgUrl ? (
          <img
            src={BASE_URL + bannerImgUrl}
            alt="Banner"
            className="w-screen h-[55vh] object-cover rounded-2xl"
          />
        ) : (
          <div className="w-full h-[55vh] bg-gray-300 dark:bg-gray-700 rounded-2xl flex items-center justify-center text-gray-600 dark:text-gray-300">
            No image available
          </div>
        )}
      </div>

      <InteractionArea interactionName={`destination-pages/${idDestination}`} />

      {/* Report Modal */}
      {showReportModal && (
        <DestinationReportFlow
          onClose={() => setShowReportModal(false)}
          destinationId={idDestination}
          userId={user?.id}
        />
      )}
    </div>
  );
}

export default DestinationView;
