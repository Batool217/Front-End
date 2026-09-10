import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { Loader2, ArrowLeft } from "lucide-react";
import "../styles/css/mylistings.css";

const API_BASE = "http://localhost:8080/api/v1";

export default function EditListing() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const fileInputRef = useRef(null);

    const [form, setForm] = useState(null);
    const [initialLoading, setInitialLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const [universities, setUniversities] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [majors, setMajors] = useState([]);

    const [fieldErrors, setFieldErrors] = useState({});
    const [generalError, setGeneralError] = useState("");

    // Load universities
    useEffect(() => {
        fetch(`${API_BASE}/universities`)
            .then((res) => (res.ok ? res.json() : []))
            .then((data) => setUniversities(Array.isArray(data) ? data : []))
            .catch((err) => console.error("Error loading universities:", err));
    }, []);

    // Load initial listing data
    useEffect(() => {
        let isMounted = true;
        const fetchListing = async () => {
            try {
                const res = await fetch(`${API_BASE}/listings/${id}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });
                if (!res.ok) throw new Error("Failed to load listing details.");
                const data = await res.json();

                if (!isMounted) return;

                const imagesArr = Array.isArray(data.imagesUrl || data.images_url)
                    ? (data.imagesUrl || data.images_url)
                    : data.image
                        ? [data.image]
                        : [];

                setForm({
                    images: imagesArr,
                    listingType: data.listingType || data.listing_type || "for_sale",
                    title: data.title || "",
                    author: data.author || "",
                    category: data.category || "academic",
                    universityId: data.universityId || data.university_id || "",
                    facultyId: data.facultyId || data.faculty_id || "",
                    majorId: data.majorId || data.major_id || "",
                    subType: data.subType || data.sub_type || "book",
                    price: data.price !== null && data.price !== undefined ? String(data.price) : "",
                    exchangeFor: data.exchangeFor || data.exchange_for || "",
                    condition: data.condition || "good",
                    description: data.description || "",
                });
            } catch (err) {
                if (isMounted) setGeneralError(err.message);
            } finally {
                if (isMounted) setInitialLoading(false);
            }
        };

        void fetchListing();
        return () => {
            isMounted = false;
        };
    }, [id, token]);

    // Cascading: Load faculties on university change
    useEffect(() => {
        if (!form?.universityId) {
            setFaculties([]);
            return;
        }
        fetch(`${API_BASE}/faculties?university_id=${form.universityId}`)
            .then((res) => (res.ok ? res.json() : []))
            .then((data) => setFaculties(Array.isArray(data) ? data : []))
            .catch((err) => console.error("Error loading faculties:", err));
    }, [form?.universityId]);

    // Cascading: Load majors on faculty change
    useEffect(() => {
        if (!form?.facultyId) {
            setMajors([]);
            return;
        }
        fetch(`${API_BASE}/majors?faculty_id=${form.facultyId}`)
            .then((res) => (res.ok ? res.json() : []))
            .then((data) => setMajors(Array.isArray(data) ? data : []))
            .catch((err) => console.error("Error loading majors:", err));
    }, [form?.facultyId]);

    const handleChange = (field, value) => {
        setForm((prev) => {
            const next = { ...prev, [field]: value };
            if (field === "universityId") {
                next.facultyId = "";
                next.majorId = "";
            } else if (field === "facultyId") {
                next.majorId = "";
            } else if (field === "category" && value === "general") {
                next.universityId = "";
                next.facultyId = "";
                next.majorId = "";
            } else if (field === "listingType" && value === "for_sale") {
                next.exchangeFor = "";
            }
            return next;
        });

        if (fieldErrors[field]) {
            setFieldErrors((prev) => {
                const updated = { ...prev };
                delete updated[field];
                return updated;
            });
        }
    };

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setUploadingImage(true);
        try {
            const uploadPromises = files.map(async (file) => {
                const formData = new FormData();
                formData.append("file", file);

                const res = await fetch(`${API_BASE}/upload`, {
                    method: "POST",
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                    body: formData,
                });

                const data = await res.json().catch(() => ({}));
                if (!res.ok) throw new Error(data.error || "Failed to upload image.");
                return data.url || data.imageUrl || data;
            });

            const newUrls = await Promise.all(uploadPromises);
            handleChange("images", [...(form?.images || []), ...newUrls]);
        } catch (err) {
            setFieldErrors((prev) => ({ ...prev, images: err.message }));
        } finally {
            setUploadingImage(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleRemoveImage = (indexToRemove) => {
        handleChange(
            "images",
            form.images.filter((_, idx) => idx !== indexToRemove)
        );
    };

    const isFormValid = useMemo(() => {
        if (!form) return false;
        if (form.images.length === 0) return false;
        if (!form.title.trim()) return false;
        if (!form.condition) return false;

        if (form.listingType === "for_sale") {
            const num = parseFloat(form.price);
            if (isNaN(num) || num <= 0) return false;
        } else if (form.listingType === "for_sale_and_exchange") {
            if (!form.exchangeFor.trim()) return false;
            if (form.price !== "") {
                const num = parseFloat(form.price);
                if (isNaN(num) || num < 0) return false;
            }
        }

        if (form.category === "academic") {
            if (!form.universityId || !form.facultyId || !form.majorId) return false;
        }

        return true;
    }, [form]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid || submitting || uploadingImage) return;

        setSubmitting(true);
        setFieldErrors({});
        setGeneralError("");

        const parsedPrice =
            form.price !== "" && !isNaN(parseFloat(form.price))
                ? parseFloat(form.price)
                : null;

        const payload = {
            coverImage: form.images[0] || "",
            image: form.images[0] || "",
            images_url: form.images,
            listing_type: form.listingType,
            title: form.title.trim(),
            author: form.author.trim() || null,
            category: form.category,
            university_id: form.category === "academic" ? Number(form.universityId) : null,
            faculty_id: form.category === "academic" ? Number(form.facultyId) : null,
            major_id: form.category === "academic" ? Number(form.majorId) : null,
            sub_type: form.category === "general" ? form.subType : null,
            price: parsedPrice,
            exchange_for: form.listingType === "for_sale_and_exchange" ? form.exchangeFor.trim() : null,
            condition: form.condition,
            description: form.description.trim(),
        };

        try {
            const response = await fetch(`${API_BASE}/listings/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                if (data.errors) setFieldErrors(data.errors);
                else setGeneralError(data.error || data.message || "Failed to update listing.");
                return;
            }

            navigate("/mylistings");
        } catch (err) {
            setGeneralError(err.message || "Network error. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="listings-page-wrapper">
                <Navbar />
                <div className="listings-loading-state">
                    <Loader2 size={32} className="spinner-icon" />
                    <p>Loading book details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="listings-page-wrapper">
            <Navbar />

            <div className="listings-content-container" style={{ maxWidth: 700, margin: "24px auto" }}>
                <button
                    onClick={() => navigate("/mylistings")}
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        background: "none",
                        border: "none",
                        color: "#64748b",
                        fontWeight: 600,
                        fontSize: 14,
                        cursor: "pointer",
                        marginBottom: 16,
                    }}
                >
                    <ArrowLeft size={16} /> Back to My Listings
                </button>

                <div
                    style={{
                        background: "#fff",
                        borderRadius: 16,
                        border: "1px solid #e2e8f0",
                        padding: "28px",
                        boxShadow: "0 4px 20px rgba(18, 52, 91, 0.05)",
                    }}
                >
                    <h1 style={{ fontSize: 22, fontWeight: 800, color: "#12345b", margin: "0 0 4px" }}>
                        Edit Book Listing
                    </h1>
                    <p style={{ color: "#64748b", fontSize: 13.5, margin: "0 0 20px" }}>
                        Update the information, pricing, or photos for this book.
                    </p>

                    {generalError && (
                        <div
                            style={{
                                color: "#dc2626",
                                background: "#fee2e2",
                                padding: "10px 14px",
                                borderRadius: 8,
                                fontSize: 14,
                                marginBottom: 16,
                            }}
                        >
                            {generalError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                        {/* Photos */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <label style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>
                                    Book Photos * ({form.images.length})
                                </label>
                                <label
                                    htmlFor="edit-photos-input"
                                    style={{ fontSize: 12, fontWeight: 600, color: "#f97316", cursor: "pointer" }}
                                >
                                    + Add more photos
                                </label>
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                id="edit-photos-input"
                                multiple
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: "none" }}
                            />

                            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                                {form.images.map((url, idx) => (
                                    <div
                                        key={url + idx}
                                        style={{
                                            position: "relative",
                                            aspectRatio: "3/4",
                                            borderRadius: 8,
                                            overflow: "hidden",
                                            border: idx === 0 ? "2px solid #f97316" : "1px solid #cbd5e1",
                                        }}
                                    >
                                        <img src={url} alt="cover" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        {idx === 0 && (
                                            <span
                                                style={{
                                                    position: "absolute",
                                                    bottom: 4,
                                                    left: 4,
                                                    backgroundColor: "rgba(249, 115, 22, 0.9)",
                                                    color: "#fff",
                                                    fontSize: 10,
                                                    fontWeight: 700,
                                                    padding: "2px 5px",
                                                    borderRadius: 4,
                                                }}
                                            >
                                                Cover
                                            </span>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(idx)}
                                            style={{
                                                position: "absolute",
                                                top: 4,
                                                right: 4,
                                                background: "rgba(15, 23, 42, 0.75)",
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: "50%",
                                                width: 20,
                                                height: 20,
                                                fontSize: 11,
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Title */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <label style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>Book Title *</label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={(e) => handleChange("title", e.target.value)}
                                style={{
                                    padding: "10px 14px",
                                    borderRadius: 8,
                                    border: "1px solid #cbd5e1",
                                    fontSize: 14,
                                    outline: "none",
                                }}
                            />
                        </div>

                        {/* Author */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <label style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>Author</label>
                            <input
                                type="text"
                                value={form.author}
                                onChange={(e) => handleChange("author", e.target.value)}
                                style={{
                                    padding: "10px 14px",
                                    borderRadius: 8,
                                    border: "1px solid #cbd5e1",
                                    fontSize: 14,
                                    outline: "none",
                                }}
                            />
                        </div>

                        {/* Category */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <label style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>Category</label>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                {["academic", "general"].map((cat) => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => handleChange("category", cat)}
                                        style={{
                                            padding: "9px 12px",
                                            borderRadius: 8,
                                            fontWeight: 600,
                                            fontSize: 13,
                                            cursor: "pointer",
                                            border: form.category === cat ? "2px solid #f97316" : "1px solid #cbd5e1",
                                            backgroundColor: form.category === cat ? "#fff7ed" : "#ffffff",
                                            color: form.category === cat ? "#ea580c" : "#475569",
                                        }}
                                    >
                                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Academic Selectors */}
                        {form.category === "academic" && (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 10,
                                    background: "#f8fafc",
                                    padding: 14,
                                    borderRadius: 10,
                                    border: "1px solid #e2e8f0",
                                }}
                            >
                                <select
                                    value={form.universityId}
                                    onChange={(e) => handleChange("universityId", e.target.value)}
                                    style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13 }}
                                >
                                    <option value="">Select University</option>
                                    {universities.map((u) => (
                                        <option key={u.id} value={u.id}>
                                            {u.name}
                                        </option>
                                    ))}
                                </select>

                                {form.universityId && (
                                    <select
                                        value={form.facultyId}
                                        onChange={(e) => handleChange("facultyId", e.target.value)}
                                        style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13 }}
                                    >
                                        <option value="">Select Faculty</option>
                                        {faculties.map((f) => (
                                            <option key={f.id} value={f.id}>
                                                {f.name}
                                            </option>
                                        ))}
                                    </select>
                                )}

                                {form.facultyId && (
                                    <select
                                        value={form.majorId}
                                        onChange={(e) => handleChange("majorId", e.target.value)}
                                        style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13 }}
                                    >
                                        <option value="">Select Major</option>
                                        {majors.map((m) => (
                                            <option key={m.id} value={m.id}>
                                                {m.name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        )}

                        {/* Price */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <label style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>Price (JOD)</label>
                            <input
                                type="number"
                                step="any"
                                min="0"
                                value={form.price}
                                onChange={(e) => handleChange("price", e.target.value)}
                                style={{
                                    padding: "10px 14px",
                                    borderRadius: 8,
                                    border: "1px solid #cbd5e1",
                                    fontSize: 14,
                                    outline: "none",
                                }}
                            />
                        </div>

                        {/* Condition */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <label style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>Condition</label>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                                {["new", "good", "fair"].map((c) => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => handleChange("condition", c)}
                                        style={{
                                            padding: "8px 12px",
                                            borderRadius: 8,
                                            fontWeight: 600,
                                            fontSize: 13,
                                            cursor: "pointer",
                                            border: form.condition === c ? "2px solid #f97316" : "1px solid #cbd5e1",
                                            backgroundColor: form.condition === c ? "#fff7ed" : "#ffffff",
                                            color: form.condition === c ? "#ea580c" : "#475569",
                                        }}
                                    >
                                        {c.charAt(0).toUpperCase() + c.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <label style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>Description</label>
                            <textarea
                                rows={3}
                                value={form.description}
                                onChange={(e) => handleChange("description", e.target.value)}
                                style={{
                                    padding: "10px 14px",
                                    borderRadius: 8,
                                    border: "1px solid #cbd5e1",
                                    fontSize: 14,
                                    outline: "none",
                                    resize: "vertical",
                                }}
                            />
                        </div>

                        {/* Actions */}
                        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 10 }}>
                            <button
                                type="button"
                                onClick={() => navigate("/mylistings")}
                                style={{
                                    padding: "10px 18px",
                                    borderRadius: 8,
                                    border: "1px solid #cbd5e1",
                                    backgroundColor: "#f8fafc",
                                    color: "#475569",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!isFormValid || submitting || uploadingImage}
                                style={{
                                    padding: "10px 22px",
                                    borderRadius: 8,
                                    border: "none",
                                    backgroundColor: isFormValid && !submitting ? "#f97316" : "#cbd5e1",
                                    color: "#fff",
                                    fontWeight: 600,
                                    cursor: isFormValid && !submitting ? "pointer" : "not-allowed",
                                }}
                            >
                                {submitting ? "Saving Changes..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}