import { useEffect } from "react";

export default function ReportListingModal({ isOpen, onClose, book }) {
    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen || !book) return null;

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
                <div
                    style={{
                        padding: "0 24px 24px 24px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "18px",
                    }}
                >
                    {/* Listing Card (Task 1) */}
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

                    {/* Reason for reporting (Task 2 Stub) */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label
                            style={{
                                fontSize: "13px",
                                fontWeight: "600",
                                color: "#334155",
                            }}
                        >
                            Reason for reporting
                        </label>
                        <div
                            style={{
                                padding: "10px 14px",
                                borderRadius: "8px",
                                border: "1px solid #cbd5e1",
                                fontSize: "14px",
                                color: "#94a3b8",
                                backgroundColor: "#ffffff",
                                cursor: "pointer",
                                userSelect: "none",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <span>Select a reason...</span>
                            <span style={{ fontSize: "10px", color: "#64748b" }}>▼</span>
                        </div>
                    </div>

                    {/* Additional details (Task 3 Stub) */}
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
                            rows={3}
                            disabled
                            placeholder="Please describe the issue in detail to help us investigate..."
                            style={{
                                padding: "10px 14px",
                                borderRadius: "8px",
                                border: "1px solid #e2e8f0",
                                fontSize: "14px",
                                outline: "none",
                                resize: "none",
                                backgroundColor: "#f8fafc",
                                color: "#94a3b8",
                            }}
                        />
                    </div>

                    {/* Note Banner (Task 3 Stub) */}
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

                    {/* Actions (Task 4 Stub) */}
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
                                backgroundColor: "#f8fafc",
                                color: "#475569",
                                fontWeight: "600",
                                fontSize: "14px",
                                cursor: "pointer",
                                transition: "all 0.15s ease",
                                outline: "none",
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f1f5f9")}
                            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f8fafc")}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            disabled
                            style={{
                                flex: 1.2,
                                padding: "11px",
                                borderRadius: "8px",
                                border: "none",
                                backgroundColor: "#cbd5e1",
                                color: "#ffffff",
                                fontWeight: "600",
                                fontSize: "14px",
                                cursor: "not-allowed",
                                transition: "all 0.15s ease",
                                outline: "none",
                            }}
                        >
                            Submit Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
