import { Check } from "lucide-react";
import React, { useEffect, useState } from "react";
import { API, AUTH_TOKEN } from "../../API";

/**
 * Report flow for Helpful Link, aligned with EntityReportFlow logic but with tailored UI copy
 */
const HelpfulLinkReportFlow = ({ onClose, helpfulLinkId, userId }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [workflowData, setWorkflowData] = useState({});

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedIssue, setSelectedIssue] = useState("");
  const [details, setDetails] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const isSelectedIssueSomethingElse = (selectedIssue || "").trim().toLowerCase() === "something else";
  const isSelectedCategorySomethingElse = (selectedCategory || "").trim().toLowerCase() === "something else";

  const getSomethingElseTitle = () => {
    return "Link: Something else";
  };

  useEffect(() => {
    const fetchReasons = async () => {
      try {
        const res = await fetch(`${API}/helpful-link-report-reasons`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const rawItems = Array.isArray(data?.data) ? data.data : [];
        const transformed = rawItems.reduce((acc, item) => {
          const attrs = item?.attributes || {};
          const primary = attrs.PrimaryReason;
          const secondary = attrs.SecondaryReason;
          const followUpQuestion = attrs.FollowUpQuestion;
          if (!primary || !secondary) return acc;
          if (!acc[primary]) acc[primary] = {};
          const hasExplicitFollowUp = typeof followUpQuestion === 'string' && followUpQuestion.trim().length > 0;
          let question;
          if (hasExplicitFollowUp) {
            question = followUpQuestion;
          } else if ((secondary || '').trim().toLowerCase() === 'something else') {
            question = `Please provide more details about: ${primary}`;
          } else {
            question = 'Would you like to tell us more?';
          }
          acc[primary][secondary] = {
            question,
            reasonId: item.id,
            hasExplicitFollowUp,
          };
          return acc;
        }, {});
        setWorkflowData(transformed);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load helpful link report reasons:", err);
        setError("Failed to load report options.");
        setLoading(false);
      }
    };
    fetchReasons();
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    if (category.toLowerCase().trim() === "something else") {
      setSelectedIssue("Something else");
      setStep(3);
    } else {
      setStep(2);
    }
  };

  const handleIssueSelect = (issue) => {
    setSelectedIssue(issue);
    setStep(3);
  };

  const handleSubmit = async () => {
    if (!details.trim()) return;
    if (!confirm) return;
    if (!userId || !helpfulLinkId) return;

    let token = localStorage.getItem(AUTH_TOKEN);
    if (!token) {
      token =
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("jwt") ||
        localStorage.getItem("userToken");
    }
    if (!token) {
      alert("Authentication token not found. Please log in again.");
      console.error("No token found in localStorage");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        data: {
          helpfulLink: helpfulLinkId,
          reporter: userId,
          report_reason: workflowData[selectedCategory]?.[selectedIssue]?.reasonId,
          reportTime: new Date().toISOString(),
          primaryCategory: selectedCategory,
          secondaryIssue: selectedIssue,
          report_content: `${selectedIssue}`,
          details,
          additionalDetails,
          status: "pending",
        },
      };

      const res = await fetch(`${API}/helpful-link-reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      setSubmitting(false);
      setStep(4);
    } catch (err) {
      console.error("Report submission failed", err);
      alert("Submission failed. Please try again.");
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setSelectedCategory("");
      setStep(1);
    } else if (step === 3) {
      setSelectedIssue("");
      if ((selectedCategory || '').trim().toLowerCase() === 'something else') {
        setSelectedCategory("");
        setStep(1);
      } else {
        setStep(2);
      }
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
          <p>Loading report options...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <div className="min-h-[400px] flex flex-col min-h-0">
          {step === 1 && (
            <>
              <h2 className="text-xl font-bold mb-4 text-center">What would you like to report about this link?</h2>
              <div className="space-y-3 flex-grow max-h-[60vh] overflow-auto pr-1">
                {Object.keys(workflowData).map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 flex justify-between items-center"
                  >
                    <span className="text-sm">{category}</span>
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-xl font-bold mb-4 text-center">Select the specific issue:</h2>
              <div className="space-y-3 flex-grow max-h-[60vh] overflow-auto pr-1">
                {Object.keys(workflowData[selectedCategory] || {}).map((issue) => (
                  <button
                    key={issue}
                    onClick={() => handleIssueSelect(issue)}
                    className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 flex justify-between items-center"
                  >
                    <span className="text-sm">{issue}</span>
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                ))}
              </div>
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleBack}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Back
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-xl font-bold mb-4 text-center">
                {(isSelectedIssueSomethingElse || isSelectedCategorySomethingElse)
                  ? getSomethingElseTitle()
                  : (workflowData[selectedCategory]?.[selectedIssue]?.question || "Please provide more details")}
              </h2>
              <div className="flex-grow space-y-4">
                <textarea
                  placeholder={(isSelectedIssueSomethingElse || isSelectedCategorySomethingElse)
                    ? "Please share the details here..."
                    : "Please provide the correct information..."}
                  className="w-full border p-3 rounded-lg resize-none"
                  rows={(isSelectedIssueSomethingElse || isSelectedCategorySomethingElse ||
                    (workflowData[selectedCategory]?.[selectedIssue]?.question === 'Would you like to tell us more?')) ? 8 : 3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                />

                {workflowData[selectedCategory]?.[selectedIssue]?.hasExplicitFollowUp && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Would you like to tell us more?
                    </label>
                    <textarea
                      placeholder="Additional details (optional)..."
                      className="w-full border p-3 rounded-lg resize-none"
                      rows={3}
                      value={additionalDetails}
                      onChange={(e) => setAdditionalDetails(e.target.value)}
                    />
                  </div>
                )}

                <div className="flex items-start mb-2">
                  <input
                    type="checkbox"
                    className="mt-[2px] mr-2 accent-[#6B0221]"
                    checked={confirm}
                    onChange={(e) => setConfirm(e.target.checked)}
                  />
                  <label className="text-xs text-justify leading-tight">
                    I confirm my good faith belief that the information and allegations contained in my report are accurate and complete<span className="text-red-500">*</span>
                  </label>
                </div>
              </div>

              <p className="text-red-500 text-center text-sm mb-2">Please confirm that your report is accurate</p>

              <div className="flex justify-center gap-3 mt-6">
                <button
                  onClick={handleBack}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!details.trim() || !confirm || submitting}
                  className={`px-6 py-2 rounded ${details.trim() && confirm ? "bg-[#6B0221] text-white hover:bg-[#8B0221]" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                >
                  {submitting ? "Submitting..." : "Submit Report"}
                </button>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <div className="flex flex-col items-center flex-grow justify-center">
                <div className="bg-green-500 rounded-full p-4 mb-4">
                  <Check size={60} className="text-white" />
                </div>
                <h2 className="text-xl font-bold mb-2 text-center">Thank you for your feedback</h2>
                <p className="text-center text-gray-700 mb-6 text-sm">
                  We take your feedback seriously, and will contact you if more
                  information is needed. Thank you for helping us keep Students
                  Choice safe and respectful.
                </p>
                <button
                  onClick={onClose}
                  className="bg-[#6B0221] text-white px-6 py-2 rounded hover:bg-[#8B0221]"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelpfulLinkReportFlow;


