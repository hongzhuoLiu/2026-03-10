import React, { useEffect, useMemo, useState } from "react";
import SCLogoWhite from "../images/logos/SCLogoWhiteBG.png";
import CrossBtnLight from "../images/icons/CrossLight.png";

// Import three functions from the mock API file: send verification code, verify verification code, and reset password.

import {
  sendResetCode,
  verifyResetCode,
  resetPasswordWithCode,
} from "../app/service/passwordResetAPI";

function PasswordReset({ onClose }) {
  // Current step:

// 1 = Enter email/username

// 2 = Enter verification code

// 3 = Enter new password
  const [step, setStep] = useState(1);

  // User-entered email address or username
  const [identifier, setIdentifier] = useState("");

 // User-entered verification code
  const [verificationCode, setVerificationCode] = useState("");

  // New password and confirm password entered by the user
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

 // General status: Loading / Error message / General message
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

 // Record whether the verification code has been successfully verified

 // Step 3 will check it again before submission
  const [isCodeVerified, setIsCodeVerified] = useState(false);

  // ****For development purposes only: Displays mock verification codes; 
  // deletes them after integrating with the backend email service.
  const [mockCodeHint, setMockCodeHint] = useState("");

  // Countdown to "Resend Verification Code" in seconds
  const [cooldown, setCooldown] = useState(0);

  // Disable page background scrolling when the component is displayed, and restore it when closed.
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

 // Resend code countdown logic

// When cooldown > 0, decrease by 1 per second
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  // The input cannot be empty, and it cannot be in the loading state.
  const canSubmitStep1 = useMemo(() => {
    return identifier.trim().length > 0 && !loading;
  }, [identifier, loading]);

  // The verification code must be a 6-digit number and cannot be in the loading state.
  const canSubmitStep2 = useMemo(() => {
    return /^\d{6}$/.test(verificationCode.trim()) && !loading;
  }, [verificationCode, loading]);

 // Both passwords must be at least 6 characters long, and both must match. The current loading screen must not be active.
  const canSubmitStep3 = useMemo(() => {
    return (
      newPassword.length >= 6 &&
      confirmPassword.length >= 6 &&
      newPassword === confirmPassword &&
      !loading
    );
  }, [newPassword, confirmPassword, loading]);

 // Step 1: Send verification code
  const handleStep1Submit = async (e) => {
    e.preventDefault();

    // Clear old notifications
    setError("");
    setMessage("");
    setMockCodeHint("");

    const trimmed = identifier.trim();

    // Basic front-end validation: Cannot be empty
    if (!trimmed) {
      setError("Please enter your username or email.");
      return;
    }

    setLoading(true);

    try {
      // Call the mock API: Send verification code
      const result = await sendResetCode(trimmed);

      setMessage("Verification code sent. Please check your email.");

      // Display mock code during development for easier testing
      // This line can be deleted after integrating with the backend.
      setMockCodeHint(result?.mockCode ? `Mock code: ${result.mockCode}` : "");

      setStep(2);

      // Start a 60-second countdown; you can only resend after the countdown ends.
      setCooldown(60);
    } catch (err) {
      setError(err?.message || "Failed to send verification code.");
    } finally {
      setLoading(false);
    }
  };

  
  const handleVerifyCode = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    const code = verificationCode.trim();

    // Front-end validation: Must be a 6-digit number
    if (!/^\d{6}$/.test(code)) {
      setError("Please enter a valid 6-digit code.");
      return;
    }

    setLoading(true);

    try {
      // Call the mock API: Verify the verification code
      await verifyResetCode(identifier.trim(), code);

     // Mark CAPTCHA verification successful
      setIsCodeVerified(true);

      setMessage("Code verified successfully.");

    
      setStep(3);
    } catch (err) {
      setError(err?.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  // Step3：reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    
    if (!isCodeVerified) {
      setError("Please verify your code first.");
      return;
    }

    
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    
    if (newPassword !== confirmPassword) {
      setError("The two passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // Call the mock API: Simulate a password reset
      await resetPasswordWithCode(
        identifier.trim(),
        verificationCode.trim(),
        newPassword,
        confirmPassword
      );

      setMessage("Password changed successfully. Please sign in again.");

      // Delay closing the pop-up window slightly to allow the user to see the success message.
      setTimeout(() => {
        onClose?.();
      }, 1200);
    } catch (err) {
      setError(err?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Resend the verification code
  const handleResendCode = async () => {
    // Resend is not allowed while the countdown has ended or while loading.
    if (cooldown > 0 || loading) return;

    setError("");
    setMessage("");
    setMockCodeHint("");

    setLoading(true);

    try {
      const result = await sendResetCode(identifier.trim());

      setMessage("A new verification code has been sent.");

      // Showing new mock code during development
      setMockCodeHint(result?.mockCode ? `Mock code: ${result.mockCode}` : "");

     // Resend to restart the 60-second countdown.
      setCooldown(60);
    } catch (err) {
      setError(err?.message || "Failed to resend code.");
    } finally {
      setLoading(false);
    }
  };

  // Step1
  const renderStep1 = () => (
    <form className="w-4/5 m-auto flex-col items-center" onSubmit={handleStep1Submit}>
      <h2 className="inputTitleText mb-4">Enter your email address or username</h2>

      <input
        className="editInputStyling"
        type="text"
        placeholder="Enter your email or username"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        required
      />

      <button
        type="submit"
        className="popUpButtonStyling2 bg-rose-900 mt-6"
        disabled={!canSubmitStep1}
      >
        {loading ? "Sending..." : "Send Code"}
      </button>
    </form>
  );

  // Step2
  const renderStep2 = () => (
    <form className="w-4/5 m-auto flex-col items-center" onSubmit={handleVerifyCode}>
      <h2 className="inputTitleText mb-4">Enter the 6-digit code sent to your email</h2>

      <input
        className="editInputStyling"
        type="text"
        inputMode="numeric"
        placeholder="Enter the code"
        value={verificationCode}
        onChange={(e) => {
         // Only numbers are allowed, with a maximum of 6 digits.
          const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 6);
          setVerificationCode(digitsOnly);
        }}
        maxLength={6}
        required
      />

      <div className="w-full flex justify-between items-center mt-3 px-2">
        <button
          type="button"
          className="text-sm text-sc-red hover:text-red-700 underline disabled:no-underline disabled:text-gray-400"
          onClick={handleResendCode}
          disabled={cooldown > 0 || loading}
        >
          {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
        </button>

        <button
          type="button"
          className="text-sm text-gray-500 underline"
          onClick={() => {
          
            setError("");
            setMessage("");
            setStep(1);
          }}
          disabled={loading}
        >
          Back
        </button>
      </div>

      <button
        type="submit"
        className="popUpButtonStyling2 bg-rose-900 mt-6"
        disabled={!canSubmitStep2}
      >
        {loading ? "Verifying..." : "Verify Code"}
      </button>
    </form>
  );

 
  const renderStep3 = () => (
    <form className="w-4/5 m-auto flex-col items-center" onSubmit={handleResetPassword}>
      <h2 className="inputTitleText">New Password</h2>

      <input
        className="editInputStyling"
        type="password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        minLength={6}
        required
      />

      <h2 className="inputTitleText">Confirm New Password</h2>

      <input
        className="editInputStyling"
        type="password"
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        minLength={6}
        required
      />

      <div className="w-full flex justify-end mt-3 px-2">
        <button
          type="button"
          className="text-sm text-gray-500 underline"
          onClick={() => {
            
            setError("");
            setMessage("");
            setStep(2);
          }}
          disabled={loading}
        >
          Back
        </button>
      </div>

      <button
        type="submit"
        className="popUpButtonStyling2 bg-rose-900 mt-6"
        disabled={!canSubmitStep3}
      >
        {loading ? "Resetting..." : "Reset Password"}
      </button>
    </form>
  );

  return (
    <div className="fixed top-0 left-0 sm:m-0 w-screen h-[100dvh] flex justify-center items-center z-10 bg-black bg-opacity-50 overflow-y-auto">
      <div className="popUpStyling overflow-y-scroll">
        <div className="flex justify-end items-center relative w-full h-[8vh] mt-12 sm:mt-0">
          <img
            src={CrossBtnLight}
            className="h-[50px] ml-3 bg-white dark:bg-gray-600 rounded-md shadow-md sm:hover:shadow-xl transition duration-300 cursor-pointer"
            alt="Cancel button"
            onClick={onClose}
          />
        </div>

        <img src={SCLogoWhite} className="h-1/6" alt="Student's Choice Logo" />

        <h1 className="text-center mb-0 text-2xl font-bold text-sc-red dark:text-gray-300">
          Reset Password
        </h1>

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}

        {/* Bottom message area: Displays errors, prompts, and mock verification codes */}
        <div className="mt-8 text-left pl-2 min-h-[5rem] transition-all duration-200">
          <p
            className={`text-base font-medium transition-opacity duration-200 ${
              error ? "opacity-100 text-red-600" : "opacity-0"
            }`}
          >
            {error || "placeholder"}
          </p>

          <p
            className={`text-sm transition-opacity duration-200 ${
              message ? "opacity-100 text-gray-700 dark:text-gray-300" : "opacity-0"
            }`}
          >
            {message || "placeholder"}
          </p>

          {/* For development purposes only: Displays mock code */}
          {mockCodeHint && (
            <p className="text-sm mt-2 text-blue-600 dark:text-blue-400 font-medium">
              {mockCodeHint}
            </p>
          )}
        </div>

        <br />
      </div>
    </div>
  );
}

export default PasswordReset;