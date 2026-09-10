import { useState, useEffect } from "react";

export default function ReportListingModal({ isOpen, onClose, book }) {
    const [reason, setReason] = useState("");
    const [details, setDetails] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
            // Reset state on close
            setReason("");
            setDetails("");
            setIsSubmitting(false);
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen || !book) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reason) return;
        
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            alert("Report submitted successfully. Thank you for your feedback.");
            onClose();
        }, 1000);
    };

    const isFormValid = reason !== "";

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000 }}>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: "fixed",
                    inset: 0,
                    backgroundColor: "rgba(15, 23, 42, 0.35)",
                    backdropFilter: "blur(4px)",
                    zIndex: 1000,
                    transition: "opacity 0.2s ease",
                }}
            />

            {/* Modal Content Wrapper */}
            <div
                style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "#ffffff",
                    borderRadius: "20px",
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    zIndex: 1001,
                    width: "90%",
                    maxWidth: "480px",
                    boxSizing: "border-box",
                    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* Header (Icon + Title + Subtitle) */}
                <div
                    style={{
                        display: "flex",
                        gap: "14px",
                        padding: "24px 24px 16px 24px",
                        alignItems: "flex-start",
                    }}
                >
                    {/* Soft Warning Icon Container */}
                    <div
                        style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "50%",
                            backgroundColor: "#fff7ed",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                        }}
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#f97316"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                            <line x1="12" y1="9" x2="12" y2="13" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <h2
                            style={{
                                fontSize: "18px",
                                fontWeight: "700",
                                color: "#0f172a",
                                margin: 0,
                                lineHeight: "1.2",
                            }}
                        >
                            Report Listing
                        </h2>
                        <span
                            style={{
                                fontSize: "13px",
                                color: "#64748b",
                                marginTop: "4px",
                            }}
                        >
                            Help us keep Waraq safe for everyone
                        </span>
                    </div>
                </div>

                {/* Form Body */}
                <form
                    onSubmit={handleSubmit}
                    style={{
                        padding: "0 24px 24px 24px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "18px",
                    }}
                >
                    {/* Listing Card */}
                    <div
                        style={{
                            display: "flex",
                            gap: "12px",
                            padding: "12px",
                            backgroundColor: "#f8fafc",
                            borderRadius: "12px",
                            border: "1px solid #f1f5f9",
                            alignItems: "center",
                        }}
                    >
                        <img
                            src={book.coverImage || book.image || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100"}
                            alt={book.title}
                            style={{
                                width: "44px",
                                height: "56px",
                                objectFit: "cover",
                                borderRadius: "6px",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                            }}
                        />
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <span
                                style={{
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    color: "#0f172a",
                                    lineHeight: "1.3",
                                }}
                            >
                                {book.title}
                            </span>
                            <span
                                style={{
                                    fontSize: "12px",
                                    color: "#64748b",
                                    marginTop: "2px",
                                }}
                            >
                                by {book.author || "Unknown"}
                            </span>
                        </div>
                    </div>

                    {/* Reason for reporting */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label
                            style={{
                                fontSize: "13px",
                                fontWeight: "600",
                                color: "#334155",
                            }}
                        >
                            Reason for reporting <span style={{ color: "#ef4444" }}>*</span>
                        </label>
                        <select
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            required
                            style={{
                                padding: "10px 14px",
                                borderRadius: "8px",
                                border: "1px solid #cbd5e1",
                                fontSize: "14px",
                                color: reason ? "#0f172a" : "#94a3b8",
                                backgroundColor: "#ffffff",
                                cursor: "pointer",
                                outline: "none",
                                width: "100%",
                                appearance: "none",
                            }}
                        >
                            <option value="" disabled>Select a reason...</option>
                            <option value="spam">Spam or misleading</option>
                            <option value="inappropriate">Inappropriate content</option>
                            <option value="scam">Scam or fraud</option>
                            <option value="unavailable">Item no longer available</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    {/* Additional details */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label
                            style={{
                                fontSize: "13px",
                                fontWeight: "600",
                                color: "#334155",
                            }}
                        >
                            Additional details
                        </label>
                        <textarea
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            rows={3}
                            placeholder="Please describe the issue in detail to help us investigate..."
                            style={{
                                padding: "10px 14px",
                                borderRadius: "8px",
                                border: "1px solid #cbd5e1",
                                fontSize: "14px",
                                outline: "none",
                                resize: "none",
                                backgroundColor: "#ffffff",
                                color: "#0f172a",
                                width: "100%",
                                boxSizing: "border-box"
                            }}
                        />
                    </div>

                    {/* Note Banner */}
                    <div
                        style={{
                            backgroundColor: "#fffbeb",
                            border: "1px solid #fef3c7",
                            borderRadius: "10px",
                            padding: "10px 14px",
                            fontSize: "12px",
                            color: "#b45309",
                            lineHeight: "1.4",
                        }}
                    >
                        <strong>Note:</strong> False reports may affect your account standing. Reports are reviewed within 24 hours.
                    </div>

                    {/* Actions */}
                    <div
                        style={{
                            display: "flex",
                            gap: "12px",
                            marginTop: "4px",
                        }}
                    >
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                flex: 1,
                                padding: "11px",
                                borderRadius: "8px",
                                border: "1px solid #cbd5e1",
                                backgroundColor: "#ffffff",
                                color: "#475569",
                                fontWeight: "600",
                                fontSize: "14px",
                                cursor: "pointer",
                                transition: "all 0.15s ease",
                                outline: "none",
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!isFormValid || isSubmitting}
                            style={{
                                flex: 1.2,
                                padding: "11px",
                                borderRadius: "8px",
                                border: "none",
                                backgroundColor: !isFormValid || isSubmitting ? "#cbd5e1" : "#f97316",
                                color: "#ffffff",
                                fontWeight: "600",
                                fontSize: "14px",
                                cursor: !isFormValid || isSubmitting ? "not-allowed" : "pointer",
                                transition: "all 0.15s ease",
                                outline: "none",
                            }}
                        >
                            {isSubmitting ? "Submitting..." : "Submit Report"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
