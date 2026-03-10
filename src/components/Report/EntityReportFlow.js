/**
 * EntityReportFlow: usage and scope  ；）
 *
 * This component is a generic, reusable reporting flow for ENTITY pages.
 * It is wrapped and used by the following files:
 *   - src/components/Report/UniversityReportFlow.js
 *   - src/components/Report/DestinationReportFlow.js
 *   - src/components/Report/FacilityReportFlow.js
 *   - src/components/Report/SubjectReportFlow.js
 *   - src/components/Report/ProgramReportFlow.js
 *
 * Separate implementations (NOT using EntityReportFlow):
 *   - Review report flow: src/components/Report/ReportFlow.js
 *   - Helpful Link report flow: src/components/Report/HelpfulLinkReportFlow.js
 *
 * Core props to pass when using this component:
 *   - entityKey: 'university' | 'destination' | 'facility' | 'subject' | 'program'
 *   - reasonsEndpoint: list endpoint for report reasons (e.g., 'university-report-reasons')
 *   - submitEndpoint: submit endpoint for reports (e.g., 'university-reports')
 *   - reasonsQuery (optional): server-side filtering query; when provided, client-side type filtering is skipped
 *   - facilityCategory (optional): used by Facility to filter reasons on the client by attributes.facilityCategory/Type
 *   - titles (optional): step titles { step1, step2, thanks }
 *
 * Flow (1 → 4):
 *   1) Choose primary reason
 *   2) Choose secondary reason
 *   3) Provide details and confirm
 *   4) Success
 *
 * Notes:
 *   - Selecting "Something else" adapts headings and placeholders.
 *   - Auth token is read from localStorage with multiple fallbacks; missing token blocks submission.
 *
 * Example:
 *   <EntityReportFlow
 *     onClose={...}
 *     userId={user.id}
 *     entityId={universityId}
 *     entityKey="university"
 *     reasonsEndpoint="university-report-reasons"
 *     submitEndpoint="university-reports"
 *     titles={{ step1: 'What would you like to report?', step2: 'Select the specific issue:', thanks: 'Thank you for your feedback' }}
 *   />
 */
import { Check } from "lucide-react";
import React, { useEffect, useState } from "react";
import { API, AUTH_TOKEN } from "../../API";

/**
 * Generic, reusable report flow for entity types (university/destination/facility/...)
 * Minimal comments to highlight key behaviors and extension points.
 * Props:
 * - onClose: () => void
 * - userId: number
 * - entityId: number|string
 * - entityKey: string           // key for payload: e.g., 'university' | 'destination' | 'facility'
 * - reasonsEndpoint: string     // e.g., 'university-report-reasons'
 * - submitEndpoint: string      // e.g., 'university-reports'
 * - reasonsQuery?: string        // optional server-side filtering (kept for compatibility)
 * - facilityCategory?: string    // optional client-side filtering by attributes.facilityCategory/Type
 * - titles: {
 *     step1: string,            // title for step 1
 *     step2: string,            // title for step 2
 *     thanks: string            // final thanks title
 *   }
 */
const EntityReportFlow = ({
  onClose,
  userId,
  entityId,
  entityKey,
  reasonsEndpoint,
  submitEndpoint,
  titles = {
    step1: "What would you like to report?",
    step2: "Select the specific issue:",
    thanks: "Thank you for your feedback",
  },
  reasonsQuery,
  facilityCategory,
}) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [workflowData, setWorkflowData] = useState({});

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedIssue, setSelectedIssue] = useState("");
  const [correctiveInfo, setCorrectiveInfo] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const isSelectedIssueSomethingElse = (selectedIssue || "").trim().toLowerCase() === "something else";
  const isSelectedCategorySomethingElse = (selectedCategory || "").trim().toLowerCase() === "something else";

  // Helper function to get the appropriate title for "Something else" cases
  const getSomethingElseTitle = () => {
    if (entityKey === "facility" && facilityCategory) {
      return `${facilityCategory}: Something else`;
    } else if (entityKey === "destination") {
      return "Destination: Something else";
    } else if (entityKey === "university") {
      return "University: Something else";
    } else if (entityKey === "subject") {
      return "Subject: Something else";
    } else if (entityKey === "program") {
      return "Program: Something else";
    } else {
      return "Something else";
    }
  };

  useEffect(() => {
    // Load reasons once inputs stable. Supports both server-side and client-side filtering.
    const fetchWorkflowData = async () => {
      try {
        const qs = reasonsQuery ? (reasonsEndpoint.includes('?') ? `&${reasonsQuery}` : `?${reasonsQuery}`) : '';
        const res = await fetch(`${API}/${reasonsEndpoint}${qs}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const rawItems = Array.isArray(data?.data) ? data.data : [];
        // Resolve category with several fallbacks (facilityCategory / Type / type / Category / category)
        const getItemCategory = (it) => {
          const a = it?.attributes || {};
          return (
            a.facilityCategory ??
            a.Type ??
            a.type ??
            a.Category ??
            a.category ??
            ''
          );
        };
        const hasCategoryField = rawItems.some((it) => typeof getItemCategory(it) === 'string' && getItemCategory(it).trim() !== '');
        const normalize = (s) => (s || '')
          .toString()
          .trim()
          .toLowerCase()
          .replace(/&/g, 'and')
          .replace(/[^a-z0-9]+/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        const target = normalize(facilityCategory);
        // If reasonsQuery is provided, assume server-side filtering already applied → skip client-side type filter
        const filtered = (reasonsQuery || !facilityCategory || !hasCategoryField)
          ? rawItems
          : rawItems.filter((it) => normalize(getItemCategory(it)) === target);
        // Normalize reasons → grouped by PrimaryReason, each holds map of secondary → { reasonId, question }
        if (!reasonsQuery && facilityCategory && hasCategoryField && filtered.length === 0) {
          setWorkflowData({});
          setLoading(false);
          return;
        }

        const source = (reasonsQuery ? rawItems : (filtered.length ? filtered : rawItems));
        const transformed = source.reduce((acc, item) => {
          const attrs = item?.attributes || {};
          const primary = attrs.PrimaryReason;
          const secondary = attrs.SecondaryReason;
          const followUpQuestion = attrs.FollowUpQuestion;
          if (!primary || !secondary) return acc;
          if (!acc[primary]) acc[primary] = {};
          const hasExplicitFollowUp = typeof followUpQuestion === 'string' && followUpQuestion.trim().length > 0;
          const isSecondarySomethingElse = (secondary || '').trim().toLowerCase() === 'something else';
          let question;
          if (hasExplicitFollowUp) {
            question = followUpQuestion;
          } else if (isSecondarySomethingElse) {
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
        console.error("Failed to fetch workflow data:", err);
        setError("Failed to load report options.");
        setLoading(false);
      }
    };
    fetchWorkflowData();
  }, [reasonsEndpoint, reasonsQuery, facilityCategory]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    // If primary selection is "Something else", skip step 2 and go directly to step 3
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
    // Block submit if mandatory inputs not satisfied
    if (!correctiveInfo.trim()) return;
    if (!confirm) return;

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
      // Shape payload expected by backend (Strapi-style { data: ... })
      const payload = {
        data: {
          [entityKey]: entityId,
          reporter: userId,
          report_reason: workflowData[selectedCategory]?.[selectedIssue]?.reasonId,
          reportTime: new Date().toISOString(),
          primaryCategory: selectedCategory,
          secondaryIssue: selectedIssue,
          correctiveInfo,
          additionalDetails,
          status: "pending",
          report_content: `${selectedIssue}`,
        },
      };

      const res = await fetch(`${API}/${submitEndpoint}`, {
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
      // If we came from "Something else" primary selection, go back to step 1
      if (isSelectedCategorySomethingElse) {
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
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <div className="min-h-[400px] flex flex-col">
          {step === 1 && (
            <>
              <h2 className="text-xl font-bold mb-4 text-center">{titles.step1}</h2>
              <div className="space-y-3 flex-grow">
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
              <h2 className="text-xl font-bold mb-4 text-center">{titles.step2}</h2>
              <div className="space-y-3 flex-grow">
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
                  : (workflowData[selectedCategory]?.[selectedIssue]?.question ||
                    "Please provide more details")}
              </h2>
              <div className="flex-grow space-y-4">
                <textarea
                  placeholder={(isSelectedIssueSomethingElse || isSelectedCategorySomethingElse) 
                    ? "Please share the details here..."
                    : "Please provide the correct information..."}
                  className="w-full border p-3 rounded-lg resize-none"
                  rows={(isSelectedIssueSomethingElse || isSelectedCategorySomethingElse || (workflowData[selectedCategory]?.[selectedIssue]?.question==='Would you like to tell us more?')) ? 8 : 3}
                  value={correctiveInfo}
                  onChange={(e) => setCorrectiveInfo(e.target.value)}
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

              <div className={`flex justify-center gap-3 ${isSelectedIssueSomethingElse ? 'mt-4' : 'mt-6'}`}>
                <button
                  onClick={handleBack}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!correctiveInfo.trim() || !confirm || submitting}
                  className={`px-6 py-2 rounded ${
                    correctiveInfo.trim() && confirm
                      ? "bg-[#6B0221] text-white hover:bg-[#8B0221]"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
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
                <h2 className="text-xl font-bold mb-2 text-center">{titles.thanks}</h2>
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

export default EntityReportFlow;
