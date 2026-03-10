import React, { useState, useEffect, useRef, useCallback } from "react";
import CountrySelectionStep from "./CountrySelectionStep";
import AdditionalInfoStep from "./AdditionalInfoStep";
import RatingStep from "./RatingStep";
import ThankYouMessage from "./ThankYouMessage";

import {
  useUpdateUserProfileMutation,
  useGetUserDetailsQuery,
  // useUpdateFeedbackQ1Mutation,
  // useUpdateFeedbackQ2Mutation,
  // useUpdateFeedbackQ3Mutation,
} from "../../app/service/usersAPI";

// === Constants ===

// Time the user needs to stay on the site (milliseconds)
const USER_STAY_DURATION_MS = 10 * 60 * 1000; // 10 minutes

// Visit count thresholds for feedback modal
const FEEDBACK_THRESHOLDS = {
  feedbackQ1: [3, 13, 63, 123], // two consecutive prompting opportunities
  feedbackQ2: [13, 23, 33, 73, 103, 143], // two consecutive prompting opportunities
  feedbackQ3: [23, 33, 43, 53, 113, 153], // two consecutive prompting opportunities
};

const countryLookup = {
  Canada: 6,
  "The United States of America": 7,
  "United Kingdom": 8,
  Australia: 9,
  "New Zealand": 10,
};

const FeedbackModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(null);
  // const [answeredSteps, setAnsweredSteps] = useState(null);
  const [answeredSteps, setAnsweredSteps] = useState([]);    // initialize as empty array
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [rating, setRating] = useState(null);
  const [showThankYou, setShowThankYou] = useState(false);
  const [hasStayedTenMinutes, setHasStayedTenMinutes] = useState(false);
  const timerRef = useRef(null);

  // User details variables
  const {
    data: userDetails,
    isLoading: isUserLoading,
    error: userError,
  } = useGetUserDetailsQuery();

  // Feedback update mutation hook
  // const [
  //   updateFeedbackQ1
  // ] = useUpdateFeedbackQ1Mutation();
  // const [
  //   updateFeedbackQ2
  // ] = useUpdateFeedbackQ2Mutation();
  // const [
  //   updateFeedbackQ3
  // ] = useUpdateFeedbackQ3Mutation();

  const [
    updateUserProfile
  ] = useUpdateUserProfileMutation();

  // Get current visit count
  function getVisitCount() {
    return parseInt(localStorage.getItem("visits") || "0", 10);
  }

  // Increment visit count
  const incrementVisitCount = useCallback(() => {
    const currentCount = getVisitCount() + 1;
    localStorage.setItem("visits", currentCount);
    console.log(`User visit count: ${currentCount}`);
    return currentCount;
  }, []);

  useEffect(() => {
    // Only increment when the user is logged in (userDetails exists)
    if (!isUserLoading && userDetails) {
      incrementVisitCount();
    }
  }, [isUserLoading, userDetails, incrementVisitCount]);

  // Load already answered questions from server
  useEffect(() => {
    if (userDetails && !isUserLoading && !userError) {
      const steps = [];
      // Check which feedback questions have been answered
      if (
        userDetails.feedbackQ1 !== undefined &&
        userDetails.feedbackQ1 !== null
      ) {
        steps.push(1);
      }
      if (
        userDetails.feedbackQ2 &&
        Array.isArray(userDetails.feedbackQ2) &&
        userDetails.feedbackQ2.length > 0
      ) {
        steps.push(2);
      }
      if (
        userDetails.feedbackQ3 !== undefined &&
        userDetails.feedbackQ3 !== null
      ) {
        steps.push(3);
      }
      setAnsweredSteps(steps);
      console.log(`Answered question steps: ${steps}`);
    }
  }, [userDetails, isUserLoading, userError]);

  // Detect if the user has stayed for 10 minutes
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setHasStayedTenMinutes(true);
      console.log("User has stayed for 10 minutes");
    }, USER_STAY_DURATION_MS);

    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  // checkAndShowModal function
  // Determines whether to show the modal based on visit count and answered steps
  const checkAndShowModal = useCallback(() => {
    const visits = getVisitCount();
    console.log(`Current visit count: ${visits}, Answered steps: ${answeredSteps}`);

    if (!isOpen && !showThankYou) {
      if (
        FEEDBACK_THRESHOLDS.feedbackQ1.includes(visits) &&
        !answeredSteps.includes(1)
      ) {
        setStep(1); // Step 1: Rating
        setIsOpen(true);
        console.log("Showing step 1: Rating");
      } else if (
        FEEDBACK_THRESHOLDS.feedbackQ2.includes(visits) &&
        !answeredSteps.includes(2)
      ) {
        setStep(2); // Step 2: Country selection
        setIsOpen(true);
        console.log("Showing step 2: Country selection");
      } else if (
        FEEDBACK_THRESHOLDS.feedbackQ3.includes(visits) &&
        !answeredSteps.includes(3)
      ) {
        setStep(3); // Step 3: Text feedback
        setIsOpen(true);
        console.log("Showing step 3: Text feedback");
      }
    }
  }, [answeredSteps, isOpen, showThankYou]);

  // Call checkAndShowModal after the user has stayed 10 minutes and answeredSteps is set
  useEffect(() => {
    if (hasStayedTenMinutes && answeredSteps !== null) {
      checkAndShowModal();
    }
  }, [hasStayedTenMinutes, answeredSteps, checkAndShowModal]);

  const handleClose = () => {
    if (step !== null && !answeredSteps.includes(step)) {
      setAnsweredSteps([...answeredSteps, step]);
    }
    setIsOpen(false);
    setShowThankYou(false);
    setHasStayedTenMinutes(false);
  };

  const handleNext = async () => {
    if (!answeredSteps.includes(step)) {
      const newAnsweredSteps = [...answeredSteps, step];
      setAnsweredSteps(newAnsweredSteps);
      console.log(
        `Completed step ${step}, updated answered steps: ${JSON.stringify(
          newAnsweredSteps
        )}`
      );
    }

    try {
      let updatedUser;

      // Ensure userDetails is loaded
      if (!userDetails) {
        console.error("User details not loaded");
        return;
      }

      if (step === 1) {
        // Update feedbackQ1, preserving other user data
        updatedUser = {
          ...userDetails,
          feedbackQ1: rating,
        };
        await updateUserProfile(updatedUser).unwrap();
        console.log("Feedback Q1 uploaded");
      } else if (step === 2) {
        // Map selectedCountries to their ID array
        const countryIds = selectedCountries
          .map((country) => countryLookup[country])
          .filter(Boolean);
        if (countryIds.length > 0) {
          updatedUser = {
            ...userDetails,
            feedbackQ2: {
              connect: countryIds,
            },
          };
          await updateUserProfile(updatedUser).unwrap();
          console.log("Country association uploaded");
        } else {
          console.error("No matching country ID found");
        }
      } else if (step === 3) {
        // Update feedbackQ3, preserving other user data
        updatedUser = {
          ...userDetails,
          feedbackQ3: additionalInfo,
        };
        await updateUserProfile(updatedUser).unwrap();
        console.log("Feedback Q3 uploaded");
      }
    } catch (error) {
      console.error("Error uploading feedback:", error);
    }

    setShowThankYou(true);

    setTimeout(() => {
      setIsOpen(false);
      setShowThankYou(false);
    }, 2000);
  };

  const handleCountryChange = (country) => {
    setSelectedCountries((prev) =>
      prev.includes(country)
        ? prev.filter((c) => c !== country)
        : [...prev, country]
    );
  };

  const renderStepContent = () => {
    if (showThankYou) {
      return <ThankYouMessage onClose={handleClose} />;
    }

    switch (step) {
      case 1:
        return <RatingStep rating={rating} onRatingChange={setRating} />;
      case 2:
        return (
          <CountrySelectionStep
            selectedCountries={selectedCountries}
            onCountryChange={handleCountryChange}
          />
        );
      case 3:
        return (
          <AdditionalInfoStep
            additionalInfo={additionalInfo}
            onAdditionalInfoChange={setAdditionalInfo}
          />
        );
      default:
        return null;
    }
  };

  const isNextDisabled = () => {
    switch (step) {
      case 1:
        return rating === null;
      case 2:
        return selectedCountries.length === 0;
      case 3:
        return additionalInfo.trim() === "";
      default:
        return true;
    }
  };

  // Do not render if modal is closed and thank you is not showing
  if (!isOpen && !showThankYou) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-lg w-full relative text-center">
        <button
          className="text-3xl  absolute top-2 right-2 text-gray-600 dark:text-white hover:text-gray-800 dark:hover:text-gray-400"
          onClick={handleClose}
        >
          &times;
        </button>
        <div className="text-gray-800 dark:text-white">
          {renderStepContent()}
        </div>
        {!showThankYou && (
          <button
            className={`mt-8 bg-sc-red hover:bg-opacity-90 dark:bg-opacity-80 text-white font-bold py-3 px-8 rounded-full transition-all ${
              isNextDisabled() ? "opacity-50 cursor-not-allowed" : "opacity-100"
            }`}
            onClick={handleNext}
            disabled={isNextDisabled()}
          >
            OK
          </button>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;
