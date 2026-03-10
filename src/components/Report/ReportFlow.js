import { Check } from "lucide-react";
import React, { useState, useEffect } from "react";
import { API, AUTH_TOKEN, BEARER } from "../../API";

// Unified report flow for review and helpful link
// reportType: 'review' | 'helpfulLink'
const ReportFlow = ({ onClose, reviewId, helpfulLinkId, userId, reportType = 'review' }) => {
    const [step, setStep] = useState(1);
    const [reasons, setReasons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedPrimary, setSelectedPrimary] = useState("");
    const [selectedSecondary, setSelectedSecondary] = useState("");
    const [selectedReasonId, setSelectedReasonId] = useState(null);
    const [details, setDetails] = useState("");
    const [confirm, setConfirm] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const getAuthHeaders = () => {
        const token = localStorage.getItem(AUTH_TOKEN);
        return token ? { Authorization: `${BEARER} ${token}` } : {};
    };

    // Pick endpoints based on reportType
    const getReasonsEndpoint = () => {
        switch (reportType) {
            case 'helpfulLink': return 'helpful-link-report-reasons';
            default: return 'report-reasons';
        }
    };
    const getSubmitEndpoint = () => {
        switch (reportType) {
            case 'helpfulLink': return 'helpful-link-reports';
            default: return 'reports';
        }
    };

    useEffect(() => {
        const fetchReasons = async () => {
            try {
                const res = await fetch(`${API}/${getReasonsEndpoint()}`, {
                    headers: {
                        ...getAuthHeaders(),
                    },
                });
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`);
                }
                const data = await res.json();
                setReasons(Array.isArray(data.data) ? data.data : []);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError("Failed to load report reasons.");
                setLoading(false);
            }
        };
        fetchReasons();
    }, [reportType]);

    // Guard against null/undefined reasons
    const safeReasons = Array.isArray(reasons) ? reasons : [];
    const groupedReasons = safeReasons.reduce((acc, item) => {
        const attrs = item?.attributes || {};
        const primary = attrs.PrimaryReason || attrs.primaryReason || attrs.primaryreason || attrs.primary || attrs.primary_reason;
        const secondary = attrs.SecondaryReason || attrs.secondaryReason || attrs.secondaryreason || attrs.secondary || attrs.secondary_reason;
        if (!primary || !secondary) {
            return acc;
        }
        if (!acc[primary]) acc[primary] = [];
        acc[primary].push({
            id: item.id,
            secondary,
        });
        return acc;
    }, {});

    const handlePrimarySelect = (primary) => {
        setSelectedPrimary(primary);
        setStep(2);
    };

    const handleSecondarySelect = (secondary, id) => {
        setSelectedSecondary(secondary);
        setSelectedReasonId(id);
        setStep(3);
    };

    const handleSubmit = async () => {
        if (!confirm || !selectedReasonId || !userId) return;

        // Validate required entity id based on report type
        if (reportType === 'review' && !reviewId) return;
        if (reportType === 'helpfulLink' && !helpfulLinkId) return;

        // Build payload
        const payload = {
            reportTime: new Date().toISOString(),
            report_reason: selectedReasonId,
            report_content: details,
            reporter: userId,
        };
        if (reportType === 'review') {
            payload.review = reviewId;
        } else if (reportType === 'helpfulLink') {
            payload.helpfulLink = helpfulLinkId;
        }

        try {
            setSubmitting(true);
            const res = await fetch(`${API}/${getSubmitEndpoint()}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeaders(),
                },
                body: JSON.stringify({
                    data: payload,
                }),
            });
            if (!res.ok) throw new Error("Failed to submit");
            setSubmitting(false);
            setStep(4);
        } catch (err) {
            console.error("Report submission failed", err);
            alert("Submission failed. Please try again.");
            setSubmitting(false);
        }
    };

    const handleBackgroundClick = (e) => {
        if (e.target.id === "modal-background") {
            onClose();
        }
    };

    const handleBack = () => {
        if (step === 2) {
            setSelectedPrimary("");
            setStep(1);
        } else if (step === 3) {
            setSelectedSecondary("");
            setSelectedReasonId(null);
            setStep(2);
        }
    };

    return (
        <div
            id="modal-background"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={handleBackgroundClick}
        >
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                >
                    ✕
                </button>

                {loading && <p>Loading reasons...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {!loading && !error && (
                    <div className="min-h-[300px] flex flex-col">
                        {step === 1 && (
                            <>
                                <h2 className="text-xl font-bold mb-4">What's the reason you're reporting this?</h2>
                                <div className="space-y-2 flex-grow">
                                    {Object.keys(groupedReasons).map((primary) => (
                                        <button
                                            key={primary}
                                            onClick={() => handlePrimarySelect(primary)}
                                            className="w-full text-left p-2 border rounded hover:bg-gray-100 flex justify-between items-center"
                                        >
                                            <span>{primary}</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                            </svg>
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <h2 className="text-xl font-bold mb-4">What makes it {selectedPrimary.toLowerCase()}?</h2>
                                <div className="space-y-2 flex-grow">
                                    {(groupedReasons[selectedPrimary] || []).map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => handleSecondarySelect(item.secondary, item.id)}
                                            className="w-full text-left p-2 border rounded hover:bg-gray-100 flex justify-between items-center"
                                        >
                                            <span>{item.secondary}</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                            </svg>
                                        </button>
                                    ))}
                                </div>
                                <div className="flex justify-center">
                                    <button onClick={handleBack} className="mt-4 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 w-[100px]">Back</button>
                                </div>
                            </>
                        )}

                        {step === 3 && (
                            <>
                                <h2 className="text-xl font-bold mb-4">Report reason: {selectedSecondary}</h2>
                                <div className="flex-grow">
                                    <textarea
                                        placeholder="Would you like to tell us more?"
                                        className="w-full border p-2 rounded mb-4"
                                        rows={4}
                                        value={details}
                                        onChange={(e) => setDetails(e.target.value)}
                                    ></textarea>
                                    <div className="flex items-start mb-4">
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
                                <p className="text-red-500 text-center text-sm mb-4">Please confirm that your report is accurate</p>
                                <div className="flex justify-center gap-2">
                                    <button onClick={handleBack} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 w-[100px]">Back</button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={!confirm || submitting}
                                        className={`px-4 py-2 rounded w-[100px] ${confirm ? "bg-[#6B0221] text-white hover:bg-[#8B0221]" : "bg-gray-300 text-gray-500"}`}
                                    >
                                        {submitting ? "Submitting..." : "Report"}
                                    </button>
                                </div>
                            </>
                        )}

                        {step === 4 && (
                            <>
                                <div className="flex flex-col items-center flex-grow justify-center">
                                    <div className="bg-green-500 rounded-full p-4 mb-4">
                                        <Check size={100} className="text-white" />
                                    </div>
                                    <h2 className="text-xl font-bold mb-2">Thank you for your feedback</h2>
                                    <p className="text-center text-gray-700 mb-4 text-sm text-justify">
                                        We take your feedback seriously, and will contact you if more information is needed.
                                        Thank you for helping us keep Students Choice safe and respectful.
                                    </p>
                                    <button
                                        onClick={onClose}
                                        className="bg-[#6B0221] text-white px-4 py-2 rounded hover:bg-[#8B0221]"
                                    >
                                        Close
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportFlow;

