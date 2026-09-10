import React from "react";

export default function ConfirmModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    confirmText = "Confirm", 
    isDestructive = false,
    isProcessing = false
}) {
    if (!isOpen) return null;

    return (
        <div style={{
            position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
            backgroundColor: "rgba(15, 23, 42, 0.4)", display: "flex", alignItems: "center",
            justifyContent: "center", zIndex: 9999, backdropFilter: "blur(4px)",
            padding: "20px"
        }}>
            <div style={{
                background: "#ffffff", borderRadius: "16px", padding: "28px", width: "100%", maxWidth: "420px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0"
            }}>
                <h3 style={{ marginTop: 0, color: "#0f172a", fontSize: "19px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
                    {isDestructive && <span style={{ color: "#ef4444" }}>⚠️</span>}
                    {title}
                </h3>
                <p style={{ color: "#475569", fontSize: "15px", lineHeight: "1.6", margin: "16px 0 28px 0" }}>
                    {message}
                </p>
                <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                    <button 
                        onClick={onClose}
                        disabled={isProcessing}
                        style={{ 
                            padding: "10px 20px", border: "1px solid #cbd5e1", background: "#f8fafc", 
                            borderRadius: "10px", cursor: isProcessing ? "not-allowed" : "pointer", 
                            fontWeight: "600", color: "#334155", fontSize: "14px",
                            opacity: isProcessing ? 0.6 : 1
                        }}
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onConfirm}
                        disabled={isProcessing}
                        style={{ 
                            padding: "10px 20px", border: "none", 
                            background: isDestructive ? "#ef4444" : "#f97316", 
                            color: "#fff", borderRadius: "10px", 
                            cursor: isProcessing ? "not-allowed" : "pointer", 
                            fontWeight: "600", fontSize: "14px",
                            opacity: isProcessing ? 0.6 : 1,
                            boxShadow: isDestructive ? "0 4px 12px rgba(239, 68, 68, 0.2)" : "0 4px 12px rgba(249, 115, 22, 0.2)"
                        }}
                    >
                        {isProcessing ? "Processing..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
