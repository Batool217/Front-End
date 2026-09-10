import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { User, Camera, Loader2, ArrowLeft } from "lucide-react";
import "../styles/css/editprofile.css";

const API_BASE = "http://localhost:8080/api/v1";
const BACKEND_URL = "http://localhost:8080";

const resolveImageUrl = (path) => {
    if (!path || typeof path !== "string" || path.trim() === "" || path === "null") return null;
    if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
        return path;
    }
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${BACKEND_URL}${cleanPath}`;
};

export default function EditProfile() {
    const navigate = useNavigate();
    const { user, token, updateUser } = useAuth();
    const fileInputRef = useRef(null);

    const currentUserId = user?.user_id || user?.userId || user?.id;

    const [form, setForm] = useState({
        fullName: user?.full_name || user?.fullName || user?.name || "",
        phoneNumber: user?.phone_number || user?.phoneNumber || user?.phone || "",
        email: user?.email || "",
    });

    const [profileImage, setProfileImage] = useState(
        user?.profile_image || user?.profileImage || ""
    );
    const [imageError, setImageError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loadingInitial, setLoadingInitial] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!currentUserId) {
            setLoadingInitial(false);
            return;
        }

        let isMounted = true;

        fetch(`${API_BASE}/users/${currentUserId}/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(async (res) => {
                if (!res.ok) throw new Error("Could not fetch profile details.");
                return res.json();
            })
            .then((data) => {
                if (!isMounted) return;
                setForm({
                    fullName: data.full_name || data.fullName || data.name || "",
                    phoneNumber: data.phone_number || data.phoneNumber || data.phone || "",
                    email: data.email || user?.email || "",
                });
                const img = data.profile_image || data.profileImage || "";
                if (img) {
                    setProfileImage(img);
                    setImageError(false);
                }
            })
            .catch((err) => {
                console.error("Fetch profile error:", err);
            })
            .finally(() => {
                if (isMounted) setLoadingInitial(false);
            });

        return () => {
            isMounted = false;
        };
    }, [currentUserId, token, user?.email]);

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handlePhotoClick = () => fileInputRef.current?.click();

    const handlePhotoChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError("");
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch(`${API_BASE}/upload`, {
                method: "POST",
                headers: token ? { Authorization: `Bearer ${token}` } : {},
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Upload failed.");

            const uploadedUrl = data.url || data.imageUrl || data.fileUrl;
            setProfileImage(uploadedUrl);
            setImageError(false);
        } catch (err) {
            setError(err.message || "Failed to upload photo.");
        } finally {
            setUploading(false);
        }
    };

    const handleCancel = () => navigate("/profile");

    const handleSave = async (e) => {
        e.preventDefault();
        if (!currentUserId) {
            setError("User session not found. Please log in again.");
            return;
        }

        setSaving(true);
        setError("");

        const payload = {
            full_name: form.fullName.trim(),
            phone_number: form.phoneNumber.trim(),
            profile_image: profileImage || null,
        };

        try {
            const res = await fetch(`${API_BASE}/users/${currentUserId}/profile`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || data.message || "Failed to save changes.");
            }

            const updatedData = await res.json().catch(() => ({}));

            if (updateUser) {
                updateUser({
                    ...user,
                    ...updatedData,
                    name: form.fullName.trim(),
                    full_name: form.fullName.trim(),
                    phone_number: form.phoneNumber.trim(),
                    profile_image: profileImage || null,
                    profileImage: profileImage || null,
                });
            }

            navigate("/profile");
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const resolvedAvatarUrl = resolveImageUrl(profileImage);

    return (
        <div className="edit-profile-wrapper">
            <Navbar />

            <div className="edit-profile-container">
                <button type="button" className="back-link-btn" onClick={handleCancel}>
                    <ArrowLeft size={16} />
                    <span>Back to Profile</span>
                </button>

                <div className="edit-profile-header">
                    <h1>Edit Profile</h1>
                    <p>Update your personal information and profile photo.</p>
                </div>

                {loadingInitial ? (
                    <div className="edit-profile-loading">
                        <Loader2 size={32} className="spinner-icon" />
                        <p>Loading profile details...</p>
                    </div>
                ) : (
                    <form className="edit-profile-card" onSubmit={handleSave}>
                        <div className="edit-avatar-row">
                            <div className="edit-avatar-wrap" onClick={handlePhotoClick}>
                                {resolvedAvatarUrl && !imageError ? (
                                    <img
                                        src={resolvedAvatarUrl}
                                        alt="avatar"
                                        className="edit-avatar-img"
                                        onError={() => setImageError(true)}
                                    />
                                ) : (
                                    <div className="edit-avatar-placeholder">
                                        <User size={38} className="edit-placeholder-icon" />
                                    </div>
                                )}
                                <div className="edit-avatar-badge">
                                    {uploading ? (
                                        <Loader2 size={13} className="spinner-icon" />
                                    ) : (
                                        <Camera size={14} />
                                    )}
                                </div>
                            </div>

                            <div className="edit-avatar-info">
                                <h3>{form.fullName || "Your name"}</h3>
                                <button
                                    type="button"
                                    className="change-photo-btn"
                                    onClick={handlePhotoClick}
                                    disabled={uploading}
                                >
                                    {uploading ? "Uploading photo..." : "Change profile photo"}
                                </button>
                                <input
                                    type="file"
                                    accept="image/png, image/jpeg, image/webp"
                                    ref={fileInputRef}
                                    style={{ display: "none" }}
                                    onChange={handlePhotoChange}
                                />
                            </div>
                        </div>

                        <div className="edit-form-grid">
                            <div className="form-field">
                                <label>Full Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={form.fullName}
                                    onChange={(e) => handleChange("fullName", e.target.value)}
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div className="form-field">
                                <label>Phone Number *</label>
                                <input
                                    type="text"
                                    required
                                    value={form.phoneNumber}
                                    onChange={(e) => handleChange("phoneNumber", e.target.value)}
                                    placeholder="Enter your phone number"
                                />
                            </div>
                        </div>

                        <div className="form-field">
                            <label>Email Address</label>
                            <input
                                type="email"
                                disabled
                                value={form.email}
                                className="input-disabled"
                            />
                            <span className="field-hint">Email address cannot be modified.</span>
                        </div>

                        {error && <p className="edit-profile-error">{error}</p>}

                        <div className="edit-form-actions">
                            <button type="button" className="btn-cancel" onClick={handleCancel}>
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn-save"
                                disabled={saving || uploading}
                            >
                                {saving ? "Saving Changes..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}