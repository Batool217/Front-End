import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, Camera } from "lucide-react";
import "../styles/css/editprofile.css";

const API_BASE = "http://localhost:8080/api/v1";

export default function EditProfile() {
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const fileInputRef = useRef(null);

    // Resolve user ID across different JWT/Context schemas
    const currentUserId = user?.userId || user?.id || user?.sub;

    // 1. Pre-fill state immediately with signup/login data already in user context
    const [form, setForm] = useState({
        fullName: user?.fullName || user?.full_name || user?.name || "",
        phoneNumber: user?.phoneNumber || user?.phone_number || user?.phone || "",
        email: user?.email || "",
        bio: user?.bio || "",
    });
    const [profileImage, setProfileImage] = useState(
        user?.profileImage || user?.profile_image || user?.avatarUrl || ""
    );
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // 2. Sync if user context loads slightly after initial render
    useEffect(() => {
        if (user) {
            setForm((prev) => ({
                fullName: prev.fullName || user.fullName || user.full_name || user.name || "",
                phoneNumber: prev.phoneNumber || user.phoneNumber || user.phone_number || user.phone || "",
                email: prev.email || user.email || "",
                bio: prev.bio || user.bio || "",
            }));
            if (!profileImage && (user.profileImage || user.profile_image || user.avatarUrl)) {
                setProfileImage(user.profileImage || user.profile_image || user.avatarUrl);
            }
        }
    }, [user]);

    // 3. Fetch latest database record
    useEffect(() => {
        if (!currentUserId) return;

        fetch(`${API_BASE}/users/${currentUserId}/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(async (res) => {
                if (!res.ok) throw new Error("Could not fetch profile");
                return res.json();
            })
            .then((data) => {
                setForm({
                    fullName: data.fullName || data.full_name || data.name || user?.fullName || user?.name || "",
                    phoneNumber: data.phoneNumber || data.phone_number || data.phone || user?.phoneNumber || user?.phone || "",
                    email: data.email || user?.email || "",
                    bio: data.bio || "",
                });
                setProfileImage(
                    data.profileImage ||
                    data.profile_image ||
                    data.avatarUrl ||
                    data.avatar_url ||
                    ""
                );
            })
            .catch((err) => {
                console.error("Fetch profile error:", err);
            });
    }, [currentUserId, token]);

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
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Upload failed.");
            setProfileImage(data.url || data.imageUrl || data.fileUrl);
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleCancel = () => navigate("/profile");

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        try {
            const res = await fetch(`${API_BASE}/users/${currentUserId}/profile`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fullName: form.fullName,
                    full_name: form.fullName,
                    phoneNumber: form.phoneNumber,
                    phone_number: form.phoneNumber,
                    email: form.email,
                    bio: form.bio,
                    profileImage: profileImage,
                    profile_image: profileImage,
                }),
            });
            if (!res.ok) throw new Error("Failed to save changes.");
            navigate("/profile");
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="edit-profile-page">
            <h1>Edit Profile</h1>
            <p className="edit-profile-subtitle">Update your personal information and profile photo.</p>

            <form className="edit-profile-card" onSubmit={handleSave}>
                <div className="edit-avatar-row">
                    <div className="edit-avatar-wrap" onClick={handlePhotoClick} style={{ cursor: "pointer", position: "relative" }}>
                        {profileImage ? (
                            <img src={profileImage} alt="avatar" />
                        ) : (
                            <div className="edit-avatar placeholder">
                                <User size={40} color="#f97316" />
                            </div>
                        )}
                        <span className="edit-avatar-badge">
                            <Camera size={14} />
                        </span>
                    </div>
                    <div>
                        <h3>{form.fullName || user?.fullName || user?.name || "Your name"}</h3>
                        <span className="change-photo-link" onClick={handlePhotoClick}>
                            {uploading ? "Uploading..." : "Change profile photo"}
                        </span>
                        <input
                            type="file"
                            accept="image/png, image/jpeg, image/webp"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={handlePhotoChange}
                        />
                    </div>
                </div>

                <hr />

                <div className="edit-form-grid">
                    <div className="form-field">
                        <label>Full Name</label>
                        <input
                            type="text"
                            value={form.fullName || ""}
                            onChange={(e) => handleChange("fullName", e.target.value)}
                            placeholder="Enter your full name"
                        />
                    </div>
                    <div className="form-field">
                        <label>Phone Number</label>
                        <input
                            type="text"
                            value={form.phoneNumber || ""}
                            onChange={(e) => handleChange("phoneNumber", e.target.value)}
                            placeholder="Enter your phone number"
                        />
                    </div>
                </div>

                <div className="form-field">
                    <label>Email Address</label>
                    <input
                        type="email"
                        value={form.email || ""}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="Enter your email address"
                    />
                </div>

                <div className="form-field">
                    <label>Bio (optional)</label>
                    <textarea
                        rows={3}
                        value={form.bio || ""}
                        onChange={(e) => handleChange("bio", e.target.value)}
                        placeholder="Tell others a bit about yourself..."
                    />
                </div>

                {error && <p className="edit-profile-error">{error}</p>}

                <div className="edit-form-actions">
                    <button type="button" className="btn-cancel" onClick={handleCancel}>
                        Cancel
                    </button>
                    <button type="submit" className="btn-save" disabled={saving}>
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}