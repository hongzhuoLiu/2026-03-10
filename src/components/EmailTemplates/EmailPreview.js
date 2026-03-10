import React, { useState } from "react";
import NotificationEmail from "./NotificationEmail";
import SpecialMessageEmail from "./SpecialMessageEmail";
import ResetPasswordEmail from "./ResetPasswordEmail";

const EmailPreview = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("notification");

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case "notification":
        return (
          <NotificationEmail
            username="John"
            newComments="5"
            newLikes="12"
            isDarkMode={isDarkMode}
          />
        );
      case "special":
        return (
          <SpecialMessageEmail
            username="John"
            messageBody="{{message_body}}"
            isDarkMode={isDarkMode}
          />
        );
      case "reset":
        return (
          <ResetPasswordEmail
            username="John"
            verificationCode="504631"
            expiryTime="{{expiry_time}}"
            isDarkMode={isDarkMode}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        padding: "40px",
        backgroundColor: isDarkMode ? "#0a0a0a" : "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      {/* Control Panel */}
      <div
        style={{
          marginBottom: "30px",
          textAlign: "center",
          backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1
          style={{
            marginBottom: "20px",
            color: isDarkMode ? "#ffffff" : "#000000",
            fontFamily: "Arial, sans-serif",
          }}
        >
          Email Template Preview
        </h1>

        {/* Template Selector */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              marginRight: "15px",
              color: isDarkMode ? "#ffffff" : "#000000",
              fontFamily: "Arial, sans-serif",
              fontWeight: "bold",
            }}
          >
            Select Template:
          </label>
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            style={{
              padding: "8px 15px",
              fontSize: "14px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontFamily: "Arial, sans-serif",
              cursor: "pointer",
            }}
          >
            <option value="notification">Notification Email</option>
            <option value="special">Special Message Email</option>
            <option value="reset">Reset Password Email</option>
          </select>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          style={{
            padding: "10px 30px",
            fontSize: "16px",
            fontWeight: "bold",
            backgroundColor: "#6b1f3b",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontFamily: "Arial, sans-serif",
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#8b2f4b")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#6b1f3b")}
        >
          Switch to {isDarkMode ? "Light" : "Dark"} Mode
        </button>
      </div>

      {/* Email Preview */}
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >
        {renderTemplate()}
      </div>

      {/* Info Panel */}
      <div
        style={{
          maxWidth: "700px",
          margin: "30px auto 0",
          padding: "20px",
          backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff",
          borderRadius: "12px",
          color: isDarkMode ? "#ffffff" : "#000000",
          fontFamily: "Arial, sans-serif",
          fontSize: "14px",
          lineHeight: "1.6",
        }}
      >
        <h3 style={{ marginBottom: "15px" }}>📧 Template Information:</h3>
        <ul style={{ paddingLeft: "20px" }}>
          <li>
            <strong>Font:</strong> Arial (System default)
          </li>
          <li>
            <strong>Body Text:</strong> 12px
          </li>
          <li>
            <strong>Button Text:</strong> 18px, Bold
          </li>
          <li>
            <strong>Title/Greeting:</strong> 12px, Bold
          </li>
          <li>
            <strong>Button Link:</strong>{" "}
            https://frontend-dev.studentschoice.blog/
          </li>
          <li>
            <strong>Supports:</strong> Light & Dark Mode
          </li>
          <li>
            <strong>Responsive:</strong> Mobile-friendly design
          </li>
        </ul>
      </div>
    </div>
  );
};

export default EmailPreview;
