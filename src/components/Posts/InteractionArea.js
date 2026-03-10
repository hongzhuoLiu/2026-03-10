// InteractionArea.js
import { useEffect, useState, useCallback, useMemo } from 'react';
import { BASE_URL } from "../../API.js";

// Components
import ReviewCard from './ReviewCard.js';
import AdUnitFluid from '../../ads/AdUnitFluid';
import DropDownButton from '../Elements/DropDownButton.js';
import SortingDropdown from '../Elements/SortingDropDown.js';
import HelpfulLinksTable from './HelpfulLinksTable.js';
import DeletePostPopup from './DeletePostPopup';
import RatingAndDistribution from '../RatingAndDistribution/RatingAndDistribution';

// Tailwind
import '../../input.css';

// State & APIs
import { useDispatch, useSelector } from "react-redux";
import { setInteractionName, setSelectedButton, toggleUIState } from "../../app/features/ui/UIReducer.js";
import { useGetAllIconsQuery } from '../../app/service/iconsAPI.js';
import {
  useGetBlogDataQuery,
  useGetQnADataQuery,
  useGetReviewDataQuery,
  useGetHelpfulLinksDataQuery
} from '../../app/service/any-pagesAPI.js';

// ---- helpers ----
const HELPFUL_LINK_ICON_ID = 65;
const SHARE_ICON_ID = 33;
const HELPFUL_LINK_ICON_ID_WHITE = 67;


const safeList = (list) =>
  Array.isArray(list) ? list.filter((x) => x && x.id != null) : [];

function InteractionArea({ interactionName }) {
  console.log(">>> [TEST] InteractionArea is rendering with 4 tabs <<<");

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deletePopupProps, setDeletePopupProps] = useState({});

  const iconIds = {
    reviewSelected: 14,
    reviewDarkMode: 9,
    reviewLightMode: 13,
    commentSelected: 17,
    commentDarkMode: 18,
    commentLightMode: 19,
    FAQSelected: 7,
    FAQDarkMode: 20,
    FAQLightMode: 21,
    plusRed: 22,
    plusWhite: 23,
    helpfulLinksLight: HELPFUL_LINK_ICON_ID,
    helpfulLinksDark: HELPFUL_LINK_ICON_ID,
    helpfulLinksSelected: HELPFUL_LINK_ICON_ID_WHITE,
    shareLight: SHARE_ICON_ID,
    shareDark: SHARE_ICON_ID,
    shareSelected: SHARE_ICON_ID,
  };

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { selectedButton } = useSelector((state) => state.ui);

  const { data: iconsData, isError: isIconsError, isLoading: isIconsLoading } = useGetAllIconsQuery();

  const getIconURL = useCallback((id) => {
    if (!iconsData?.data || isIconsLoading || isIconsError) return '';
    const icon = iconsData.data.find((icon) => icon?.id === id);
    const url = icon?.attributes?.image?.data?.[0]?.attributes?.formats?.thumbnail?.url;
    return url ? `${BASE_URL}${url}` : '';
  }, [iconsData, isIconsLoading, isIconsError]);

  useEffect(() => {
    dispatch(setInteractionName(interactionName));
  }, [dispatch, interactionName]);

  const {
    data: reviewsData,
    isLoading: reviewLoading,
    refetch: reviewRefetch,
  } = useGetReviewDataQuery(interactionName);

  const {
    data: blogsData,
    isLoading: blogsLoading,
    refetch: blogsRefetch,
  } = useGetBlogDataQuery(interactionName);

  const {
    data: qnasData,
    isLoading: qnasLoading,
    refetch: qnasRefetch,
  } = useGetQnADataQuery(interactionName);

  const {
    data: helpfulData,
    isLoading: helpfulLoading,
    isError: helpfulError,
    refetch: helpfulRefetch,
  } = useGetHelpfulLinksDataQuery(interactionName);

  useEffect(() => {
    reviewRefetch();
    blogsRefetch();
    qnasRefetch();
    helpfulRefetch();
  }, [reviewRefetch, blogsRefetch, qnasRefetch, helpfulRefetch]);

  const handleButtonClick = (id) => {
    dispatch(setSelectedButton(id));
  };

  const formatDate = useCallback((isoDate) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
  }, []);

  const [selectedStarFilters, setSelectedStarFilters] = useState([1, 2, 3, 4, 5]);
  const [sortOrder, setSortOrder] = useState('latest');

  const sortOptions = [
    { value: 'latest', label: 'Latest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'highest', label: 'Highest rating' },
    { value: 'lowest', label: 'Lowest rating' },
    { value: 'mostLiked', label: 'Most liked' },
  ];


  const getReviewStats = useCallback(() => {
    const reviewsArr = safeList(reviewsData?.data?.attributes?.reviews?.data);
    const count = reviewsArr.length;
    if (count === 0) {
      return {
        averageScore: "No Reviews",
        ratingData: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        count: 0,
      };
    }
    const sum = reviewsArr.reduce((acc, r) => acc + (r?.attributes?.reviewRating ?? 0), 0);
    const averageScore = (sum / count).toFixed(1);

    const ratingData = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewsArr.forEach((r) => {
      const rating = r?.attributes?.reviewRating;
      if (ratingData[rating] !== undefined) ratingData[rating]++;
    });
    return { averageScore, ratingData, count };
  }, [reviewsData]);

  const handleStarFilterChange = useCallback((selectedStars) => {
    if (Array.isArray(selectedStars) && selectedStars.length > 0) {
      setSelectedStarFilters(selectedStars);
    }
  }, []);

  
  const filteredReviews = useMemo(() => {
    if (reviewLoading || !reviewsData?.data?.attributes?.reviews?.data) {
      return [];
    }
    
    return reviewsData.data.attributes.reviews.data
      .filter(review => review?.attributes?.reviewRating) // Filter out reviews without valid attributes
      .filter(review => selectedStarFilters.includes(review.attributes.reviewRating));
  }, [reviewLoading, reviewsData, selectedStarFilters]);

  function getLatestCommentTime(post) {
    const comments = safeList(post?.attributes?.comments?.data);
    if (comments.length === 0) return new Date(post?.attributes?.createdAt);
    const latestComment = comments.reduce((latest, curr) => {
      const currDate = new Date(curr?.attributes?.createdAt);
      return currDate > latest ? currDate : latest;
    }, new Date(post?.attributes?.createdAt));
    return latestComment;
  }

  // check if we have any reviews for this area
    const reviewContent = useMemo(() => {
      if (reviewLoading) {
        return <p className="text-center text-2xl">Loading data...</p>;
      }
      
      // For facilities and destination pages, data structure is different
      let reviews = [];
      if (interactionName.startsWith('facilities/') || interactionName.startsWith('destination-pages/')) {
        reviews = reviewsData?.data || [];
      } else {
        reviews = filteredReviews;
      }
      
      if (reviews.length === 0) {
        return (
          <div>
            <p className="text-gray-500 text-center text-2xl">
              {selectedStarFilters.length === 0 
                ? "Please select at least one star rating to see reviews." 
                : "There are no reviews to show here. Be the first to post!"}
            </p>
          </div>
        );
      }
      
      // 对已经过滤的评论应用排序
      const rendered = [...reviews]
        .filter(review => review?.attributes) // Filter out reviews without attributes
        .sort((a, b) => {
          if (!a?.attributes || !b?.attributes) return 0;
          
          switch (sortOrder) {
            case 'latest':
              return getLatestCommentTime(b) - getLatestCommentTime(a);
            case 'oldest':
              return new Date(a.attributes.createdAt || 0) - new Date(b.attributes.createdAt || 0);
            case 'highest':
              return (b.attributes.reviewRating || 0) - (a.attributes.reviewRating || 0);
            case 'lowest':
              return (a.attributes.reviewRating || 0) - (b.attributes.reviewRating || 0);
            case 'mostLiked':
              return (b.attributes.review_likes?.data?.length || 0) - (a.attributes.review_likes?.data?.length || 0);
            default: // 默认按最新排序
              return getLatestCommentTime(b) - getLatestCommentTime(a);
          }
        })
        .map((review) => {
          // Skip reviews with missing required data
          if (!review?.attributes?.users_permissions_user?.data?.attributes) {
            return null;
          }
          
          return (
            <ReviewCard
              key={review.id}
              id={review.id}
              name={review.attributes.users_permissions_user.data.attributes.username || 'Anonymous'}
              avatar={review.attributes.users_permissions_user.data.attributes.avatar?.data 
                ? review.attributes.users_permissions_user.data.attributes.avatar.data.attributes.formats.thumbnail 
                : null}
              like={review.attributes.review_likes?.data || []}
              dislike={review.attributes.review_dislikes?.data || []}
              desc={review.attributes.reviewText || ''}
              posttime={formatDate(review.attributes.createdAt)}
              rating={review.attributes.reviewRating || 0}
              replies={review.attributes.comments || []}
              isCurrentUser={review.attributes.users_permissions_user.data.id === user?.id}
              onRefresh={() => {
                reviewRefetch();
                blogsRefetch();
                qnasRefetch();
                helpfulRefetch();
              }}
              onShowDeletePopup={({ postId, postType }) => {
                setDeletePopupProps({
                  postId,
                  postType,
                });
                setShowDeletePopup(true);
              }}
            />
          );
        })
        .filter(Boolean); /* Remove null entries */

      // Insert ads after every 4 posts
      const withAds = [];
      rendered.forEach((item, idx) => {
        withAds.push(item);
        if ((idx + 1) % 4 === 0) {
          withAds.push(
                <div key={`ad-review-${idx}`} className="w-full sm:w-11/12">
                  <AdUnitFluid />
                </div>
              );
        }
      });

      return (
        <div className="flex flex-col justify-evenly items-center">
          {withAds.length > 0 ? withAds : (
            <div>
              <p className="text-gray-500 text-center text-2xl">There are no reviews to show here. Be the first to post!</p>
              <div className="mt-4"><AdUnitFluid /></div>
            </div>
          )}
        </div>
      );
    }, [reviewLoading, filteredReviews, sortOrder, formatDate, selectedStarFilters, interactionName, reviewsData]);

  const blogContent = blogsLoading ? (
    <p className="text-center text-2xl">Loading data...</p>
  ) : (() => {
    // For facilities and destination pages, data structure is different
    let blogs = [];
    if (interactionName.startsWith('facilities/') || interactionName.startsWith('destination-pages/')) {
      blogs = blogsData?.data || [];
    } else {
      blogs = blogsData?.data?.attributes?.blogs?.data || [];
    }
    
    const renderedBlogs = [...blogs]
      .filter(blog => blog?.attributes)
      .sort((a, b) => {
        if (!a?.attributes || !b?.attributes) return 0;
        return getLatestCommentTime(b) - getLatestCommentTime(a);
      })
      .map((blog) => {
        if (!blog?.attributes?.users_permissions_user?.data?.attributes) return null;
        return (
          <ReviewCard
            key={blog.id}
            id={blog.id}
            name={blog.attributes.users_permissions_user.data.attributes.username || 'Anonymous'}
            avatar={
              blog.attributes.users_permissions_user.data.attributes.avatar?.data
                ? blog.attributes.users_permissions_user.data.attributes.avatar.data.attributes.formats.thumbnail
                : null
            }
            like={blog.attributes.blog_likes?.data || []}
            dislike={blog.attributes.blog_dislikes?.data || []}
            desc={blog.attributes.blogText || ''}
            posttime={formatDate(blog.attributes.createdAt)}
            replies={blog.attributes.comments || []}
            isCurrentUser={blog.attributes.users_permissions_user.data.id === user?.id}
            onRefresh={() => {
              reviewRefetch();
              blogsRefetch();
              qnasRefetch();
              helpfulRefetch();
            }}
            onShowDeletePopup={({ postId, postType }) => {
              setDeletePopupProps({ postId, postType });
              setShowDeletePopup(true);
            }}
          />
        );
      })
      .filter(Boolean);

    const withAdsBlogs = [];
    renderedBlogs.forEach((item, idx) => {
      withAdsBlogs.push(item);
      if ((idx + 1) % 4 === 0) {
        withAdsBlogs.push(
          <div key={`ad-blog-${idx}`} className="w-full sm:w-11/12">
            <AdUnitFluid />
          </div>
        );
      }
    });

    return withAdsBlogs.length > 0 ? (
      <div className="flex flex-col justify-evenly items-center">{withAdsBlogs}</div>
    ) : (
      <div>
        <p className="text-gray-500 text-center text-2xl">There are no blogs to show here. Be the first to post!</p>
        <div className="mt-4"><AdUnitFluid /></div>
      </div>
    );
  })();

  // QnA 
  const qnasArr = safeList(qnasData?.data?.attributes?.qnas?.data);
  const qnaContent = qnasLoading ? (
    <p className="text-center text-2xl">Loading data...</p>
  ) : (() => {
    // For facilities and destination pages, data structure is different
    let qnas = [];
    if (interactionName.startsWith('facilities/') || interactionName.startsWith('destination-pages/')) {
      qnas = qnasData?.data || [];
    } else {
      qnas = qnasData?.data?.attributes?.qnas?.data || [];
    }
    
    const renderedQnas = [...qnas]
      .filter(qna => qna?.attributes)
      .sort((a, b) => {
        if (!a?.attributes || !b?.attributes) return 0;
        return getLatestCommentTime(b) - getLatestCommentTime(a);
      })
      .map((qna) => {
        if (!qna?.attributes?.users_permissions_user?.data?.attributes) return null;
        return (
          <ReviewCard
            key={qna.id}
            id={qna.id}
            name={qna.attributes.users_permissions_user.data.attributes.username || 'Anonymous'}
            avatar={
              qna.attributes.users_permissions_user.data.attributes.avatar?.data
                ? qna.attributes.users_permissions_user.data.attributes.avatar.data.attributes.formats.thumbnail
                : null
            }
            like={qna.attributes.qna_likes?.data || []}
            dislike={qna.attributes.qna_dislikes?.data || []}
            desc={qna.attributes.qnaText || ''}
            posttime={formatDate(qna.attributes.createdAt)}
            replies={qna.attributes.comments || []}
            isCurrentUser={qna.attributes.users_permissions_user.data.id === user?.id}
            onRefresh={() => {
              reviewRefetch();
              blogsRefetch();
              qnasRefetch();
              helpfulRefetch();
            }}
            onShowDeletePopup={({ postId, postType }) => {
              setDeletePopupProps({ postId, postType });
              setShowDeletePopup(true);
            }}
          />
        );
      })
      .filter(Boolean);

    const withAdsQnas = [];
    renderedQnas.forEach((item, idx) => {
      withAdsQnas.push(item);
      if ((idx + 1) % 4 === 0) {
        withAdsQnas.push(
          <div key={`ad-qna-${idx}`} className="w-full sm:w-11/12">
            <AdUnitFluid />
          </div>
        );
      }
    });

    return withAdsQnas.length > 0 ? (
      <div className="flex flex-col justify-evenly items-center">{withAdsQnas}</div>
    ) : (
      <div>
        <p className="text-gray-500 text-center text-2xl">There are no questions to show here. Be the first to ask a question!</p>
        <div className="mt-4"><AdUnitFluid /></div>
      </div>
    );
  })();

  // Helpful Links
  const helpfulLinksArr = safeList(helpfulData?.data?.attributes?.helpfulLinks?.data);
  const helpfulLinksContent = helpfulLoading ? (
    <p className="text-center text-2xl">Loading helpful links...</p>
  ) : helpfulError ? (
    <p className="text-center text-2xl text-red-500">Failed to load helpful links!</p>
  ) : (() => {
    // For destination pages, data structure is different
    if (interactionName.startsWith('destination-pages/')) {
      const links = helpfulData?.data || [];
      return links.length > 0 ? (
        <HelpfulLinksTable
          helpfulLinks={links}
          getIconURL={getIconURL}
          shareIconId={iconIds.shareLight}
          onBookmarkChange={(linkId, isBookmarked) => {
            // Additional logic if needed
          }}
        />
      ) : (
        <div>
          <p className="text-gray-500 text-center text-2xl">
            No helpful links yet for this page.
          </p>
        </div>
      );
    }
    
    // For facilities pages, data structure is different
    if (interactionName.startsWith('facilities/')) {
      const links = helpfulData?.data || [];
      return links.length > 0 ? (
        <HelpfulLinksTable
          helpfulLinks={links}
          getIconURL={getIconURL}
          shareIconId={iconIds.shareLight}
          onBookmarkChange={(linkId, isBookmarked) => {
            // Additional logic if needed
          }}
        />
      ) : (
        <div>
          <p className="text-gray-500 text-center text-2xl">
            No helpful links yet for this page.
          </p>
        </div>
      );
    }
    
    // For other pages, use the original logic
    return helpfulData?.data?.attributes?.helpfulLinks?.data && helpfulData.data.attributes.helpfulLinks.data.length > 0 ? (
      <HelpfulLinksTable
        helpfulLinks={helpfulData.data.attributes.helpfulLinks.data}
        getIconURL={getIconURL}
        shareIconId={iconIds.shareLight}
        onBookmarkChange={(linkId, isBookmarked) => {
          // Additional logic if needed
        }}
      />
    ) : (
      <div>
        <p className="text-gray-500 text-center text-2xl">
          No helpful links yet for this page.
        </p>
      </div>
    );
  })();
  
  const { averageScore, ratingData, count } = getReviewStats();

  return (
    <div className="mt-[3%] min-h-[300px] h-auto w-11/12 mx-auto rounded-md sm:p-4">
      <div className="mt-[20px] sm:hidden text-center">
        <DropDownButton onSelection={handleButtonClick} />
      </div>

      <div className="hidden sm:flex flex-wrap justify-around items-center w-full gap-2 mt-4">
        <ActionButton
          id="review"
          image={getIconURL(iconIds.reviewLightMode)}
          darkImage={getIconURL(iconIds.reviewDarkMode)}
          selectedImage={getIconURL(iconIds.reviewSelected)}
          text="Reviews"
          isSelected={selectedButton === 'review'}
          onClick={() => handleButtonClick('review')}
        />
        <ActionButton
          id="blog"
          image={getIconURL(iconIds.commentLightMode)}
          darkImage={getIconURL(iconIds.commentDarkMode)}
          selectedImage={getIconURL(iconIds.commentSelected)}
          text="Blog"
          isSelected={selectedButton === 'blog'}
          onClick={() => handleButtonClick('blog')}
        />
        <ActionButton
          id="qna"
          image={getIconURL(iconIds.FAQLightMode)}
          darkImage={getIconURL(iconIds.FAQDarkMode)}
          selectedImage={getIconURL(iconIds.FAQSelected)}
          text="Ask Questions"
          isSelected={selectedButton === 'qna'}
          onClick={() => handleButtonClick('qna')}
        />
        <ActionButton
          id="helpfulLinks"
          image={getIconURL(iconIds.helpfulLinksLight)}
          darkImage={getIconURL(iconIds.helpfulLinksSelected)}
          selectedImage={getIconURL(iconIds.helpfulLinksSelected)}
          text="Helpful Links"
          isSelected={selectedButton === 'helpfulLinks'}
          onClick={() => handleButtonClick('helpfulLinks')}
        />
      </div>

      <div className="h-[2px] bg-sc-red w-11/12 mx-auto mt-[5%] sm:w-[95%] sm:mt-[2%]" />

      <div
        className="group sm:hover:bg-sc-red bg-white dark:bg-gray-700 flex justify-between items-center w-full
                    ml-auto mr-auto sm:justify-evenly rounded-md sm:w-1/5 mt-3 sm:float-right
                    sm:mr-[4%] shadow-md p-4 sm:p-2 sm:hover:shadow-xl transition duration-300 cursor-pointer"
        onClick={() => {
          user
            ? dispatch(toggleUIState({ key: 'showCreatePost' }))
            : dispatch(toggleUIState({ key: 'showLoginPost' }))
        }}
      >
        <p id="postButton" className="group-hover:text-gray-200 text-rose-900 dark:text-gray-200 font-bold">
          Add Post
        </p>
        {!isIconsLoading && (
          <img
            src={getIconURL(iconIds.plusRed)}
            className="mr-2 w-[20%] sm:w-[25%] self-center h-auto group-hover:hidden dark:hidden transition duration-300"
            alt="Plus Icon"
          />
        )}
        {!isIconsLoading && (
          <img
            src={getIconURL(iconIds.plusWhite)}
            className="mr-2 w-[20%] sm:w-[25%] self-center h-auto hidden group-hover:block dark:block transition duration-300"
            alt="Plus Icon"
          />
        )}
      </div>

      <div id="showDiv" className="mt-[2%] sm:mt-[8%]">
        {selectedButton === 'review' && (
          <>
            {count > 0 && (
              <>
                <div className="relative w-full sm:w-[30%] max-w-full sm:max-w-[30%] min-w-[200px] ml-0 sm:ml-[4%] mt-0 sm:mt-[-7%] mb-5">
                  <RatingAndDistribution
                    averageScore={averageScore}
                    reviewCount={count}
                    ratingData={ratingData}
                    onFilterChange={handleStarFilterChange}
                  />
                </div>
                <div className="flex justify-end mb-4 pr-[4%] items-center gap-2 sm:mt-[-7%] sm:mb-[10%]">
                  <label className='text-sc-red dark:text-gray-200 font-bold'>Sort by:</label>
                  <SortingDropdown
                    options={sortOptions}
                    selectedValue={sortOrder}
                    onChange={(value) => setSortOrder(value)}
                  />
                </div>
              </>
            )}
            {reviewContent}
          </>
        )}
        {selectedButton === 'blog' && blogContent}
        {selectedButton === 'qna' && qnaContent}
        {selectedButton === 'helpfulLinks' && helpfulLinksContent}
      </div>

      {showDeletePopup && (
        <DeletePostPopup
          {...deletePopupProps}
          onDeleted={() => {}}
          onCancel={() => {
            setShowDeletePopup(false);
            reviewRefetch();
            blogsRefetch();
            qnasRefetch();
            helpfulRefetch();
          }}
        />
      )}
    </div>
  );
}

function ActionButton({ id, image, darkImage, selectedImage, text, isSelected, onClick, placeholderText }) {
  const textCol = isSelected ? 'text-white' : 'text-rose-900 dark:text-white';
  const bgColor = isSelected ? 'bg-sc-red' : 'bg-white dark:bg-gray-700';

  // Provide fallback images if the main ones are missing
  const safeImage = image || '';
  const safeDarkImage = darkImage || '';
  const safeSelectedImage = selectedImage || '';

  return (
    <div
      className={`h-14 w-[20%] flex items-center justify-center
        ${bgColor} drop-shadow-md rounded-md px-2 py-2
        ${textCol} transition duration-300 sm:hover:drop-shadow-xl cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-2">
        <h3 className="font-bold text-sm sm:text-base">{text}</h3>
        {placeholderText ? (
          <span className="block dark:block text-xs sm:text-sm">{placeholderText}</span>
        ) : (
          <>
            {safeImage && (
              <img
                src={isSelected ? safeSelectedImage : safeImage}
                className="h-5 w-5 block dark:hidden"
                alt="light icon"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
            {safeDarkImage && (
              <img
                src={isSelected ? safeSelectedImage : safeDarkImage}
                className="h-5 w-5 hidden dark:block"
                alt="dark icon"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default InteractionArea;
