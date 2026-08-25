import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const GENERAL_CATEGORIES = [
    "Novels & Fiction",
    "Summaries & Notes",
    "Calculators & Tools",
    "Stationery",
    "Self-Help",
    "Other",
];

export default function AddBookModal({ isOpen, onClose, onBookAdded }) {
    const { token } = useAuth();

    const [form, setForm] = useState({
        title: "",
        price: "",
        coverImage: "",
        category: "academic",
        type: "Used",
        generalCategory: "Novels & Fiction",
        universityId: "",
        facultyId: "",
        majorId: "",
    });

    const [universities, setUniversities] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [majors, setMajors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Load universities when modal opens
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

    // Load faculties on university change
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

    // Load majors on faculty change
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

    if (!isOpen) return null;

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
            }
            return next;
        });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim() || !form.price) {
            setError("Title and Price are required.");
            return;
        }

        setLoading(true);
        setError("");

        const payload = {
            title: form.title.trim(),
            price: parseFloat(form.price),
            imagesUrl: form.coverImage ? [form.coverImage.trim()] : [],
            category: form.category,
            type: form.category === "academic" ? form.type : form.generalCategory,
            universityId: form.category === "academic" && form.universityId ? Number(form.universityId) : null,
            facultyId: form.category === "academic" && form.facultyId ? Number(form.facultyId) : null,
            majorId: form.category === "academic" && form.majorId ? Number(form.majorId) : null,
        };

        try {
            const response = await fetch("http://localhost:8080/api/books", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.message || "Failed to create book listing.");
            }

            if (onBookAdded) onBookAdded();
            onClose();
        } catch (err) {
            setError(err.message || "Network error. Please try again.");
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

            {/* Modal Dialog */}
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
                    maxWidth: "520px",
                    width: "90%",
                    maxHeight: "90vh",
                    overflowY: "auto",
                    boxSizing: "border-box",
                }}
            >
                <div
                    style={{
                        padding: "20px 24px",
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
                    {error && (
                        <div
                            style={{
                                color: "#dc2626",
                                fontSize: "14px",
                                background: "#fee2e2",
                                padding: "10px 14px",
                                borderRadius: "8px",
                            }}
                        >
                            {error}
                        </div>
                    )}

                    {/* Book Title */}
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
                                border: "1px solid #cbd5e1",
                                fontSize: "14px",
                                outline: "none",
                            }}
                        />
                    </div>

                    {/* Category Selection (Academic vs General) */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>
                            Category *
                        </label>
                        <select
                            value={form.category}
                            onChange={(e) => handleChange("category", e.target.value)}
                            style={{
                                padding: "10px 14px",
                                borderRadius: "8px",
                                border: "1px solid #cbd5e1",
                                fontSize: "14px",
                                backgroundColor: "#fff",
                                outline: "none",
                            }}
                        >
                            <option value="academic">Academic (University Books)</option>
                            <option value="general">General (Novels, Self-Help, Stationery)</option>
                        </select>
                    </div>

                    {/* Price and Condition */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>
                                Price (JOD) *
                            </label>
                            <input
                                type="number"
                                step="0.5"
                                min="0"
                                placeholder="10.00"
                                value={form.price}
                                onChange={(e) => handleChange("price", e.target.value)}
                                required
                                style={{
                                    padding: "10px 14px",
                                    borderRadius: "8px",
                                    border: "1px solid #cbd5e1",
                                    fontSize: "14px",
                                    outline: "none",
                                }}
                            />
                        </div>

                        {form.category === "academic" ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>
                                    Condition
                                </label>
                                <select
                                    value={form.type}
                                    onChange={(e) => handleChange("type", e.target.value)}
                                    style={{
                                        padding: "10px 14px",
                                        borderRadius: "8px",
                                        border: "1px solid #cbd5e1",
                                        fontSize: "14px",
                                        backgroundColor: "#fff",
                                        outline: "none",
                                    }}
                                >
                                    <option value="Used">Used</option>
                                    <option value="New">New</option>
                                    <option value="Summary">Summary / Notes</option>
                                    <option value="Swap">Swap</option>
                                </select>
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>
                                    Item Type
                                </label>
                                <select
                                    value={form.generalCategory}
                                    onChange={(e) => handleChange("generalCategory", e.target.value)}
                                    style={{
                                        padding: "10px 14px",
                                        borderRadius: "8px",
                                        border: "1px solid #cbd5e1",
                                        fontSize: "14px",
                                        backgroundColor: "#fff",
                                        outline: "none",
                                    }}
                                >
                                    {GENERAL_CATEGORIES.map((c) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Cover Image URL */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>
                            Cover Image URL
                        </label>
                        <input
                            type="url"
                            placeholder="https://images.unsplash.com/..."
                            value={form.coverImage}
                            onChange={(e) => handleChange("coverImage", e.target.value)}
                            style={{
                                padding: "10px 14px",
                                borderRadius: "8px",
                                border: "1px solid #cbd5e1",
                                fontSize: "14px",
                                outline: "none",
                            }}
                        />
                    </div>

                    {/* Academic Hierarchy (Only if Category === 'academic') */}
                    {form.category === "academic" && (
                        <>
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>
                                    University
                                </label>
                                <select
                                    value={form.universityId}
                                    onChange={(e) => handleChange("universityId", e.target.value)}
                                    style={{
                                        padding: "10px 14px",
                                        borderRadius: "8px",
                                        border: "1px solid #cbd5e1",
                                        fontSize: "14px",
                                        backgroundColor: "#fff",
                                        outline: "none",
                                    }}
                                >
                                    <option value="">Select University (Optional)</option>
                                    {universities.map((u) => (
                                        <option key={u.id} value={u.id}>{u.name}</option>
                                    ))}
                                </select>
                            </div>

                            {form.universityId && (
                                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>
                                        Faculty
                                    </label>
                                    <select
                                        value={form.facultyId}
                                        onChange={(e) => handleChange("facultyId", e.target.value)}
                                        style={{
                                            padding: "10px 14px",
                                            borderRadius: "8px",
                                            border: "1px solid #cbd5e1",
                                            fontSize: "14px",
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
                                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>
                                        Major
                                    </label>
                                    <select
                                        value={form.majorId}
                                        onChange={(e) => handleChange("majorId", e.target.value)}
                                        style={{
                                            padding: "10px 14px",
                                            borderRadius: "8px",
                                            border: "1px solid #cbd5e1",
                                            fontSize: "14px",
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
                        </>
                    )}

                    {/* Actions */}
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
                            disabled={loading}
                            style={{
                                padding: "10px 20px",
                                borderRadius: "8px",
                                border: "none",
                                backgroundColor: "#f97316",
                                color: "#ffffff",
                                fontWeight: "600",
                                cursor: loading ? "not-allowed" : "pointer",
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