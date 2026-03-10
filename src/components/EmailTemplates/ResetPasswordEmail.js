import React from "react";
import "./EmailTemplate.css";
import emailBanner from "../../images/logos/EmailBanner.png";

const ResetPasswordEmail = ({
  username,
  verificationCode,
  expiryTime,
  isDarkMode = false,
}) => {
  return (
    <div
      className={`email-container ${isDarkMode ? "dark-mode" : "light-mode"}`}
    >
      {/* Header */}
      <div className="email-header">
        <img src={emailBanner} alt="Students Choice" />
      </div>

      {/* Body */}
      <div className="email-body">
        <div className="email-greeting">Hi {username},</div>

        <div className="email-content">
          <p>We received a request to reset your StudentsChoice password.</p>

          <p style={{ marginTop: "20px" }}>Your verification code is:</p>
        </div>

        <div className="verification-code">{verificationCode}</div>

        <div className="email-content">
          <p>If you didn't request this, you can safely ignore this email.</p>
          <p>
            Please enter this code in the password reset page within{" "}
            {expiryTime} for your security.
          </p>
        </div>

        <div className="button-container">
          <a
            href="https://frontend-dev.studentschoice.blog/"
            className="email-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Notification
          </a>
        </div>

        <div className="email-content">
          <p>This message was sent by StudentsChoice Team.</p>
          <p>
            To manage your email preferences, visit your user profile on
            Students Choice
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="email-footer">
        <div className="email-license">
          The contents of this email are confidential and for the intended
          recipient only.
          <br />
          If you have received this email in error, please delete it.
          <br />
          Our liability for information contained in this email is limited in
          accordance with
          <br />
          our commercial agreements with you, and the terms and conditions on
          our
          <br />
          website:{" "}
          <a
            href="https://frontend-dev.studentschoice.blog/"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://frontend-dev.studentschoice.blog/
          </a>
          <br />
          We'll never email you about a change to our bank account details. If
          you receive
          <br />
          an email requesting payment into a different Students Choice bank
          account,
          <br />
          please don't make any payments before contacting us at [email address]
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordEmail;
