import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";

export default function AddBookModal({ isOpen, onClose, onBookAdded }) {
    const { token } = useAuth();

    const [form, setForm] = useState({
        image: "",
        listingType: "for_sale", // "for_sale" | "for_sale_and_exchange"
        title: "",
        author: "",
        category: "academic", // "academic" | "general"
        universityId: "",
        facultyId: "",
        majorId: "",
        subType: "book", // "book" | "novel"
        price: "",
        exchangeFor: "",
        condition: "good", // "new" | "good" | "fair"
        description: "",
    });

    const [universities, setUniversities] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [majors, setMajors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [generalError, setGeneralError] = useState("");

    // 1. Fetch universities on modal open
    useEffect(() => {
        if (!isOpen) return;

        let isMounted = true;
        fetch("http://localhost:8080/api/universities")
            .then((res) => (res.ok ? res.json() : []))
            .then((data) => {
                if (isMounted) setUniversities(Array.isArray(data) ? data : []);
            })
            .catch((err) => console.error("Error loading universities:", err));

        return () => {
            isMounted = false;
        };
    }, [isOpen]);

    // 2. Fetch faculties on university change
    useEffect(() => {
        if (!form.universityId) return;

        let isMounted = true;
        fetch(`http://localhost:8080/api/faculties?university_id=${form.universityId}`)
            .then((res) => (res.ok ? res.json() : []))
            .then((data) => {
                if (isMounted) setFaculties(Array.isArray(data) ? data : []);
            })
            .catch((err) => console.error("Error loading faculties:", err));

        return () => {
            isMounted = false;
        };
    }, [form.universityId]);

    // 3. Fetch majors on faculty change
    useEffect(() => {
        if (!form.facultyId) return;

        let isMounted = true;
        fetch(`http://localhost:8080/api/majors?faculty_id=${form.facultyId}`)
            .then((res) => (res.ok ? res.json() : []))
            .then((data) => {
                if (isMounted) setMajors(Array.isArray(data) ? data : []);
            })
            .catch((err) => console.error("Error loading majors:", err));

        return () => {
            isMounted = false;
        };
    }, [form.facultyId]);

    // Handle input & reset cascading branches
    const handleChange = (field, value) => {
        setForm((prev) => {
            const next = { ...prev, [field]: value };

            if (field === "universityId") {
                next.facultyId = "";
                next.majorId = "";
                setFaculties([]);
                setMajors([]);
            } else if (field === "facultyId") {
                next.majorId = "";
                setMajors([]);
            } else if (field === "category" && value === "general") {
                next.universityId = "";
                next.facultyId = "";
                next.majorId = "";
            } else if (field === "listingType" && value === "for_sale") {
                next.exchangeFor = "";
            }

            return next;
        });

        // Clear inline error on field change
        if (fieldErrors[field]) {
            setFieldErrors((prev) => {
                const updated = { ...prev };
                delete updated[field];
                return updated;
            });
        }
        setGeneralError("");
    };

    // Real-time button validation
    const isFormValid = useMemo(() => {
        if (!form.image.trim()) return false;
        if (!form.title.trim()) return false;
        if (!form.description.trim()) return false;
        if (!form.condition) return false;
        if (!form.listingType) return false;

        const numPrice = parseFloat(form.price);
        if (isNaN(numPrice) || numPrice <= 0) return false;

        if (form.listingType === "for_sale_and_exchange" && !form.exchangeFor.trim()) {
            return false;
        }

        if (form.category === "academic") {
            if (!form.universityId || !form.facultyId || !form.majorId) {
                return false;
            }
        } else if (form.category === "general") {
            if (!form.subType) return false;
        } else {
            return false;
        }

        return true;
    }, [form]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid || loading) return;

        setLoading(true);
        setFieldErrors({});
        setGeneralError("");

        const payload = {
            image: form.image.trim(),
            listing_type: form.listingType,
            title: form.title.trim(),
            author: form.author.trim() ? form.author.trim() : null,
            category: form.category,
            university_id: form.category === "academic" ? Number(form.universityId) : null,
            faculty_id: form.category === "academic" ? Number(form.facultyId) : null,
            major_id: form.category === "academic" ? Number(form.majorId) : null,
            sub_type: form.category === "general" ? form.subType : null,
            price: parseFloat(form.price),
            exchange_for: form.listingType === "for_sale_and_exchange" ? form.exchangeFor.trim() : null,
            condition: form.condition,
            description: form.description.trim(),
        };

        try {
            const response = await fetch("http://localhost:8080/listings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                if (data.errors && typeof data.errors === "object") {
                    setFieldErrors(data.errors);
                } else {
                    setGeneralError(data.error || data.message || "Failed to publish listing.");
                }
                return;
            }

            if (onBookAdded) onBookAdded();
            onClose();
        } catch (err) {
            setGeneralError(err.message || "Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000 }}>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: "fixed",
                    inset: 0,
                    backgroundColor: "rgba(15, 23, 42, 0.45)",
                    backdropFilter: "blur(4px)",
                    zIndex: 1000,
                }}
            />

            {/* Modal Container */}
            <div
                style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "#ffffff",
                    borderRadius: "16px",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    zIndex: 1001,
                    maxWidth: "560px",
                    width: "90%",
                    maxHeight: "90vh",
                    overflowY: "auto",
                    boxSizing: "border-box",
                }}
            >
                <div
                    style={{
                        padding: "18px 24px",
                        borderBottom: "1px solid #e2e8f0",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <h2 style={{ fontSize: "18px", margin: 0, fontWeight: "700", color: "#0f172a" }}>
                        List a Book for Sale
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            background: "transparent",
                            border: "none",
                            fontSize: "20px",
                            cursor: "pointer",
                            color: "#64748b",
                        }}
                    >
                        ✕
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}
                >
                    {generalError && (
                        <div
                            style={{
                                color: "#dc2626",
                                fontSize: "14px",
                                background: "#fee2e2",
                                padding: "10px 14px",
                                borderRadius: "8px",
                            }}
                        >
                            {generalError}
                        </div>
                    )}

                    {/* 1. Book Photo */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>
                            Book Photo URL *
                        </label>
                        <input
                            type="url"
                            placeholder="https://images.unsplash.com/..."
                            value={form.image}
                            onChange={(e) => handleChange("image", e.target.value)}
                            required
                            style={{
                                padding: "10px 14px",
                                borderRadius: "8px",
                                border: fieldErrors.image ? "1px solid #ef4444" : "1px solid #cbd5e1",
                                fontSize: "14px",
                                outline: "none",
                            }}
                        />
                        {fieldErrors.image && (
                            <span style={{ color: "#ef4444", fontSize: "12px" }}>{fieldErrors.image}</span>
                        )}
                    </div>

                    {/* 2. Listing Type */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>
                            Listing Type *
                        </label>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                            {[
                                { label: "For Sale", val: "for_sale" },
                                { label: "For Sale & Exchange", val: "for_sale_and_exchange" },
                            ].map((opt) => (
                                <button
                                    key={opt.val}
                                    type="button"
                                    onClick={() => handleChange("listingType", opt.val)}
                                    style={{
                                        padding: "10px 12px",
                                        borderRadius: "8px",
                                        fontWeight: "600",
                                        fontSize: "13px",
                                        cursor: "pointer",
                                        border: form.listingType === opt.val ? "2px solid #f97316" : "1px solid #cbd5e1",
                                        backgroundColor: form.listingType === opt.val ? "#fff7ed" : "#ffffff",
                                        color: form.listingType === opt.val ? "#ea580c" : "#475569",
                                    }}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 3. Book Title */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>
                            Book Title *
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Software Engineering 10th Ed."
                            value={form.title}
                            onChange={(e) => handleChange("title", e.target.value)}
                            required
                            style={{
                                padding: "10px 14px",
                                borderRadius: "8px",
                                border: fieldErrors.title ? "1px solid #ef4444" : "1px solid #cbd5e1",
                                fontSize: "14px",
                                outline: "none",
                            }}
                        />
                        {fieldErrors.title && (
                            <span style={{ color: "#ef4444", fontSize: "12px" }}>{fieldErrors.title}</span>
                        )}
                    </div>

                    {/* 4. Author (Optional) */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>
                            Author <span style={{ fontWeight: "400", color: "#94a3b8" }}>(Optional)</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Ian Sommerville"
                            value={form.author}
                            onChange={(e) => handleChange("author", e.target.value)}
                            style={{
                                padding: "10px 14px",
                                borderRadius: "8px",
                                border: "1px solid #cbd5e1",
                                fontSize: "14px",
                                outline: "none",
                            }}
                        />
                    </div>

                    {/* 5. Category */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>
                            Category *
                        </label>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                            {[
                                { label: "Academic", val: "academic" },
                                { label: "General", val: "general" },
                            ].map((cat) => (
                                <button
                                    key={cat.val}
                                    type="button"
                                    onClick={() => handleChange("category", cat.val)}
                                    style={{
                                        padding: "10px 12px",
                                        borderRadius: "8px",
                                        fontWeight: "600",
                                        fontSize: "13px",
                                        cursor: "pointer",
                                        border: form.category === cat.val ? "2px solid #f97316" : "1px solid #cbd5e1",
                                        backgroundColor: form.category === cat.val ? "#fff7ed" : "#ffffff",
                                        color: form.category === cat.val ? "#ea580c" : "#475569",
                                    }}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Academic Hierarchy */}
                    {form.category === "academic" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", background: "#f8fafc", padding: "14px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                <label style={{ fontSize: "12px", fontWeight: "600", color: "#334155" }}>University *</label>
                                <select
                                    value={form.universityId}
                                    onChange={(e) => handleChange("universityId", e.target.value)}
                                    style={{
                                        padding: "8px 12px",
                                        borderRadius: "6px",
                                        border: fieldErrors.university_id ? "1px solid #ef4444" : "1px solid #cbd5e1",
                                        fontSize: "13px",
                                        backgroundColor: "#fff",
                                        outline: "none",
                                    }}
                                >
                                    <option value="">Select University</option>
                                    {universities.map((u) => (
                                        <option key={u.id} value={u.id}>{u.name}</option>
                                    ))}
                                </select>
                            </div>

                            {form.universityId && (
                                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                    <label style={{ fontSize: "12px", fontWeight: "600", color: "#334155" }}>Faculty *</label>
                                    <select
                                        value={form.facultyId}
                                        onChange={(e) => handleChange("facultyId", e.target.value)}
                                        style={{
                                            padding: "8px 12px",
                                            borderRadius: "6px",
                                            border: fieldErrors.faculty_id ? "1px solid #ef4444" : "1px solid #cbd5e1",
                                            fontSize: "13px",
                                            backgroundColor: "#fff",
                                            outline: "none",
                                        }}
                                    >
                                        <option value="">Select Faculty</option>
                                        {faculties.map((f) => (
                                            <option key={f.id} value={f.id}>{f.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {form.facultyId && (
                                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                    <label style={{ fontSize: "12px", fontWeight: "600", color: "#334155" }}>Major *</label>
                                    <select
                                        value={form.majorId}
                                        onChange={(e) => handleChange("majorId", e.target.value)}
                                        style={{
                                            padding: "8px 12px",
                                            borderRadius: "6px",
                                            border: fieldErrors.major_id ? "1px solid #ef4444" : "1px solid #cbd5e1",
                                            fontSize: "13px",
                                            backgroundColor: "#fff",
                                            outline: "none",
                                        }}
                                    >
                                        <option value="">Select Major</option>
                                        {majors.map((m) => (
                                            <option key={m.id} value={m.id}>{m.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    )}

                    {/* General Sub-Type */}
                    {form.category === "general" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>
                                Sub-Type *
                            </label>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                {[
                                    { label: "Book", val: "book" },
                                    { label: "Novel", val: "novel" },
                                ].map((sub) => (
                                    <button
                                        key={sub.val}
                                        type="button"
                                        onClick={() => handleChange("subType", sub.val)}
                                        style={{
                                            padding: "8px 12px",
                                            borderRadius: "8px",
                                            fontWeight: "600",
                                            fontSize: "13px",
                                            cursor: "pointer",
                                            border: form.subType === sub.val ? "2px solid #f97316" : "1px solid #cbd5e1",
                                            backgroundColor: form.subType === sub.val ? "#fff7ed" : "#ffffff",
                                            color: form.subType === sub.val ? "#ea580c" : "#475569",
                                        }}
                                    >
                                        {sub.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 6. Price and Conditional Exchange */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>
                                Price (JOD) *
                            </label>
                            <input
                                type="number"
                                step="0.5"
                                min="0.1"
                                placeholder="10.00"
                                value={form.price}
                                onChange={(e) => handleChange("price", e.target.value)}
                                required
                                style={{
                                    padding: "10px 14px",
                                    borderRadius: "8px",
                                    border: fieldErrors.price ? "1px solid #ef4444" : "1px solid #cbd5e1",
                                    fontSize: "14px",
                                    outline: "none",
                                }}
                            />
                            {fieldErrors.price && (
                                <span style={{ color: "#ef4444", fontSize: "12px" }}>{fieldErrors.price}</span>
                            )}
                        </div>

                        {form.listingType === "for_sale_and_exchange" && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>
                                    Exchange For *
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Looking to exchange for Calculus 9th Edition"
                                    value={form.exchangeFor}
                                    onChange={(e) => handleChange("exchangeFor", e.target.value)}
                                    required
                                    style={{
                                        padding: "10px 14px",
                                        borderRadius: "8px",
                                        border: fieldErrors.exchange_for ? "1px solid #ef4444" : "1px solid #cbd5e1",
                                        fontSize: "14px",
                                        outline: "none",
                                    }}
                                />
                                {fieldErrors.exchange_for && (
                                    <span style={{ color: "#ef4444", fontSize: "12px" }}>{fieldErrors.exchange_for}</span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* 7. Condition Pills */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>
                            Condition *
                        </label>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                            {[
                                { label: "New", val: "new" },
                                { label: "Good", val: "good" },
                                { label: "Fair", val: "fair" },
                            ].map((c) => (
                                <button
                                    key={c.val}
                                    type="button"
                                    onClick={() => handleChange("condition", c.val)}
                                    style={{
                                        padding: "8px 12px",
                                        borderRadius: "8px",
                                        fontWeight: "600",
                                        fontSize: "13px",
                                        cursor: "pointer",
                                        border: form.condition === c.val ? "2px solid #f97316" : "1px solid #cbd5e1",
                                        backgroundColor: form.condition === c.val ? "#fff7ed" : "#ffffff",
                                        color: form.condition === c.val ? "#ea580c" : "#475569",
                                    }}
                                >
                                    {c.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 8. Description */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>
                            Description *
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Describe the condition, notes, or highlights inside the book..."
                            value={form.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                            required
                            style={{
                                padding: "10px 14px",
                                borderRadius: "8px",
                                border: fieldErrors.description ? "1px solid #ef4444" : "1px solid #cbd5e1",
                                fontSize: "14px",
                                outline: "none",
                                resize: "vertical",
                            }}
                        />
                        {fieldErrors.description && (
                            <span style={{ color: "#ef4444", fontSize: "12px" }}>{fieldErrors.description}</span>
                        )}
                    </div>

                    {/* 9 & 10. Actions & Real-Time Disabled Publish Button */}
                    <div
                        style={{
                            display: "flex",
                            gap: "12px",
                            justifyContent: "flex-end",
                            marginTop: "8px",
                        }}
                    >
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: "10px 18px",
                                borderRadius: "8px",
                                border: "1px solid #cbd5e1",
                                backgroundColor: "#f8fafc",
                                color: "#475569",
                                fontWeight: "600",
                                cursor: "pointer",
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!isFormValid || loading}
                            style={{
                                padding: "10px 22px",
                                borderRadius: "8px",
                                border: "none",
                                backgroundColor: isFormValid && !loading ? "#f97316" : "#cbd5e1",
                                color: "#ffffff",
                                fontWeight: "600",
                                cursor: isFormValid && !loading ? "pointer" : "not-allowed",
                                transition: "all 0.2s ease",
                            }}
                        >
                            {loading ? "Publishing..." : "Publish Book"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}